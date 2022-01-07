import { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Button, Modal } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const videoConstraints = {
	width: 1280,
	height: 720,
	facingMode: "user"
};

const useStyles = makeStyles({
	root: {
		width: '1280px',
		height: '720px',
	},
	buttonGroup: {
		position: 'absolute !important',
		bottom: '100px',
		left: 0,
		right: 0,
		marginLeft: 'auto',
		marginRight: 'auto',
		width: '100px'
	}
});

const WebcamCapture = (props) => {
	const classes = useStyles();
	const webcamRef = useRef(null);

	const capture = useCallback(
		() => {
			const imageSrc = webcamRef.current.getScreenshot();
			props.handleSubmit(imageSrc);
		},
		[webcamRef]
	);

	return (
	<div className={classes.root}>
		<Webcam
		audio={false}
		width={1280}
		height={720}
		ref={webcamRef}
		screenshotFormat="image/jpeg"
		videoConstraints={videoConstraints}
		/>
		<div className={classes.buttonGroup}>
			<Button variant='contained' onClick={capture}> Capture </Button>
		</div>
	</div>
	);
};

export default WebcamCapture;
