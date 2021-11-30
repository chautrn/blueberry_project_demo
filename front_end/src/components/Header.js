import { AppBar, Toolbar } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const useStyles = makeStyles({
	AppBar: {
		background: '#282a36',
		alignItems: 'center',
	},
	Logo: {
		maxWidth: '90px',
		maxHeight: '90px',
		marginTop: '3px',
		marginBottom: '3px',
		marginRight: '20px'
	},
	Header: { 
		fontFamily: '\'Helvetica Neue\', Arial, sans-serif',
		fontSize: '30px', 
		fontStyle: 'normal', 
		fontVariant: 'normal', 
		fontWeight: '700', 
		lineHeight: '45px',
		letterSpacing: '2px',
	},
	Link: {
		textDecoration: 'none',
		'&:focus, &:hover, &:visited, &:link, &:active': {
			textDecoration: 'none',
		},
		color: 'inherit',
		marginRight: '50px',
	}
});

const Header = () => {
	const classes = useStyles();

	const displayDesktop = () => {
		return (
				<Toolbar>
					<img className={classes.Logo} src={logo}></img>	
					<Link to='/' className={classes.Link}>
						<header className={classes.Header}> Rowan Blueberry Project Demo </header>
					</Link>
					<Link to='/about' className={classes.Link}>
						<header className={classes.Header}> About </header>
					</Link>
					<Link to='/contact' className={classes.Link}>
						<header className={classes.Header}> Contact </header>
					</Link>
				</Toolbar>
		);
	};
	return (
		<header>
			<AppBar 
				className={classes.AppBar}
				position='relative'
			>
				{displayDesktop()}
			</AppBar>
		</header>
	);
}

export default Header;
