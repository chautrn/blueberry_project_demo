import { AppBar, Toolbar } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
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
	}
});

const Header = () => {
	const styles = useStyles();
	const displayDesktop = () => {
		return 	<Toolbar>
					<img className={styles.Logo} src={logo}></img>	
					<header className={styles.Header}> Rowan Blueberry Project </header>
				</Toolbar>;
	};
	return (
		<header>
			  <AppBar className={styles.AppBar}>{displayDesktop()}</AppBar>
		</header>
	);
}

export default Header;
