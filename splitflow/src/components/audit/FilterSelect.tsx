import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
	icon: React.ReactNode;
	value: string;
	options: string[];
	onChange: (value: string) => void;
}

const FilterSelect = ({ icon, value, options, onChange }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);

	}, []);
	return (
		<div className="relative flex-1 lg:max-w-[200px]" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 focus:ring-2 focus:ring-teal-500/20 transition-colors"
			>
				<div className="flex items-center gap-2 truncate">
					<div className="w-4 h-4 text-slate-400 shrink-0">{icon}</div>
					<span className="truncate font-medium">{value}</span>
				</div>
				<ChevronDownIcon className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute z-50 top-full left-0 mt-1 w-full bg-white border border-slate-100 rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
					{options.map((option) => (
						<button
							key={option}
							onClick={() => {
								onChange(option);
								setIsOpen(false);
							}}
							className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${value === option ? 'text-teal-600 font-bold bg-teal-50/50' : 'text-slate-600'}`}
						>
							{option}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default FilterSelect;

