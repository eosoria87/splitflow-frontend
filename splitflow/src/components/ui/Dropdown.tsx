import { useState, useRef, useEffect } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export interface DropdownOption {
	value: string;
	label: string;
}

interface Props {
	options: DropdownOption[];
	value: string;
	onChange: (value: string) => void;
	icon?: React.ReactNode;
}

const Dropdown = ({ options, value, onChange, icon }: Props) => {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node))
				setOpen(false);
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, [open]);

	const selected = options.find(o => o.value === value);

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen(v => !v)}
				className="w-full flex items-center gap-3 pl-3 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-white hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
			>
				{icon && <span className="text-slate-400 shrink-0">{icon}</span>}
				<span className="flex-1 text-left">{selected?.label}</span>
				<ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
			</button>

			{open && (
				<div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white border border-slate-100 rounded-2xl shadow-lg py-1.5 overflow-hidden">
					{options.map(o => (
						<button
							key={o.value}
							type="button"
							onClick={() => { onChange(o.value); setOpen(false); }}
							className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${value === o.value
								? 'bg-teal-50 text-teal-600 font-semibold'
								: 'text-slate-700 hover:bg-slate-50'
							}`}
						>
							{o.label}
							{value === o.value && <CheckIcon className="w-4 h-4 text-teal-500" />}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default Dropdown;
