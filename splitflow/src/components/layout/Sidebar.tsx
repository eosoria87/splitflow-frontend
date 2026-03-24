import { NavLink, useNavigate } from "react-router-dom";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { navItems } from "../../constants/navigation";
import Logo from "../ui/Logo";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<aside className="hidden xl:flex w-64 shrink-0 sticky top-0 h-screen overflow-y-auto bg-slate-50 border-r border-slate-200 flex-col">

			<div className="p-8 pb-6">
				<div className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-2">
					<Logo/>
				</div>
			</div>

			<nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
				{navItems.map((item) => (
					<NavLink
						key={item.name}
						to={item.path}
						className={({ isActive }) =>
							`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive
								? "bg-teal-50 text-teal-600"
								: "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
							}`
						}
					>
						<item.icon className="w-5 h-5 stroke-2" />
						{item.name}
					</NavLink>
				))}
			</nav>

			<div className="p-4 border-t border-slate-200 flex flex-col gap-2">

				{/* <NavLink
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
				</NavLink> */}

				<button
					onClick={handleLogout}
					className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-slate-500 hover:text-red-600 hover:bg-red-50 w-full text-left"
				>
					<ArrowLeftStartOnRectangleIcon className="w-5 h-5 stroke-2" />
					Log Out
				</button>

				<div className="flex items-center gap-3 px-4 py-3 mt-2 hover:bg-slate-100 rounded-xl transition-colors">
					<div className="w-10 h-10 rounded-full border border-slate-200 bg-primary/10 flex items-center justify-center shrink-0">
						<span className="text-sm font-bold text-primary">
							{user?.name?.charAt(0).toUpperCase() ?? '?'}
						</span>
					</div>
					<div className="flex flex-col overflow-hidden">
						<span className="text-sm font-bold text-slate-900 truncate">{user?.name ?? '—'}</span>
						<span className="text-xs font-medium text-slate-500 truncate">{user?.email ?? '—'}</span>
					</div>
				</div>

			</div>

		</aside>
	);
};

export default Sidebar;
