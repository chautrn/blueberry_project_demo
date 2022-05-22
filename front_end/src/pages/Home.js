import { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Button, Modal, Menu } from '@mui/material';
import Dropzone from 'react-dropzone-uploader'
import Loading from '../components/Loading';
import Demo from '../components/Demo';
import 'react-dropzone-uploader/dist/styles.css'
import WebcamCapture from '../components/Webcam';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



const useStyles = makeStyles({
	wrapper: {
		height: '100%',
	},
	dropWrapper: {
		height: '80%',
		padding: '2%',
		'& .dzu-dropzone': {
			height: '100%',
			width: '100%',
			overflow: 'hidden',
		}
	},
	buttonWrapper: {
		
	},
	buttonSpaced: {
		marginRight: '30px !important'
	},
	modal: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},

	dropDown: {
		display: 'inline-block',
		marginLeft: '30px'
	}

});

const Home = () => {
	const [dropperFiles, setDropperFiles] = useState([]);
	const [prediction, setPrediction] = useState(false);
	const [loading, setLoading] = useState(false);
	const [camera, setCamera] = useState(false);
	const [cameraImage, setCameraImage] = useState(null);

	const [models, setModels] = useState([]);
	const [model, setModel] = useState("best.pt");
 
	const [detectionMethod, setDetectionMethod] = useState("berry");

	const sampleImages = ['IMG_0169.jpeg', 'IMG_0170.jpeg', 'IMG_0171.jpeg'];
	
	const classes = useStyles();

	// called every time a file's `status` changes
	const handleChangeStatus = ({ meta, file }, status) => { console.log('') }

	// receives array of files that are done uploading when submit button is clicked
	const handleSubmit = (files, allFiles) => {
		// console.log(files.map(f => f.meta));
		const data = new FormData();
		data.append("model", model);
		data.append("detectionMethod", detectionMethod)


		for (const file of allFiles) {
			data.append('file[]', file.file, file.name)
		}
		allFiles.forEach(f => f.remove());
		setLoading(true);
		fetch('http://localhost:5000/predict_multiple', {
			method: 'POST',
			body: data,
		})
		.then(response => response.json())
		.then(jsonData => {
			setPrediction(jsonData.predictions);
		});
	}

	const handleCameraSubmit = (image) => {
		fetch(image)
			.then(res => res.blob())
			.then(blob => {
				const webcamFile = new File([blob], 'webcam.jpg', { type: 'image/jpeg' });
				setDropperFiles([webcamFile]);
			});
			setCamera(false);
	}

	const loadSampleImages = async () => {
		let imageFiles = [];
		let promises = [];
		for (const image of sampleImages) {
			promises.push(fetch(process.env.PUBLIC_URL + '/' + image)
				.then(res => res.blob())
				.then(blob => {
					const imageFile = new File([blob], image, { type: 'image/jpeg' });
					imageFiles.push(imageFile);
				})
			);
		}
		await Promise.all(promises)
		setDropperFiles([...dropperFiles, ...imageFiles]);
	}

	useEffect(() => {
		setDropperFiles([]);
		fetchThis();
	}, []);


	function fetchThis() {
		fetch('http://localhost:5000/get_models')
			.then((response) => response.json())
			.then((json) => { 
				setModels(json);
				console.log(json);
			})
	}

	function menuItemCallBack(event) {
		setModel(event.target.value);

		console.log(detectionMethod);
		console.log(event.target.value);

	}
	
	if (prediction) {
		return (
			<Navigate
				to={{
					pathname: '/results',
				}}
				state={{ res: prediction }}
			/>
		);
	}
	else if (loading) {
		return (
			<div className={classes.wrapper}>
				<Loading />
			</div>
		)
	}

	return (
		<div className={classes.wrapper}>
			{/* <Demo /> */}
			<div className={classes.dropWrapper}>
				<Dropzone 
					className={classes.dropzone}
					onChangeStatus={handleChangeStatus}
					onSubmit={handleSubmit}
					initialFiles={dropperFiles}
					inputContent='Drag and drop input files'
					accept='image/*'
				/>
			</div>
			<div className={classes.buttonWrapper}>
				{/*<Button 
					className={classes.buttonSpaced}
					variant='contained'
					onClick={() => {setCamera(true)}}
					>Camera</Button>*/}
				<Button 
					variant='contained'
					onClick={() => {loadSampleImages()}}
				>Load Sample Images</Button>
			
		{/** DROPDOWN MENU. SELECTS WHAT WEIGHT FILE TO USE IN MODEL*/}
		<Box className={classes.dropDown} sx={{ width: 300 }}>
			<FormControl fullWidth >
				<InputLabel id="demo-simple-select-label">Models</InputLabel>
				<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={model}
				label="Models"
				onChange={menuItemCallBack}
				>
				<MenuItem value={"best.pt"} 
						// ideally the instructions in onClick should be in onChange={menuItemCallBack}, reminder to go back and fix
						// when fixing, look into using custom attributes
						onClick={() => setDetectionMethod("berry")}
						>berries</MenuItem>
          		<MenuItem value={"bush.pt"} 
						onClick={() => setDetectionMethod("bush")}
				  		>bush</MenuItem>
          		<MenuItem value={"30_cocosplitv3_30s"} 
						onClick={() => setDetectionMethod("berry")}
						>30_cocosplitv3_30s</MenuItem>
				{models.map((course, index) => {
				return (
				<MenuItem key={index} value={course}>{course} </MenuItem>
				)
					})}
				</Select>
			</FormControl>
		</Box>
		

			</div>
			<Modal
				className={classes.modal}
				open={camera}
				onClose={() => {setCamera(false)}}
			>
				<WebcamCapture handleSubmit={handleCameraSubmit} />
			</Modal>
		</div>
	);

}

export default Home;
