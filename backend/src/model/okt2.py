from konlpy.tag import Okt

import sys

def extract_named_entities(input):
    okt = Okt()
    morphs = okt.pos(input)

    num_entities = []
    noun_entities = []

    temp_num = ''
    temp_word = ''
    temp_tag = ''

    for morph in morphs:
        word, tag = morph

        if tag in ['Noun', 'Number']:
            temp_word += word
            temp_word += ' '
            temp_tag = tag
        elif temp_tag in ['Noun', 'Number']:
            noun_entities.append(temp_word.strip())
            temp_word = ''
            temp_tag = ''
        else:
            temp_word = ''
            temp_tag = ''

    if temp_word and temp_tag in ['Noun', 'Number']:
        noun_entities.append(temp_word.strip())

    noun_entities_arr = ' '.join(noun_entities)
    return noun_entities_arr

if __name__ == "__main__":
    input_data = sys.argv[1]
    result = extract_named_entities(input_data)
    print(result)