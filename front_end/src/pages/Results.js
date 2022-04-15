import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ResultCard from '../components/ResultCard';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Modal, Button } from '@mui/material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { saveAs } from 'file-saver';

const useStyles = makeStyles({
	results: {
		width: '80%',
		display: 'flex',
		justifyContent: 'center',
	},
	carousel: {
		height: '600px',
		width: '60%',
		marginTop: '60px',
		'& .carousel-slider': {
			boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
		},
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	wrapper: {
		height: 'auto',
	},
	modal: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	zoomWrapper: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	zoomImage: {
		maxWidth: '90vw',
		maxHeight: '90vh',
		objectFit: 'cover',
	},
	buttonWrapper: {
		display: 'flex',
		justifyContent: 'center',
		marginTop: '30px',
		height: 'auto',
		width: '100%',
		display: 'inline-block',
	}
});

const Results = () => {
	const classes = useStyles();
	const { state } = useLocation();
	const [predictions, setPredictions] = useState([]);
	const [images, setImages] = useState([]);
	const [image, setImage] = useState('');

	useEffect(() => {
		let preds = [];
		for (let prediction of state.res) {
			let {image, ...data} = prediction;	
			preds.push(data);
		}
		setPredictions(preds);
	}, []);

	const handleDownloadAnn = () => {
		const link = document.createElement('a');
		link.download = 'annotations.json';
		link.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(predictions, null, 4))}`;
		link.click();
	}

	const handleDownloadImages = () => {
		const zip = require('jszip')();
		for (let prediction of state.res) {
			let {image, filename, ...data} = prediction;
			zip.file(filename, image.split(',')[1], {base64: true});
		}
		zip.generateAsync({type: 'blob'}).then(content => {
			saveAs(content, 'images.zip');
		});
	}

	if (state.res) {
		return (
			<>
				<div className={classes.wrapper}>
					<Carousel className={classes.carousel}>
						{state.res.map(e => {
							return(
								<ResultCard 
									key={e.filename} 
									filename={e.filename}
									image={e.image} 
									count={e.count}
									className={classes.card}
									onClick={() => {
										setImage(e.image);
									}}
								/>
							);
						})}	
					</Carousel>
					<div className={classes.buttonWrapper}>
						<Button 
							variant='contained' 
							style={{marginRight: '30px'}}
							onClick={handleDownloadAnn}
						>
							Download Annotations
						</Button>
						<Button 
							variant='contained'
							style={{marginRight: '30px'}}
							onClick={handleDownloadImages}
							>
							Download Images
							</Button>
						<Button 
							variant='contained'
							>
							Save For Reannotation
							</Button>
					</div>
				</div>
				<Modal
					className={classes.modal}
					open={image != ''}
					onClose={() => {setImage('')}}
				>
					<TransformWrapper>
						<TransformComponent>
							<img className={classes.zoomImage} src={image} alt='test' />
						</TransformComponent>
					</TransformWrapper>
				</Modal>
			</>
		);
	}

	return (
		<div className={classes.results}>
			No response
		</div>
	);
}

export default Results;
