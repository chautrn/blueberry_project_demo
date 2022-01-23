import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	wrapper: {
		height: '100%',
		width: '100%',
	},
	header: { 
		fontFamily: '\'Helvetica Neue\', Arial, sans-serif',
		fontSize: '30px', 
		fontStyle: 'normal', 
		fontVariant: 'normal', 
		fontWeight: '700', 
		lineHeight: '45px',
		letterSpacing: '2px',
		justifyContent: 'left',
	},
});

const Demo = () => {
	const classes = useStyles();

	return (
		<div className={classes.wrapper}>
			<h1 className={classes.header}> Intro </h1>
		</div>
	);
}

export default Demo;
