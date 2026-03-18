import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, PlusIcon } from "@heroicons/react/24/outline";
import { groupCategoryConfig } from "../../constants/transactionCategories";
import Button from "../ui/Button";
import AddExpenseModal from "../ui/AddExpenseModal";
import { PencilIcon } from '@heroicons/react/24/solid';

interface Props {
	groupName: string;
	category: string;
	dateRange?: string;
	location?: string;
	memberNames?: string[];
}

const MAX_VISIBLE = 5;

const getInitials = (name: string) =>
	name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const GroupDetailsBar = ({ groupName, category, dateRange, location, memberNames = [] }: Props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const visible = memberNames.slice(0, MAX_VISIBLE);
	const overflow = memberNames.length - MAX_VISIBLE;

	const config = groupCategoryConfig[category as keyof typeof groupCategoryConfig] ?? groupCategoryConfig.other;
	const Icon = config.icon;
	const textColorClass = config.color.split(' ').find(c => c.startsWith('text-')) ?? 'text-teal-500';

	return (
		<div className="xl:pl-64 px-4 sm:px-8 pt-8 pb-8">
			<AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

			{/* Breadcrumb */}
			<nav className="flex items-center gap-1.5 text-sm mb-4">
				<Link to="/groups" className="text-slate-400 hover:text-slate-600 transition-colors font-medium">
					Groups
				</Link>
				<span className="text-slate-300">/</span>
				<span className={`font-semibold ${textColorClass}`}>{config.name}</span>
			</nav>

			{/* Main Card */}
			<div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">

				{/* Left: Icon + Name + Meta */}
				<div className="flex items-center gap-4">
					<div className={`${config.color} p-3 rounded-xl shrink-0`}>
						<Icon className="w-6 h-6" />
					</div>
					<div>
						<h1 className="text-xl text-left font-bold text-slate-900">{groupName || 'Loading...'}</h1>
						<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
							{dateRange && (
								<div className="flex items-center gap-1.5">
									<CalendarIcon className="w-4 h-4 text-teal-500 shrink-0" />
									<span>{dateRange}</span>
								</div>
							)}
							{location && (
								<div className="flex items-center gap-1.5">
									<MapPinIcon className="w-4 h-4 text-teal-500 shrink-0" />
									<span>{location}</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Right: Members + Actions */}
				<div className="flex items-center gap-4 shrink-0">

					{/* Member Avatar Stack */}
					{visible.length > 0 && (
						<div className="flex -space-x-2">
							{visible.map((name, i) => (
								<div key={i} className="relative group">
									<div className="w-9 h-9 rounded-full ring-2 ring-white bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold cursor-default">
										{getInitials(name)}
									</div>
									<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
										{name}
										<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
									</div>
								</div>
							))}
							{overflow > 0 && (
								<div className="w-9 h-9 rounded-full ring-2 ring-white bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">
									+{overflow}
								</div>
							)}
						</div>
					)}

					{/* Action Buttons */}
					<Button variant="outline" className="flex items-center gap-2 py-2 px-4">
						<PencilIcon className="w-4 h-4" />
						<span className="hidden sm:inline">Edit</span>
					</Button>
					<Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 py-2 px-4">
						<PlusIcon className="w-4 h-4" />
						<span className="hidden sm:inline">Add Expense</span>
					</Button>
				</div>

			</div>
		</div>
	);
};

export default GroupDetailsBar;
