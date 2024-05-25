import numpy as np
import torch
import re
from transformers import AutoTokenizer, AutoModelForTokenClassification

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

def ner_inference3(text):
    model.eval()
    text = text.replace(' ', '/')
    text = re.sub('[-=+#/\?:^$.@*\"※&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》]', '', text)

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

# 예시 텍스트
text = "예시 텍스트를 여기에 입력하세요"
result = ner_inference3(text)
print("Tokenized Text:", result[0])
print("Rest Text:", result[1])
