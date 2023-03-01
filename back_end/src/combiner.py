import os
import cv2
import re


def tile_coords(tile_name):
    tokens = re.split('_|\.', tile_name)
    return (int(tokens[4]), int(tokens[2]))  # tile x and y


# returns the dimensions of the image in tiles. NOTE: THIS STARTS COUNTING AT 0, so an image thats 7x5 tiles will return 6x4
def tile_dim(tile_dict):
    keys = sorted(list(tile_dict.keys()), key=lambda i: sum(tile_coords(i))) # sorts the tiles by their names
    last_tile = keys[-1] # just grabs the last tile
    return tile_coords(last_tile)


# returns an image with all the tiles added back onto it
def combine_tiles(tile_dict):

    # loop through all tiles
    for tilename in tile_dict.keys():
        y_tiles_length, x_tiles_length = tile_dim(tile_dict)

        grid = []

        # loops through all x and y combinations. Basically loops through each row, then within a row loops through each tile
        for y in range(y_tiles_length + 1): # +1 compensates for starting at 0
            row_images = []
            for x in range(x_tiles_length + 1): # +1 compensates for starting at 0
                tile_result = tile_dict[f'tile_x_{x}_y_{y}.png'] # loads result for the tile with the given coordinates
                tile_result.display(render=True)
                x_img = tile_result.imgs[0] # pulls the image out of the result
                row_images.append(x_img) # appends the image to the row
            grid.append(row_images) # appends the completed row to the dictionary of rows


        # converts the dictionary of rows to an actual image, then returns it
        rows = []

        for row in grid:
            rows.append(cv2.hconcat(row))

        whole = cv2.vconcat(rows)
        return whole
