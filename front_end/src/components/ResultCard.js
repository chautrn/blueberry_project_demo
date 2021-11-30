import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	card: {
		minWidth: '800px',
		cursor: 'pointer',
		position: 'relative',
	},
	media: {
		height: '600px',
	},
	content: {
		position: 'absolute',
		bottom: '0',
		backgroundColor: 'rgba(40, 42, 54, 0.5)',
		paddingBottom: '21px !important',
		width: '100%'
	}
})

const trimWithEllipses = (str, length) => {
	return str.length > length ? str.substring(0, length-3) + '...' : str;
}

const ResultCard = ( props ) => {
	const classes = useStyles();

	return (
		<Card className={classes.card} onClick={props.onClick}>
			<CardMedia
				className={classes.media}
				height='500'
				component='img'
				image={props.image}
			>
			</CardMedia>
			<CardContent className={classes.content}>
				<Typography gutterBottom variant='h5' component='div' style={{color: 'white'}}>
					{`${trimWithEllipses(props.filename, 20)}, Total: ${props.count.total}, Blues: ${props.count.blue}, Greens: ${props.count.green}`}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default ResultCard;
