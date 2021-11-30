import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import About from './pages/About';
import Contact from './pages/Contact';
import Header from './components/Header';


function App() {
	return (
		<div className="App">
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='results' element={<Results />} />
				<Route path='about' element={<About />} />
				<Route path='contact' element={<Contact />} />
			</Routes>
		</div>
	);
}

export default App;
