import sys
import re
import os

import numpy as np
from dateutil import parser
from datetime import datetime, timedelta
import torch
from transformers import AutoTokenizer, AutoModelForTokenClassification

from flask import Flask, request, jsonify



# 디바이스 설정
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

# 모델과 토크나이저 로드
MODEL_NAME = "beomi/KcELECTRA-base-v2022"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

# 태그 맵핑 설정
tag2id = {'POH_B': 0, 'CVL_B': 1, 'FLD_B': 2, 'FLD_I': 3, 'EVT_I': 4, 'AFW_B': 5, 'CVL_I': 6, 'NUM_B': 7, 'MAT_I': 8, 'TIM_I': 9, 'ANM_I': 10, 'PER_I': 11, 'POH_I': 12,
           'TRM_I': 13, 'TIM_B': 14, 'ANM_B': 15, 'O': 16, 'DAT_I': 17, 'DUR_I': 18, 'PNT_B': 19, 'PNT_I': 20, 'MNY_I': 21, 'EVT_B': 22, 'ORG_I': 23, 'MNY_B': 24,
           'ORG_B': 25, 'LOC_B': 26, 'PLT_I': 27, 'MAT_B': 28, 'DAT_B': 29, 'NUM_I': 30, 'AFW_I': 31, 'PLT_B': 32, 'DUR_B': 33, 'PER_B': 34, 'LOC_I': 35, 'NOH_B': 36,
           'TRM_B': 37, 'NOH_I': 38}
unique_tags = set(tag2id.keys())
id2tag = {v: k for k, v in tag2id.items()}

pad_token_id = tokenizer.pad_token_id
cls_token_id = tokenizer.cls_token_id
sep_token_id = tokenizer.sep_token_id
pad_token_label_id = tag2id['O']
cls_token_label_id = tag2id['O']
sep_token_label_id = tag2id['O']

# 모델 로드
model = AutoModelForTokenClassification.from_pretrained('saving_folder', num_labels=len(unique_tags))
model.to(device)


app = Flask(__name__)
@app.route('/ner', methods=['POST'])
def ner():
    data = request.json
    text = data['content']
    # NER 모델 실행 (이 부분을 실제 모델 호출 코드로 변경하세요)
    tokenized_text, rest = ner_inference(text)
    result = extract_schedule_info(tokenized_text, rest)
    print(result)
    return jsonify(result) 

def ner_inference(text):
    model.eval()
    text = text.replace(' ', '/')
    # text = re.sub('[-=+#/\?:^$.@*\"※&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》]', '', text)
    #추가
    # text = re.sub(r'[-=+#/\?:^$.@*"※&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》]', '', text)
    text = re.sub(r'[-=+#/\?:^$.@*\"※&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》]', '', text)

    predictions, true_labels = [], []

    tokenized_sent = tokenizer(text, padding=True, truncation=True, return_tensors='pt').to(device)
    input_ids = tokenized_sent['input_ids']
    attention_mask = tokenized_sent['attention_mask']
    token_type_ids = tokenized_sent.get('token_type_ids', None)

    with torch.no_grad():
        outputs = model(input_ids=input_ids, attention_mask=attention_mask, token_type_ids=token_type_ids)
    
    logits = outputs['logits']
    logits = logits.detach().cpu().numpy()
    label_ids = input_ids.cpu().numpy()

    predictions.extend([list(p) for p in np.argmax(logits, axis=2)])
    true_labels.append(label_ids)

    pred_tags = [id2tag[p_i] for p in predictions for p_i in p]

    token_list = tokenizer.convert_ids_to_tokens(input_ids.squeeze().tolist())
    token_list = [re.sub('[-=+,#/\?:^$.@*\"※~&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》]', '', token) for token in token_list]

    #추가
    tokenized_text = ''

    token_tag_pairs = []
    rest = []
    current_tag = None
    current_token = ''
    for token, tag in zip(token_list, pred_tags):
        if tag in ['NUM_B','NUM_I','DUR_B','DUR_I', 'TIM_B','TIM_I', 'DAT_B','DAT_I']:
            token_tag_pairs.append(token)
            tokenized_text = ''.join(token_tag_pairs)
        else:
            rest.append(token)
        
    rest = rest[1:-1]
    rest = ''.join(rest)
            
    return tokenized_text, rest

