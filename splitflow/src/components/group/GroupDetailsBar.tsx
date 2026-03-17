import { CalendarIcon, MapPinIcon, TagIcon } from "@heroicons/react/24/outline";

interface Props {
	category: string;
	dateRange?: string;
	location?: string;
	membersCount: number;
	memberAvatars: string[];
	memberNames?: string[];
}

const MAX_VISIBLE = 5;

const getInitials = (name: string) =>
	name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const GroupDetailsBar = ({ category, dateRange, location, memberNames = [] }: Props) => {
	const visible = memberNames.slice(0, MAX_VISIBLE);
	const overflow = memberNames.length - MAX_VISIBLE;

	return (
		// -mt-4 pulls this bar slightly closer to the Header above it
		<div className="xl:pl-64 px-4 sm:px-8 pb-8 -mt-4">
		<div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">

			{/* --- LEFT SIDE: Meta Data --- */}
			<div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-500">

				{/* Category */}
				<div className="flex items-center gap-1.5 bg-teal-50 text-teal-600 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
					<TagIcon className="w-3.5 h-3.5" />
					{category}
				</div>

				{/* Date */}
				{dateRange && (
					<div className="flex items-center gap-2">
						<CalendarIcon className="w-4 h-4 text-teal-500 shrink-0" />
						<span>{dateRange}</span>
					</div>
				)}

				{/* Location */}
				{location && (
					<div className="flex items-center gap-2">
						<MapPinIcon className="w-4 h-4 text-teal-500 shrink-0" />
						<span>{location}</span>
					</div>
				)}
			</div>

			{/* --- RIGHT SIDE: Member Avatars --- */}
			{visible.length > 0 && (
				<div className="flex items-center gap-3 shrink-0">
					<span className="text-xs font-medium text-slate-400 uppercase tracking-widest hidden sm:block">
						Members
					</span>

					{/* Initials Avatar Stack */}
					<div className="flex -space-x-2">
						{visible.map((name, i) => (
							<div key={i} className="relative group">
								<div className="w-8 h-8 rounded-full ring-2 ring-white bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold cursor-default">
									{getInitials(name)}
								</div>
								<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
									{name}
									<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
								</div>
							</div>
						))}

						{/* Overflow bubble */}
						{overflow > 0 && (
							<div className="w-8 h-8 rounded-full ring-2 ring-white bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">
								+{overflow}
							</div>
						)}
					</div>
				</div>
			)}

		</div>
		</div>
	);
};

export default GroupDetailsBar;
