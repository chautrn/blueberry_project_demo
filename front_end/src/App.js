import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import Header from './components/Header';


function App() {
	return (
		<div className="App">
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='results' element={<Results />} />
			</Routes>
		</div>
	);
}

export default App;