def extract_schedule_info(sentence,event):
    if '부터' in sentence: #부터만 쓰고 까지를 쓰지 않는 경우 종료기간 정규표현식에 들어갈 수 있게끔
         sentence = sentence + "까지"
    if ('부터' in sentence) and ('에' in sentence):
        sentence = sentence.replace('에','까지')
    if 'UNK' in sentence: #특수기호로 기간을 나타내는 경우 문자로 대체해서 정규표현식에 들어갈 수 있게끔
        sentence=sentence.replace("UNK", "부터")
        sentence = sentence + "까지"
    days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']
    weeks = ['저번주', '이번주', '다음주', '다다음주', '다다다음주']

    # 조건 확인
    if any(day in sentence for day in days) and not any(week in sentence for week in weeks):
        sentence = "이번주 " + sentence
        
    
    
    text = re.sub('[-=+,#/\?:^$.@*\"~※&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》]', '', sentence)  # 특수문자 제거
    text = text.replace(" ", "")  # 모든 공백 제거
    
    # 시작 기간을 추출하는 정규표현식
    start_time_pattern = r'(?:(그제|어제|오늘|낼|내일|모래|모레|이번주|다음주|다다음주|\d+년|\d{8}|\d{7}|\d{6}|\d{5}|\d{4}))?(?:(월요일|화요일|수요일|목요일|금요일|토요일|일요일|월|화|수|목|금|토|일))?(?:(\d+)월)?(?:(\d+)일)?(?:(오전|오후|새벽|밤|낮|저녁|아침))?(?:(\d+)시)?(?:(반|\d+분))?(?:부터)?' # 시작 기간 추출
    match = re.search(start_time_pattern, text)
    
        
    if match:
        syear = match.group(1) if match.group(1) else datetime.now().year  # 년도를 추출합니다. 년도가 없으면 기본값으로 2024를 사용합니다.
        smonth = match.group(3).strip("월") if match.group(3) else datetime.now().month
        sday = match.group(4).strip("일") if match.group(4) else datetime.now().day
        sdow = match.group(2) 
        
        if match.group(1) and match.group(1).isdigit():
            if len(match.group(1)) == 8:  # yyyyddmm 형식
                syear = int(match.group(1)[:4])
                smonth = int(match.group(1)[4:6])
                sday = int(match.group(1)[6:])
            elif len(match.group(1)) == 6:  # yyddmm 형식
                syear = int(match.group(1)[:2]) + 2000
                smonth = int(match.group(1)[2:4])
                sday = int(match.group(1)[4:])
            elif len(match.group(1)) == 5:  # yydm 형식
                syear = int(match.group(1)[:2]) + 2000
                sday_month = int(match.group(1)[2:])
                smonth = sday_month // 100
                sday = sday_month % 100
            elif len(match.group(1)) == 7:  # yyyydm 형식
                syear = int(match.group(1)[:4])
                sday_month = int(match.group(1)[4:])
                smonth = sday_month // 100
                sday = sday_month % 100
            elif len(match.group(1)) == 4:
                syear = datetime.now().year
                smonth=int(match.group()[:2])
                sday=int(match.group(1)[2:])

        # 유효한 날짜인지 확인
            if not (1 <= smonth <= 12 and 1 <= sday <= 31):
                smonth = None
                sday = None
        
        
        elif match.group(1) == '오늘':
            syear = datetime.now().year
            smonth = datetime.now().month
            sday = datetime.now().day
        elif match.group(1) == '어제':
            date = datetime.now() - timedelta(days=1)
            syear = date.year
            smonth = date.month
            sday = date.day
        elif (match.group(1) == '내일') or (match.group(1) == '낼') :
            date = datetime.now() + timedelta(days=1)
            syear = date.year
            smonth = date.month
            sday = date.day
        elif (match.group(1) == '모레') or (match.group(1) == '모래'):
            date = datetime.now() + timedelta(days=2)
            syear = date.year
            smonth = date.month
            sday = date.day
        elif match.group(1) == '그제':
            date = datetime.now() - timedelta(days=2)
            syear = date.year
            smonth = date.month
            sday = date.day

            
        elif match.group(1) == '다음주':
            if match.group(2):  # 요일이 주어진 경우
                today = datetime.now().date()
                weekday_str = match.group(2)
                weekdays = {
                    '월요일': 0,
                    '화요일': 1,
                    '수요일': 2,
                    '목요일': 3,
                    '금요일': 4,
                    '토요일': 5,
                    '일요일': 6
                }
                target_weekday = weekdays[weekday_str]
                current_weekday = today.weekday()
                days_to_target = target_weekday - current_weekday
                #if days_to_target >=0:  # 이미 해당 요일이 지난 경우
                days_to_target += 7
                date = datetime.now() + timedelta(days=days_to_target)
                syear = date.year
                smonth = date.month
                sday = date.day
                
                    
            else:  # 요일이 주어지지 않은 경우
                date = datetime.now() + timedelta(days=7)
                syear = date.year
                smonth = date.month
                sday = date.day

            
        elif match.group(1) == '다다음주':
             if match.group(2):  # 요일이 주어진 경우
                today = datetime.now().date()
                weekday_str = match.group(2)
                weekdays = {
                    '월요일': 0,
                    '화요일': 1,
                    '수요일': 2,
                    '목요일': 3,
                    '금요일': 4,
                    '토요일': 5,
                    '일요일': 6
                }
                target_weekday = weekdays[weekday_str]
                current_weekday = today.weekday()
                days_to_target = target_weekday - current_weekday
                #if days_to_target >=0:  # 이미 해당 요일이 지난 경우
                days_to_target += 14
                date = datetime.now() + timedelta(days=days_to_target)
                syear = date.year
                smonth = date.month
                sday = date.day
                
            
             else:
                date = datetime.now() + timedelta(days=14)
                syear = date.year
                smonth = date.month
                sday = date.day
            
            
        elif match.group(1) == '이번주':
            today = datetime.now().date()
            weekday_str = match.group(2)
            weekdays = {
                '월요일': 0,
                '화요일': 1,
                '수요일': 2,
                '목요일': 3,
                '금요일': 4,
                '토요일': 5,
                '일요일': 6
            }
            target_weekday = weekdays[weekday_str]
            current_weekday = today.weekday()
            days_to_target = (target_weekday - current_weekday) % 7
            date = datetime.now() + timedelta(days=days_to_target)
            syear = date.year
            smonth = date.month
            sday = date.day
        elif match.group(1) and '년' in match.group(1):
            syear = int(match.group(1).strip("년"))
        else:
            syear = int(datetime.now().year)
    
            
        stime_period = match.group(5)
        shour = int(match.group(6).strip("시")) if match.group(6) else 0
        
        
        if (stime_period == '오후' or stime_period == '저녁' or stime_period == '밤' or stime_period == '낮') and int(shour) < 12:
            shour = int(shour) + 12
        sminute = int(match.group(7).strip("분")) if match.group(7) else 0
        if match.group(7) and '반' in match.group(7):
            sminute = 30
        
        # 종료 기간을 추출하는 정규표현식
        end_time_pattern = r'(?:(어제|오늘|내일|모레|다음주|다다음주|\d+년|\d{8}|\d{7}|\d{6}|\d{5}|\d{4}))?(?:(월|화|수|목|금|토|일|월요일|화요일|수요일|목요일|금요일|토요일|일요일))?(?:(\d+)월)?(?:(\d+)일)?(?:(오전|오후|새벽|밤|낮|저녁|아침))?(?:(\d+)시)?(?:(반|\d+분))?(까지)' # 종료 기간 추출
        end_match = re.search(end_time_pattern, text)
        if end_match.group(1) and end_match.group(1).isdigit():
            fyear = end_match.group(1) if end_match.group(1) and end_match.group(1).isdigit() else syear  # 종료 년도를 추출합니다.
            fmonth = end_match.group(3).strip("월") if end_match.group(3) else smonth
            fday = end_match.group(4).strip("일") if end_match.group(4) else sday
            ftime_period = end_match.group(5)
            fhour = int(end_match.group(6).strip("시")) if end_match.group(6) else 0
            
            if end_match.group(1).isdigit():
                if len(end_match.group(1)) == 8:  # yyyyddmm 형식
                    fyear = int(end_match.group(1)[:4])
                    fmonth = int(end_match.group(1)[4:6])
                    fday = int(end_match.group(1)[6:])
                elif len(end_match.group(1)) == 6:  # yyddmm 형식
                    fyear = int(end_match.group(1)[:2]) + 2000
                    fmonth = int(end_match.group(1)[2:4])
                    fday = int(end_match.group(1)[4:])
                elif len(end_match.group(1)) == 5:  # yydm 형식
                    fyear = int(end_match.group(1)[:2]) + 2000
                    fday_month = int(end_match.group(1)[2:])
                    fmonth = fday_month // 100
                    fday = fday_month % 100
                elif len(end_match.group(1)) == 7:  # yyyydm 형식
                    fyear = int(end_match.group(1)[:4])
                    fday_month = int(end_match.group(1)[4:])
                    fmonth = fday_month // 100
                    fday = fday_month % 100
                elif len(end_match.group(1)) == 4:
                    fyear = datetime.now().year
                    fmonth=int(end_match.group()[:2])
                    fday=int(end_match.group(1)[2:])

            # 유효한 날짜인지 확인
                if not (1 <= fmonth <= 12 and 1 <= fday <= 31):
                    fmonth = None
                    fday = None
            
            
            elif end_match.group(1) == '다음주':
                if end_match.group(2):  # 요일이 주어진 경우
                    today = datetime.now().date()
                    weekday_str2 = end_match.group(2)
                    weekdays = {
                    '월요일': 0,
                    '화요일': 1,
                    '수요일': 2,
                    '목요일': 3,
                    '금요일': 4,
                    '토요일': 5,
                    '일요일': 6
                    }
                    target_weekday2 = weekdays[weekday_str2]
                    current_weekday2 = today.weekday()
                    days_to_target2 = target_weekday2 - current_weekday2
                    #if days_to_target >=0:  # 이미 해당 요일이 지난 경우
                    days_to_target2 += 7
                    date = datetime.now() + timedelta(days=days_to_target2)
                    fyear = date.year
                    fmonth = date.month
                    fday = date.day
                    
                else:  # 요일이 주어지지 않은 경우
                    date = datetime.now() + timedelta(days=7)
                    fyear = date.year
                    fmonth = date.month
                    fday = date.day

            elif end_match.group(1) == '다다음주':
                if end_match.group(2):  # 요일이 주어진 경우
                    today = datetime.now().date()
                    weekday_str2 = end_match.group(2)
                    weekdays = {
                    '월요일': 0,
                    '화요일': 1,
                    '수요일': 2,
                    '목요일': 3,
                    '금요일': 4,
                    '토요일': 5,
                    '일요일': 6
                    }
                    target_weekday2 = weekdays[weekday_str2]
                    current_weekday2 = today.weekday()
                    days_to_target2 = target_weekday2 - current_weekday2
                    #if days_to_target >=0:  # 이미 해당 요일이 지난 경우
                    days_to_target2 += 14
                    date = datetime.now() + timedelta(days=days_to_target2)
                    fyear = date.year
                    fmonth = date.month
                    fday = date.day
                
                else:
                    date = datetime.now() + timedelta(days=14)
                    fyear = date.year
                    fmonth = date.month
                    fday = date.day
                
            elif end_match.group(1) == '이번주':
                today = datetime.now().date()
                weekday_str2 = end_match.group(2)
                weekdays = {
                 '월요일': 0,
                '화요일': 1,
                '수요일': 2,
                '목요일': 3,
                '금요일': 4,
                '토요일': 5,
                '일요일': 6
                }
            
                target_weekday2 = weekdays[weekday_str2]
                current_weekday2 = today.weekday()
                days_to_target2 = (target_weekday2 - current_weekday2) % 7
                date = datetime.now() + timedelta(days=days_to_target2)
                fyear = date.year
                fmonth = date.month
                fday = date.day
            elif end_match.group(1) and '년' in end_match.group(1):
                fyear = int(end_match.group(1).strip("년"))
            else:
                fyear = datetime.now().year
                 
            if (ftime_period == '오후' or ftime_period == '저녁' or ftime_period == '밤' or ftime_period == '낮') and int(fhour) < 12:
                fhour = int(fhour) + 12
                
            fminute = end_match.group(7).strip("분") if end_match.group(7) else 0
            if end_match.group(7) and '반' in end_match.group(7):
                fminute = 30

                
        
        else:
            fyear, fmonth, fday, ftime_period, fhour, fminute = syear, smonth, sday, stime_period, shour, sminute

        return [syear, smonth, sday, stime_period, shour, sminute, fyear, fmonth, fday,ftime_period,  fhour, fminute, event]
    else:
        return [None, None, None, None, None, None, None,None, None, None, None, None,None]

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000)

# if __name__ == "__main__":
#     input_data = sys.argv[1]
#     split_data = ner_inference(input_data)
#     result = extract_schedule_info(split_data[0], split_data[1])
#     print(result)


# text = "5월 17일 과제"
# result = ner_inference(text)
# result2 = extract_schedule_info(result[0], result[1])
# print(result2)