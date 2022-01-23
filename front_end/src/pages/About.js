import blueberry from '../assets/blueberry_image_cropped.png'
import blueberry_prediction from '../assets/blueberry_image_cropped_prediction.png'

const About = () => {
	return (
		<div> 
		<br/>	Rowan Blueberry Project (RU-Blue) aims to develop AI software for smart farming of blueberries in South Jersey. <br/> <br/>
		This website gives a demo of our deep learning object detection model for detecting and counting the number of individual blueberries on a bush in an image (see  example image below). <br/> You can upload your own image to test our model from the demo homepage. <br/> <br/> 
		<img  src={blueberry} height="249" width="360"></img>
		&nbsp;----- RU-Blue ---->&nbsp;
		<img  src={blueberry_prediction} height="249" width="360"></img>

		</div>

	);
}
export default About;
