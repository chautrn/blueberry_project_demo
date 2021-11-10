import os
import cv2
import re


def tile_dim(tile_dict):
    keys = sorted(list(tile_dict.keys()))
    last_tile = keys[-1]
    tokens = re.split('_|\.', last_tile)
    return (int(tokens[4]), int(tokens[2])) # tile x and y


def combine_tiles(tile_dict):
    for tilename in tile_dict.keys():
        y_tiles_length, x_tiles_length = tile_dim(tile_dict)

        grid = []

        for y in range(y_tiles_length + 1):
            row_images = []
            for x in range(x_tiles_length + 1):
                tile_result = tile_dict[f'tile_x_{x}_y_{y}.png']
                tile_result.display(render=True)
                x_img = tile_result.imgs[0]
                row_images.append(x_img)
            grid.append(row_images)

        rows = []

        for row in grid:
            rows.append(cv2.hconcat(row))

        whole = cv2.vconcat(rows)
        return whole
