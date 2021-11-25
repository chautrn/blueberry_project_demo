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
	},
})


const ResultCard = ( props ) => {
	const classes = useStyles();

	return (
		<Card className={classes.card}>
			<CardMedia
				className={classes.media}
				height='500'
				component='img'
				image={props.image}
			/>
			<CardContent>
				<Typography gutterBottom variant='h5' component='div'>
					{`${props.filename}, Total: ${props.count.total}, Blues: ${props.count.blue}, Greens: ${props.count.green}`}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default ResultCard;
