import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ResultCard from '../components/ResultCard';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const useStyles = makeStyles({
	results: {
		width: '80%',
		display: 'flex',
		justifyContent: 'center',
	},
	carousel: {
		width: '60%',
		marginTop: '100px',
		'& .carousel-slider': {
			boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
		},

	},
	wrapper: {
		display: 'flex',
		justifyContent: 'center',
		height: 'calc(100% - 96px)',
	}
});

const Results = () => {
	const classes = useStyles();
	const { state } = useLocation();
	if (state.res) {
		return (
			<div className={classes.wrapper}>
				<Carousel className={classes.carousel}>
					{state.res.map(e => {
						return(
							<ResultCard 
								key={e.filename} 
								filename={e.filename}
								image={e.image} 
								count={e.count}
								className={classes.card}/>
						);
					})}	
				</Carousel>
			</div>
		);
	}

	return (
		<div className={classes.results}>
			No response
		</div>
	);
}

export default Results;
