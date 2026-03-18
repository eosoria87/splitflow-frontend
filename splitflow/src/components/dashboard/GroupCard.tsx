import { ArrowRightIcon } from "@heroicons/react/16/solid";
import Card from "../ui/Card";
import { TagIcon } from "@heroicons/react/24/outline";

import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface GroupCardType {
	id: string;
	icon?: ReactNode;
	iconBgClass?: string;
	status: 'owed' | 'owe' | 'settled';
	amount?: string | null;
	title: string;
	lastActivity?: string;
	category?: string;
	memberNames?: string[];
}


const getInitials = (name: string) =>
	name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const MAX_AVATARS = 3;

const GroupCard = ({ id, title, lastActivity, icon, iconBgClass, status, amount, memberNames = [] }: GroupCardType) => {

	const getBadgeStyle = () => {
		switch (status) {
			case 'owed': return { bg: 'bg-teal-50', text: 'text-teal-600', label: `Owed ${amount}` };
			case 'owe': return { bg: 'bg-orange-50', text: 'text-orange-500', label: `Owe ${amount}` };
			case 'settled': return { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Settled up' };
		}
	};

	const badge = getBadgeStyle();
	return (
		<Link to={`/group/${id}`} className="block h-full">
			<Card className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer p-4 sm:p-5">

				{/* Top Row: Icon & Badge */}
				<div className="flex justify-between items-start mb-4">
					<div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass} [&>svg]:w-4 [&>svg]:h-4`}>
						{icon ?? <TagIcon className="w-4 h-4" />}
					</div>
					{badge && (
						<span className={`${badge.bg} ${badge.text} text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap`}>
							{badge.label}
						</span>
					)}
				</div>

				{/* Middle Row: Text Content */}
				<div className="flex-1 mb-4">
					<h3 className="text-sm font-bold text-left text-slate-900 truncate">{title}</h3>
					<p className="text-xs text-slate-400 text-left mt-0.5 truncate">{lastActivity}</p>
				</div>

				{/* Bottom Row: Avatars & Arrow */}
				<div className="flex justify-between items-center">
					<div className="flex items-center -space-x-1.5">
						{memberNames.slice(0, MAX_AVATARS).map((name, i) => (
							<div
								key={i}
								className="w-6 h-6 rounded-full ring-2 ring-white bg-teal-50 text-teal-600 flex items-center justify-center text-[9px] font-bold"
							>
								{getInitials(name)}
							</div>
						))}
						{memberNames.length > MAX_AVATARS && (
							<div className="w-6 h-6 rounded-full ring-2 ring-white bg-slate-100 text-slate-500 flex items-center justify-center text-[9px] font-bold">
								+{memberNames.length - MAX_AVATARS}
							</div>
						)}
					</div>
					<div className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300 hover:border-slate-300 hover:text-slate-400 transition-colors">
						<ArrowRightIcon className="w-3.5 h-3.5" />
					</div>
				</div>

			</Card>
		</Link>
	);
};

export default GroupCard;

