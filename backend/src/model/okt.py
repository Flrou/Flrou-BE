from konlpy.tag import Okt
# from flask import Flask, jsonify

# app = Flask(__name__)

# @app.route('/get', methods=['GET'])
# def get_data():
#     # 여기에서 데이터 처리 로직을 수행
#     data = {'message': 'Hello from Python!'}
#     return jsonify(data)

# if __name__ == '__main__':
#     app.run(debug=True)

import sys

def extract_named_entities(input):
    okt = Okt()
    morphs = okt.pos(input)

    date_entities = []
    noun_entities = []

    temp_date = ''
    temp_word = ''
    temp_tag = ''

    for morph in morphs:
        word, tag = morph

        if tag in ['Noun']:
            temp_word += word
            temp_word += ' '
            temp_tag = tag
        elif temp_tag in ['Noun']:
            noun_entities.append(temp_word.strip())
            temp_word = ''
            temp_tag = ''
        else:
            temp_word = ''
            temp_tag = ''

    noun_entities_arr = ' '.join(noun_entities)
    return noun_entities_arr

if __name__ == "__main__":
    input_data = sys.argv[1]
    result = extract_named_entities(input_data)
    print(result)