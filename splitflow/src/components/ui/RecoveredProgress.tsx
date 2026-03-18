interface Props {
	percentage: number; // e.g., 75
}

const RecoveredProgress = ({ percentage }: Props) => {
	const radius = 80;
	const circumference = 2 * Math.PI * radius;
	// Calculate how much of the stroke to "hide"
	const offset = circumference - (percentage / 100) * circumference;

	return (
		<div className="relative w-48 h-48 flex items-center justify-center">
			{/* SVG Container */}
			<svg className="w-full h-full transform -rotate-90">
				{/* Background Circle (The "Track") */}
				<circle
					cx="96"
					cy="96"
					r={radius}
					stroke="currentColor"
					strokeWidth="12"
					fill="transparent"
					className="text-teal-50/50"
				/>
				{/* Progress Circle (The "Fill") */}
				<circle
					cx="96"
					cy="96"
					r={radius}
					stroke="currentColor"
					strokeWidth="12"
					fill="transparent"
					strokeDasharray={circumference}
					style={{
						strokeDashoffset: offset,
						transition: 'stroke-dashoffset 0.5s ease-in-out'
					}}
					strokeLinecap="round"
					className="text-teal-500"
				/>
			</svg>

			{/* Center Text */}
			<div className="absolute text-center">
				<p className="text-4xl font-black text-slate-900">{percentage}%</p>
				<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
					Recovered
				</p>
			</div>
		</div>
	);
};

export default RecoveredProgress;
