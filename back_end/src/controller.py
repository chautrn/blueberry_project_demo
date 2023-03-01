import torch
import cv2
from cropper import get_tiles
from analysis import count_results, get_results_as_dataframe
from combiner import combine_tiles
import pathlib
import warnings

warnings.filterwarnings(action='ignore', category=torch.jit.TracerWarning)

def apply_model_settings(model_obj): # what it says on the tin
    model_obj.iou = 0.45
    model_obj.conf = 0.5
    model_obj.agnostic = True
    model_obj.multi_label = False
    model_obj.hide_labels = True
    model_obj.hide_conf = True


# Default Model
models = {}
default_model = torch.hub.load('chautrn/yolov5:chau', 'custom', path=pathlib.Path(__file__).parent / 'models/best.pt')
apply_model_settings(default_model)
models['best.pt'] = default_model


def imwriteRGB(path, image):
    cv2.imwrite(path, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))


def get_predictions(image, model_str):
    # split the image into tiles
    tiles = get_tiles(image)
    results = {}

    # loads the model if it doesn't exist already
    if model_str not in models:
        new_model = torch.hub.load('chautrn/yolov5:chau', 'custom', path=pathlib.Path(__file__).parent / f'models/{model_str}')
        apply_model_settings(new_model)
        models[model_str] = new_model
    print(f'using {model_str}')

    # runs the model on each tile and then stores them in a dictionary
    for tilename in tiles.keys():
        tile = tiles[tilename]
        print(tile.shape)
        result = models[model_str](tile)
        results[tilename] = result
    return results


def yolo_predict(image, model='best.pt'):
    results = get_predictions(image, model) # gets the dictionary of predictions on tiles for an image
    combined_image = combine_tiles(results) # combine the tiles of the predictions
    count = count_results(results) # counts the results
    all_boxes = get_results_as_dataframe(results, image, combined_image) # gets all of the boxes of every berry in the image
    box_data = all_boxes.to_dict(orient='index') # converts the dataframe to a dictionary
    return {'image': combined_image, 'count': count, 'boxes': box_data} # return the important things


if __name__ == '__main__':
    traced_model = torch.jit.trace('best.pt', torch.randn(1, 3, 640, 640))
