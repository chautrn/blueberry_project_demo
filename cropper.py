import json
import os
import cv2
import math
import argparse

target_xy = (640, 640)


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--images', type=str, help='Folder of images to process')
    parser.add_argument('--output', type=str, help='Output folder')
    args = parser.parse_args()
    return args 

def closest_size(width, height, twidth, theight):
    new_width = math.ceil(width / twidth) * twidth
    new_height = math.ceil(height / theight) * theight

    return new_width, new_height


def get_tiles(image):
    width = image.shape[1]
    height = image.shape[0]

    # Output
    image_in_tiles = {}

    # Output sizes
    new_width, new_height = closest_size(width, height, *target_xy)
    resized_image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
    w_tiles = int(new_width / target_xy[0])
    h_tiles = int(new_height / target_xy[1])

    for w in range(w_tiles):
        for h in range(h_tiles):
            # Top left corner
            x0, y0 = w * target_xy[0], h * target_xy[1]

            # Bottom right corner
            x1, y1 = (w + 1) * target_xy[0], (h + 1) * target_xy[1]

            crop = resized_image[y0:y1, x0:x1]
            # print(y1 - y0)
            # print(x1 - x0)
            # print(crop.shape)
            new_path = f'tile_x_{w}_y_{h}' + '.png'
            image_in_tiles[new_path] = crop

    return image_in_tiles

if __name__ == '__main__':
    # Args
    args = parse_args()
    image_dir = args.images
    output_path = args.output

    # Input
    image_filenames = os.listdir(image_dir)

    # Output
    all_images = []

    for file_name in image_filenames:
        # Input
        image_path = os.path.join(image_dir, file_name)
        image = cv2.imread(image_path)
        image_as_tiles = get_tiles(image)
        all_images.append(image_as_tiles)

    for image in all_images:
        for tile_name in image.keys():
            tile = image[tile_name]
            save_path = os.path.join(output_path, tile_name)
            print(save_path)
            cv2.imwrite(save_path, tile)

