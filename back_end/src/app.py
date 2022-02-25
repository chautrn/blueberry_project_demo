from flask import Flask, jsonify, request, send_file, render_template
from flask_cors import CORS, cross_origin
import numpy as np
from PIL import Image
import base64
import cv2
import io
from controller import yolo_predict 
import os 

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def bytes_to_numpy(image_bytes):
    image_array = np.fromstring(image_bytes, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # cv2.imwrite('test_input.png', image)
    return image


def predict_image_file(file):
    image_bytes = file.read()
    image = bytes_to_numpy(image_bytes)

    prediction = yolo_predict(image)

    prediction_image = prediction['image']
    prediction_image = Image.fromarray(prediction_image.astype('uint8'))
    raw_bytes = io.BytesIO()
    prediction_image.save(raw_bytes, 'JPEG')
    raw_bytes.seek(0)
    pred_img_base64 = base64.b64encode(raw_bytes.getvalue()).decode('ascii')
    mime = 'image/jpeg'

    uri = "data:%s;base64,%s"%(mime, pred_img_base64)

    return {'image': uri,
            'count': prediction['count'],
            'boxes': prediction['boxes']}


@app.route('/', methods=['GET'])
def upload_form():
    return render_template('upload.html')


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        file = request.files['file']
        result = predict_image_file(file)

        return render_template('result.html', \
               image=result['image'], \
               total=result['count']['total'], \
               green=result['count']['green'],
               blue=result['count']['blue'],
               boxes=result['boxes'])


@app.route('/predict_multiple', methods=['POST'])
@cross_origin()
def predict_multiple():
    if request.method == 'POST':
        files = request.files.getlist('file[]')
        response = {'predictions': []}
        for file in files:
            prediction = predict_image_file(file)
            prediction['filename'] = file.filename
            response['predictions'].append(prediction)
    return jsonify(response)


@app.route('/get_models', methods=['GET'])
@cross_origin()
def get_models():
    if request.method == 'GET':
        models = os.listdir('./models')
        return jsonify(models)
    return jsonify([])


if __name__ == '__main__':
    app.run(host='localhost', port=5000)
