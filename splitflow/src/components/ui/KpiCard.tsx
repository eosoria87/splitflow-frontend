import React from 'react';

const KpiCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string, color: 'teal' | 'orange' | 'red' }) => {
	const colorMap = {
		teal: "bg-teal-50 text-teal-500",
		orange: "bg-orange-50 text-orange-500",
		red: "bg-red-50 text-red-500"
	};
	return (
		<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
			<div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
				<div className="w-6 h-6">{icon}</div>
			</div>
			<div>
				<p className="sm:text-left text-xs font-medium text-slate-400 uppercase tracking-wide">{title}</p>
				<p className="text-left text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
			</div>
		</div>
	);
};

export default KpiCard;
