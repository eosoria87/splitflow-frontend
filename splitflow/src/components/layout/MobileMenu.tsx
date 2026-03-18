import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon, Cog6ToothIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { navItems } from "../../constants/navigation";
import Logo from "../ui/Logo";
import { useAuth } from "../../hooks/useAuth";

const MobileMenu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const closeMenu = () => setIsOpen(false);

	const handleLogout = () => {
		closeMenu();
		logout();
		navigate('/');
	};

	return (
		<div className="xl:hidden">

			<button
				className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm shrink-0"
				onClick={() => setIsOpen(true)}
			>
				<Bars3Icon className="w-5 h-5" />
			</button>

			{isOpen && (
				<div
					className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
					onClick={closeMenu}
				></div>
			)}

			<div
				className={`fixed inset-y-0 left-0 w-64 bg-slate-50 border-r border-slate-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
			>

				<div className="p-6 flex items-center justify-between">
					<Logo />
					<button onClick={closeMenu} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
						<XMarkIcon className="w-5 h-5" />
					</button>
				</div>

				<nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
					{navItems.map((item) => (
						<NavLink
							key={item.name}
							to={item.path}
							onClick={closeMenu}
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
					<NavLink
						to="/settings"
						onClick={closeMenu}
						className={({ isActive }) =>
							`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive ? "bg-teal-50 text-teal-600" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`
						}
					>
						<Cog6ToothIcon className="w-5 h-5 stroke-2" />
						Settings
					</NavLink>

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
							<span className="text-sm font-bold text-left text-slate-900 truncate">{user?.name ?? '—'}</span>
							<span className="text-xs font-medium text-slate-500 truncate">{user?.email ?? '—'}</span>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
};

export default MobileMenu;
