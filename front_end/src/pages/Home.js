import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
})

function Home() {
	const classes = useStyles();
	return (
		<div className='home'>
		</div>
	);
}

export default Home;
