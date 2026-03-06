import { NavLink } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { navItems } from "../../constants/navigation";
import Logo from "../ui/Logo";

const Sidebar = () => {

	return (
		<aside className="hidden xl:flex w-64 fixed inset-y-0 left-0 bg-slate-50 border-r border-slate-200 flex-col z-10">

			<div className="p-8 pb-6">
				<div className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-2">
					<Logo/>
				</div>
			</div>

			{/* flex-1 pushes the settings/profile section down to the bottom */}
			<nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
				{navItems.map((item) => (
					<NavLink
						key={item.name}
						to={item.path}
						className={({ isActive }) =>
							`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive
								? "bg-teal-50 text-teal-600" // The Active State (Mint Green)
								: "text-slate-500 hover:text-slate-900 hover:bg-slate-100" // The Inactive State
							}`
						}
					>
						{/* We dynamically render the icon component from the array */}
						<item.icon className="w-5 h-5 stroke-2" />
						{item.name}
					</NavLink>
				))}
			</nav>

			{/* 3. Bottom Section: Settings & Profile */}
			<div className="p-4 border-t border-slate-200 flex flex-col gap-2">

				{/* Settings Link */}
				<NavLink
					to="/settings"
					className={({ isActive }) =>
						`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive
							? "bg-teal-50 text-teal-600"
							: "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
						}`
					}
				>
					<Cog6ToothIcon className="w-5 h-5 stroke-2" />
					Settings
				</NavLink>

				{/* User Profile Block */}
				<div className="flex items-center gap-3 px-4 py-3 mt-2 cursor-pointer hover:bg-slate-100 rounded-xl transition-colors">
					<img
						src="https://i.pravatar.cc/150?img=68"
						alt="Alex Morgan"
						className="w-10 h-10 rounded-full border border-slate-200 object-cover shrink-0"
					/>
					<div className="flex flex-col overflow-hidden">
						<span className="text-sm font-bold text-slate-900 truncate">Alex Morgan</span>
						<span className="text-xs font-medium text-slate-500 truncate">alex@example.com</span>
					</div>
				</div>

			</div>

		</aside>
	);
};

export default Sidebar;
