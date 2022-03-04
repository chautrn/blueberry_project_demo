import unittest
import cv2
from cropper import get_tiles
from combiner import combine_tiles, tile_dim
from controller import get_predictions, imwriteRGB, yolo_predict
from analysis import count_results


class TestCropper(unittest.TestCase):
    def setUp(self):
        self.image = cv2.imread('/data/drone/tranch29/yolov5_API/test_images/366.jpg')
        self.image = cv2.cvtColor(self.image, cv2.COLOR_BGR2RGB)
        self.tiles = get_tiles(self.image)

    def test_correct_number_of_tiles(self):
        self.assertEqual(len(self.tiles), 24)

    def test_tile_dimensions(self):
        all_640x640 = True
        for tilename in self.tiles.keys():
            tile = self.tiles[tilename]
            if tile.shape[0] != 640 or tile.shape[1] != 640:
                all_640x640 = False
        self.assertTrue(all_640x640)

    def test_small_input(self):
        small_image = self.image[0:50, 0:50]
        small_tiles = get_tiles(small_image)
        self.assertEqual(len(small_tiles), 1)


class TestController(unittest.TestCase):
    def setUp(self):
        self.image = cv2.imread('/data/drone/tranch29/yolov5_API/test_images/output_4th.png')
        self.image = cv2.cvtColor(self.image, cv2.COLOR_BGR2RGB)
        self.tiles = get_tiles(self.image)
        self.results = get_predictions(self.image)

    def test_model_does_not_fail_lol(self):
        self.assertTrue(len(self.results), len(self.tiles))

    def test_result_contains_image(self):
        first_tilename = next(iter(self.tiles.keys()))
        imwriteRGB('./test_images/tile.png', self.results[first_tilename].imgs[0])
        self.assertTrue(len(self.results[first_tilename].imgs), 1)

    def test_images_have_bounding_boxes(self):
        for tilename in self.results.keys():
            result = self.results[tilename]
            result.display(render=True)
            imwriteRGB(f'test_images/{tilename}.png', result.imgs[0])
            self.assertTrue(True)

    def test_predict_pipeline(self):
        yolo_predict(self.image)    
        self.assertTrue(True)


class TestCombiner(unittest.TestCase):
    def setUp(self):
        self.image = cv2.imread('/data/drone/tranch29/yolov5_API/test_images/366.jpg')
        self.image = cv2.cvtColor(self.image, cv2.COLOR_BGR2RGB)
        self.tiles = get_tiles(self.image)

    def test_get_last_tile(self):
        dim = tile_dim(self.tiles)
        self.assertTrue(dim, (3, 5))

    def test_combine_outputs_correct_dimensions(self):
        results = get_predictions(self.image)
        combined_image = combine_tiles(results)
        shape = (combined_image.shape[0], combined_image.shape[1])
        imwriteRGB('./test_images/output.png', combined_image)
        self.assertTrue(shape, (2560, 3840))


class TestAnalysis(unittest.TestCase):
    def setUp(self):
        self.image = cv2.imread('/data/drone/tranch29/yolov5_API/test_images/output_4th.png')
        self.image = cv2.cvtColor(self.image, cv2.COLOR_BGR2RGB)
        self.tiles = get_tiles(self.image)
        self.results = get_predictions(self.image)
        self.prediction_info = count_results(self.results)

    def test_blueberry_count_total(self):
        self.assertEqual(self.prediction_info['total'], 840)


if __name__ == '__main__':
    unittest.main()
