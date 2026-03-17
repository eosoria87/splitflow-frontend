import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Eager — primary destinations, must paint fast
import OnboardingPage   from './pages/OnboardingPage';
import LoginPage        from './pages/LoginPage';
import SignUpPage       from './pages/SignUpPage';
import DashboardPage    from './pages/DashboardPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

// Lazy — secondary pages, loaded on demand
const AuditLogPage    = lazy(() => import('./pages/AuditLogPage'));
const BalancePage     = lazy(() => import('./pages/BalancePage'));
const GroupPage       = lazy(() => import('./pages/GroupPage'));
const CreateGroupPage = lazy(() => import('./pages/CreateGroupPage'));

function App() {
	return (
		<>
			<Suspense fallback={null}>
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<OnboardingPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignUpPage />} />
					<Route path="/auth/callback" element={<AuthCallbackPage />} />

					{/* Protected routes — redirect to /login if not authenticated */}
					<Route element={<ProtectedRoute />}>
						<Route path="/dashboard" element={<DashboardPage />} />
						<Route path="/audit" element={<AuditLogPage />} />
						<Route path="/balance" element={<BalancePage />} />
						<Route path="/group/:id" element={<GroupPage />} />
						<Route path="/create-group" element={<CreateGroupPage />} />
					</Route>
				</Routes>
			</Suspense>
			<ToastContainer />
		</>
	)
}

export default App
