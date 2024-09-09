import sys
from konlpy.tag import Okt

def extract_named_entities(input):
    okt = Okt()
    morphs = okt.pos(input)

    noun_josa_entities = []
    verb_entities = []

    temp_word = ''
    temp_tag = ''

    for morph in morphs:
        word, tag = morph

        if tag == 'Noun':
            # 명사를 만나면 일단 temp_word에 추가
            temp_word += word
            temp_tag = 'Noun'
        elif tag == 'Josa' and temp_tag == 'Noun':
            # 명사 뒤에 조사가 나오면 붙여서 처리
            temp_word += word
        elif temp_tag == 'Noun':
            # 명사 뒤에 다른 품사가 나오면 명사 + 조사를 리스트에 추가
            noun_josa_entities.append(temp_word)
            temp_word = ''
            temp_tag = ''
        elif tag == 'Verb':
            # 동사는 별도로 리스트에 추가
            verb_entities.append(word)
            temp_word = ''
            temp_tag = ''
        else:
            temp_word = ''
            temp_tag = ''

    # 마지막으로 남은 명사 + 조사 처리
    if temp_word and temp_tag == 'Noun':
        noun_josa_entities.append(temp_word)

    # 명사 + 조사와 동사를 각각 결합
    result = ' '.join(noun_josa_entities) + ' ' + ' '.join(verb_entities)
    return result.strip()

if __name__ == "__main__":
    input_data = sys.argv[1]
    result = extract_named_entities(input_data)
    print(result)