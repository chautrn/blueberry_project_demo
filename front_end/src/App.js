import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import About from './pages/About';
import Contact from './pages/Contact';
import Header from './components/Header';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	body: {
		height: 'calc(100vh - 96px)',
		position: 'relative',
	},
});

function App() {
	const classes = useStyles()
	return (
		<div className="App">
			<Header />
			<body className={classes.body}>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='results' element={<Results />} />
					<Route path='about' element={<About />} />
					<Route path='contact' element={<Contact />} />
				</Routes>
			</body>
		</div>
	);
}

export default App;
