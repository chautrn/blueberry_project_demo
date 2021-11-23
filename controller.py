import torch
import cv2
from cropper import get_tiles 
from analysis import count_results, get_results_as_dataframe
from combiner import combine_tiles
import pandas as pd

# Model
model = torch.hub.load('ultralytics/yolov5', 'custom', path='/data/drone/tranch29/yolov5/runs/train/exp5/weights/best.pt')

# Model settings
model.conf = 0.6
model.hide_labels = True 
model.hide_conf = True


def imwriteRGB(path, image):
    cv2.imwrite(path, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))


def get_predictions(image):
    tiles = get_tiles(image)
    results = {}
    for tilename in tiles.keys():
        tile = tiles[tilename]
        result = model(tile)
        results[tilename] = result
    return results


def yolo_predict(image):
    results = get_predictions(image)
    combined_image = combine_tiles(results)
    count = count_results(results)
    all_boxes = get_results_as_dataframe(results)
    html = all_boxes.to_html()
    return {'image': combined_image, 'count': count, 'table': html}

if __name__ == '__main__':
    print(model)
