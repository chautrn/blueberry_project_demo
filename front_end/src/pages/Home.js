import { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Button } from '@mui/material';
import Dropzone from 'react-dropzone-uploader'
import axios from 'axios';
import 'react-dropzone-uploader/dist/styles.css';
import './Home.css';
import Loading from '../components/Loading';


function Home() {
	const [file, setFile] = useState('');
	const [prediction, setPrediction] = useState(false);
	const [loading, setLoading] = useState(false);

	// specify upload params and url for your files
	const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }

	// called every time a file's `status` changes
	const handleChangeStatus = ({ meta, file }, status) => { console.log('') }

	// receives array of files that are done uploading when submit button is clicked
	const handleSubmit = (files, allFiles) => {
		// console.log(files.map(f => f.meta));
		const data = new FormData();
		for (const file of allFiles) {
			data.append('file[]', file.file, file.name)
		}

		allFiles.forEach(f => f.remove());
		setLoading(true);
		fetch('http://10.240.37.18:5000/predict_multiple', {
			method: 'POST',
			body: data,
		})
		.then(response => response.json())
		.then(jsonData => {
			setPrediction(jsonData.predictions);
			console.log(jsonData.predictions);
		});

	}

	useEffect(() => {
		fetch({url: 'https://gardenerspath.com/wp-content/uploads/2021/03/How-to-Grow-Blueberries-FB.jpg'}).then(res => {
			res.arrayBuffer().then(buf => {
				const file = new File([buf], 'image_data_url.jpg', { type: 'image/jpeg' });
				setFile(file);
			})
		})
	}, []);

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
			<div className='home-wrapper'>
				<Loading />
			</div>
		)
	}

	return (
		<div className='home-wrapper'>
			<Dropzone 
				getUploadParams={getUploadParams}
				onChangeStatus={handleChangeStatus}
				onSubmit={handleSubmit}
				initialFiles={[]}
				inputContent='Drag and drop input files'
				accept='image/*'
			/>
		</div>
	);
}

export default Home;
