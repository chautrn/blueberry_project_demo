import pandas as pd


def count_results(results):
    counts = {
                'total': 0,
                'blue': 0,
                'green': 0,
             }
    for tilename in results.keys():
        result = results[tilename]
        total = result.pandas().xyxy[0]
        blue = total[total['class'] == 0]
        green = total[total['class'] == 1]

        counts['total'] += len(total)
        counts['blue'] += len(blue)
        counts['green'] += len(green)

    return counts

def count_bush_results(results):
    counts = {
                'bush': 0,
                'total': 0,
             }
    for tilename in results.keys():
        result = results[tilename]
        total = result.pandas().xyxy[0]
        bush = total[total['class'] == 0]

        counts['total'] += len(total)
        counts['bush'] += len(bush)

    return counts

def count_results_no_crop(data):
    counts = {
                'total': 0,
                'blue': 0,
                'green': 0,
             }
    result = data
    total = result.pandas().xyxy[0]
    blue = total[total['class'] == 0]
    green = total[total['class'] == 1]

    counts['total'] = len(total)
    counts['blue'] = len(blue)
    counts['green'] = len(green)

    return counts


def get_results_as_dataframe(results):
    frames = []
    for tilename in results.keys():
        result = results[tilename]
        frame = result.pandas().xyxy[0]
        frames.append(frame)

    return pd.concat(frames, ignore_index=True)
