import React from 'react';

const FilterSelect = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
	<button className="flex items-center justify-between px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 bg-white w-full lg:w-48">
		<div className="flex items-center gap-2">
			<div className="w-4 h-4 text-primary">{icon}</div>
			<span className="truncate">{text}</span>
		</div>
		<span className="text-[10px] text-primary ml-2">▼</span>
	</button>
);

export default FilterSelect;

