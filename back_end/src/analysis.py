import numpy as np
import pandas as pd
import re


def coords_from_tilename(tilename):
    coords = re.findall('\d+', tilename) # returns the coordinates of a tile based on its name
    return (int(coords[0]), int(coords[1]))


def count_results(results):
    # initialize variables for counting in loop
    counts = {
                'total': 0,
                'blue': 0,
                'green': 0,
             }

    # loop through each tile
    for tilename in results.keys():
        result = results[tilename]
        total = result.pandas().xyxy[0]

        # get count of each class from tiles
        blue = total[total['class'] == 1]
        green = total[total['class'] == 2]

        # increment variables
        counts['total'] += len(total)
        counts['blue'] += len(blue)
        counts['green'] += len(green)

    return counts


def get_results_as_dataframe(results, image, combined):
    (h, w, d) = image.shape # shape of original image. Number of rows (height), columns (width), and then channels
    (hp, wp, dp) = combined.shape # shape of image after split into crops and combined. Number of rows (height), columns (width), and then channels

    hr = np.float64(h/hp) # how many times larger or smaller the combined image is, heightwise
    wr = np.float64(w/wp) # how many times larger or smaller the combined image is, widthwise

    frames = []
    # loop through each tile
    for tilename in results.keys():
        (x, y) = coords_from_tilename(tilename) # how many tiles from the left / top the current tile is
        offsetX = np.float64(x * 640) # the number of pixels needed to be added to the x values of a detection to put it on the combined image
        offsetY = np.float64(y * 640) # the number of pixels needed to be added to the y values of a detection to put it on the combined image
        result = results[tilename] # get the results for that tile
        frame = result.pandas().xyxy[0] # convert the results to a pandas array with xmin, ymin, xmax, ymax formatting

        # all the following lines applys the listed function across all entries in the dataframe - in this case all berries detected, converting the xmin, xmax, ymin, and ymax value of each berry in a crop to the entire image.
        frame['xmin'] = frame['xmin'].apply(lambda x: (x + offsetX) * wr)
        frame['xmax'] = frame['xmax'].apply(lambda x: (x + offsetX) * wr)
        frame['ymin'] = frame['ymin'].apply(lambda y: (y + offsetY) * hr)
        frame['ymax'] = frame['ymax'].apply(lambda y: (y + offsetY) * hr)
        frames.append(frame) # adds all the entries in this frame to the dictionary
    df = pd.concat(frames, ignore_index=True) # turns that dictionary to a dataframe
    return df
