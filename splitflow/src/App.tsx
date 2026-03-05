import { Route, Routes } from 'react-router-dom'
import './App.css'
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
	return (
			<Routes>
				<Route path="/" element={<OnboardingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignUpPage />} />
			</Routes>
	)
}

export default App
