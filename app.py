from flask import Flask, jsonify, request, send_file, render_template
import numpy as np
from PIL import Image
import base64
import cv2
import io
from controller import yolo_predict 


app = Flask(__name__)


def bytes_to_numpy(image_bytes):
    image_array = np.fromstring(image_bytes, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # cv2.imwrite('test_input.png', image)
    return image


@app.route('/', methods=['GET'])
def upload_form():
    return render_template('upload.html')


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        file = request.files['file']
        image_bytes = file.read()
        image = bytes_to_numpy(image_bytes)

        prediction = yolo_predict(image)
        count = prediction['count']

        prediction_image = prediction['image']
        prediction_image = Image.fromarray(prediction_image.astype('uint8'))
        raw_bytes = io.BytesIO()
        prediction_image.save(raw_bytes, 'JPEG')
        raw_bytes.seek(0)
        pred_img_base64 = base64.b64encode(raw_bytes.getvalue()).decode('ascii')
        mime = 'image/jpeg'
        uri = "data:%s;base64,%s"%(mime, pred_img_base64)

        total = count['total']
        green = count['green']
        blue = count['blue']
        prediction_table = prediction['table']

        return render_template('result.html', image=uri, total=total, green=green, blue=blue, prediction_table=prediction_table)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
