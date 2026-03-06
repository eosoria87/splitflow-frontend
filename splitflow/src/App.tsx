import { Route, Routes } from 'react-router-dom'
import './App.css'
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import AuditPage from './pages/AuditPage';

function App() {
	return (
			<Routes>
				<Route path="/" element={<OnboardingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignUpPage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/audit" element={<AuditPage />} />
			</Routes>
	)
}

export default App
