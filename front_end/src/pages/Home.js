import { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Button } from '@mui/material';
import Dropzone from 'react-dropzone-uploader'
import Loading from '../components/Loading';
import 'react-dropzone-uploader/dist/styles.css'

const useStyles = makeStyles({
	wrapper: {
		height: 'calc(100% - 96px)',
		'& .dzu-dropzone': {
			height: '100%',
		}
	},
});

const Home = () => {
	const [file, setFile] = useState('');
	const [prediction, setPrediction] = useState(false);
	const [loading, setLoading] = useState(false);

	const classes = useStyles();

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
			<div className={classes.wrapper}>
				<Loading />
			</div>
		)
	}

	return (
		<div className={classes.wrapper}>
			<Dropzone 
				className={classes.dropzone}
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
