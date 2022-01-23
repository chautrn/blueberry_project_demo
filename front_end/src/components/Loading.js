import { makeStyles } from '@material-ui/core/styles';
import logo from '../assets/logo.png';

const useStyles = makeStyles({
	'@keyframes floating': {
		'0%': { transform: 'translate(0,  0px)' },
		'50%': { transform: 'translate(0, 20px)' },
		'100%': { transform: 'translate(0, -0px)' },
	},
	'@keyframes spinning': {
		'from': { transform: 'rotate(0deg)' },
		'to': { transform: 'rotate(360deg)' },
	},
	logo: {
		display: 'block',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: '300px',
		animation: '$spinning 1s infinite linear',
		height: '200px',
		width: '200px',
	},
})


const Loading = ( props ) => {
	const classes = useStyles();

	return (
		<img className={classes.logo} src={logo}></img>
	);
}

export default Loading;
