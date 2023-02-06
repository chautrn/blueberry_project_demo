import numpy as np
import pandas as pd
import re


def coords_from_tilename(tilename):
    coords = re.findall('\d+', tilename)
    return (int(coords[0]), int(coords[1]))


def count_results(results):
    counts = {
                'total': 0,
                'blue': 0,
                'green': 0,
             }
    for tilename in results.keys():
        result = results[tilename]
        total = result.pandas().xyxy[0]
        blue = total[total['class'] == 1]
        green = total[total['class'] == 2]

        counts['total'] += len(total)
        counts['blue'] += len(blue)
        counts['green'] += len(green)

    return counts


def get_results_as_dataframe(results, image, combined):
    (h, w, d) = image.shape
    (hp, wp, dp) = combined.shape

    hr = np.float64(h/hp)
    wr = np.float64(w/wp)

    frames = []
    for tilename in results.keys():
        (x, y) = coords_from_tilename(tilename)
        offsetX = np.float64(x * 640)
        offsetY = np.float64(y * 640)
        result = results[tilename]
        frame = result.pandas().xyxy[0]
        frame['xmin'] = frame['xmin'].apply(lambda x: (x + offsetX) * wr)
        frame['xmax'] = frame['xmax'].apply(lambda x: (x + offsetX) * wr)
        frame['ymin'] = frame['ymin'].apply(lambda y: (y + offsetY) * hr)
        frame['ymax'] = frame['ymax'].apply(lambda y: (y + offsetY) * hr)
        frames.append(frame)
    df = pd.concat(frames, ignore_index=True)
    return df
