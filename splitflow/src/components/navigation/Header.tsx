import { useState } from 'react';
import MobileMenu from './MobileMenu';
import { BellIcon, PlusIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import AddExpenseModal from '../ui/AddExpenseModal';

interface Props extends React.PropsWithChildren {
	title?: string;
	subtitle?: string;
	icon?: React.ReactNode;
}

const Header = ({ title, subtitle, icon, children }: Props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	return (
		<div >
			<AddExpenseModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }} />
			{/* --- TOP HEADER --- */}
			<header className="xl:pl-64 sm:px-8 pb-8 flex flex-row items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<MobileMenu />
					{icon &&
						<div className='text-primary size-15 bg-secondary rounded-2xl p-4 hidden xl:block'>
							{icon}
					</div>
					}
					<div>
						<h1 className="text-2xl font-bold mt-1 text-left text-slate-900">{title}</h1>
						<p className=" text-left text-sm  text-slate-500 hidden sm:block">{subtitle}</p>
						{children}
					</div>
				</div>

				<div className="flex items-center gap-3">
					<button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
						<BellIcon className="w-5 h-5" />
					</button>

					<Button variant="primary" onClick={() => setIsModalOpen(true)} className="py-2.5 px-4 sm:px-6 flex items-center gap-2 shrink-0">
						<PlusIcon className="w-4 h-4" />
						<span className="hidden sm:inline">Add Expense</span>
					</Button>
				</div>

			</header>

		</div>
	);
};

export default Header;

