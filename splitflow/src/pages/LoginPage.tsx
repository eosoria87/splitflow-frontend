import { useState } from "react";
import { useForm, type FieldValues } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/24/outline";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import FooterBar from "../components/navigation/FooterBar";
import { useAuth } from "../hooks/useAuth";
import authService from "../services/authService";

interface FormData {
	email: string;
	password: string;
}

const LoginPage = () => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({mode: 'onChange'});
	const { login, isLoading } = useAuth();
	const navigate = useNavigate();

	const onSubmit = async (data: FieldValues) => {
		setApiError(null);
		try {
			await login({ email: data.email, password: data.password });
			navigate('/dashboard');
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
			setApiError(message);
		}
	};

	const handleLoginGoogle = async () => {
		setApiError(null);
		try {
			const { url } = await authService.googleAuth();
			window.location.href = url;
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Google sign-in failed';
			setApiError(message);
		}
	};

	return (
		<div className="h-full w-full flex items-center justify-center overflow-hidden ">
		<div className="flex flex-col items-center w-full sm:px-4 sm:py-8 sm:w-md h-full overflow-y-auto ">
			<div className="mb-8 "><Logo /></div>

			<div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full p-8 sm:p-10 border border-slate-100">
				<h1 className="text-2xl font-bold text-grey-900 mb-2">Welcome back</h1>
				<p className="text-sm text-accent font-medium">Collaborative expense tracking made simple.</p>

				<form action="" onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
					<div>
						<label htmlFor="email" className="block text-left text-sm font-medium text-grey-900 mb-2">
							Email Address
						</label>
						<input
						{...register('email', { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
						})}
							id="email"
							type="email"
							placeholder="name@company.com"
							autoComplete="email"
							className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm placeholder:text-slate-400"
						/>
						{errors.email?.type === 'required' && (
							<p className="text-red-500 text-sm mt-1">The email field is required.</p>
						)}
						{errors.email?.type === 'pattern' && (
							<p className="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
						)}
					</div>
					<div className="flex justify-between items-center mb-2">
						<label htmlFor="password" className="block text-sm font-medium text-grey-900 text-left mb-2">
							Password
						</label>
						<Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
							Forgot password?
						</Link>
					</div>
					<div className="relative">
						<input
							{...register('password', {required: true, minLength: 8})}
							id="password"
							type={showPassword ? "text" : "password"}
							autoComplete="current-password"
							placeholder="••••••••"
							className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm placeholder:text-slate-400 tracking-widest"
						/>
						{errors.password?.type === 'required' && (
							<p className="text-red-500 text-sm mt-1">The password field is required.</p>
						)}
						{errors.password?.type === 'minLength' && (
							<p className="text-red-500 text-sm mt-1">The password must be at least 8 characters long.</p>
						)}
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
						>
							<EyeIcon className="size-5" />
						</button>
					</div> {/* password input/eye icon div ending*/}
					{apiError && (
						<p className="text-red-500 text-sm">{apiError}</p>
					)}
					<Button disabled={!isValid || isLoading} variant='primary' className="w-full mt-2 py-3.5" size="lg" type="submit">
						{isLoading ? 'Logging in…' : 'Log In'}
					</Button>
				</form>
				<div className="text-center mt-6 text-sm text-slate-500 font-regular">
				Don't have an account? <Link to="/signup" className="font-medium text-primary hover:underline">Sign Up</Link>
				</div>
				<div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-slate-100"></div>
          <span className="text-xs font-regular text-slate-400 tracking-wider">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-slate-100"></div>
				</div>
				<Button variant='outline' className="w-full mt-2" onClick={handleLoginGoogle}>
					<span className="inline-flex items-center gap-2">
						<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
							<g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
								<path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.419 L -8.284 53.419 C -8.554 54.819 -9.414 55.979 -10.604 56.779 L -10.604 59.519 L -6.714 59.519 C -4.434 57.419 -3.264 54.749 -3.264 51.509 Z" />
								<path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.714 59.519 L -10.604 56.779 C -11.734 57.539 -13.144 57.959 -14.754 57.959 C -17.864 57.959 -20.494 55.859 -21.434 53.039 L -25.464 53.039 L -25.464 55.829 C -23.494 59.739 -19.444 63.239 -14.754 63.239 Z" />
								<path fill="#FBBC05" d="M -21.434 53.039 C -21.674 52.339 -21.804 51.599 -21.804 50.839 C -21.804 50.079 -21.674 49.339 -21.434 48.639 L -21.434 45.849 L -25.464 45.849 C -26.284 47.479 -26.754 49.299 -26.754 50.839 C -26.754 52.379 -26.284 54.199 -25.464 55.829 L -21.434 53.039 Z" />
								<path fill="#EA4335" d="M -14.754 43.719 C -12.984 43.719 -11.404 44.329 -10.154 45.519 L -6.644 42.009 C -8.814 39.999 -11.524 38.839 -14.754 38.839 C -19.444 38.839 -23.494 42.339 -25.464 45.849 L -21.434 48.639 C -20.494 45.819 -17.864 43.719 -14.754 43.719 Z" />
							</g>
						</svg>
						<span className="text-gray-500">Google</span>
					</span>
				</Button>
			</div> {/* White container div ending*/}
			<FooterBar />
		</div>
		</div>
	);
};

export default LoginPage;

