import { Route, Routes } from 'react-router-dom'
import './App.css'
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';

function App() {
	return (
			<Routes>
				<Route path="/" element={<OnboardingPage />} />
				<Route path="/login" element={<LoginPage />} />
			</Routes>
	)
}

export default App
