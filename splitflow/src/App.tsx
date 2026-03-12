import { Route, Routes } from 'react-router-dom'
import './App.css'
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import AuditLogPage from './pages/AuditLogPage';
import BalancePage from './pages/BalancePage';
import GroupPage from './pages/GroupPage';
import CreateGroupPage from './pages/CreateGroupPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { ToastContainer } from 'react-toastify';

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<OnboardingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignUpPage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/audit" element={<AuditLogPage />} />
				<Route path="/balance" element={<BalancePage />} />
				<Route path="/group" element={<GroupPage />} />
				<Route path="/create-group" element={<CreateGroupPage />} />
				<Route path="/auth/callback" element={<AuthCallbackPage />} />
			</Routes>
			<ToastContainer />
		</>

	)
}

export default App
