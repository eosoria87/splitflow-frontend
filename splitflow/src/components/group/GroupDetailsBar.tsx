import { CalendarIcon, MapPinIcon, TagIcon } from "@heroicons/react/24/outline";

interface Props {
	category: string;
	dateRange?: string;
	location?: string;
	membersCount: number;
	// In a real app, an array of member objects here
	memberAvatars: string[];
}

const GroupDetailsBar = ({ category, dateRange, location, membersCount, memberAvatars }: Props) => {

	// Calculate how many extra members aren't shown in the initial avatar stack
	const extraMembers = membersCount - memberAvatars.length;

	return (
		// -mt-4 pulls this bar slightly closer to the Header above it
		<div className="xl:pl-64 px-4 sm:px-8 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 -mt-4">

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
			<div className="flex items-center gap-3 shrink-0">
				<span className="text-xs font-medium text-slate-400 uppercase tracking-widest hidden sm:block">
					Members
				</span>

				{/* The Overlapping Avatar Stack */}
				<div className="flex -space-x-2 overflow-hidden px-1">
					{memberAvatars.map((avatarUrl, index) => (
						<img
							key={index}
							className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
							src={avatarUrl}
							alt={`Member ${index + 1}`}
						/>
					))}

					{/* The "+X" Bubble */}
					{extraMembers > 0 && (
						<div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 text-xs font-bold text-slate-500">
							+{extraMembers}
						</div>
					)}
				</div>
			</div>

		</div>
	);
};

export default GroupDetailsBar;
