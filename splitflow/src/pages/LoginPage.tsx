import { useState } from "react";
import { useForm, type FieldValues } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/24/outline";
import Logo from "../components/ui/Logo";
import GoogleIcon from "../components/ui/GoogleIcon";
import Button from "../components/ui/Button";
import FooterBar from "../components/layout/FooterBar";
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
							<p className="text-red-500 text-sm text-left mt-1">The email field is required.</p>
						)}
						{errors.email?.type === 'pattern' && (
							<p className="text-red-500 text-sm text-left mt-1">Please enter a valid email address.</p>
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
					<div className="relative mb-1">
						<input
							{...register('password', {required: true, minLength: 8})}
							id="password"
							type={showPassword ? "text" : "password"}
							autoComplete="current-password"
							placeholder="••••••••"
							className="w-full px-4 pr-11 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm placeholder:text-slate-400 tracking-widest"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
						>
							<EyeIcon className="size-5" />
						</button>
					</div>
					{errors.password?.type === 'required' && (
						<p className="text-red-500 text-sm text-left mt-1">The password field is required.</p>
					)}
					{errors.password?.type === 'minLength' && (
						<p className="text-red-500 text-sm text-left mt-1">The password must be at least 8 characters long.</p>
					)}
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
						<GoogleIcon />
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

