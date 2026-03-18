import { useState } from 'react';
import MobileMenu from './MobileMenu';
import { BellIcon, PlusIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import AddExpenseModal from '../ui/AddExpenseModal';

interface Props extends React.PropsWithChildren {
	title: string;
	subtitle?: string;
	icon?: React.ReactNode;
	customAction?: React.ReactNode;
	hideAction?: boolean;
}

const Header = ({ title, subtitle, icon, customAction, hideAction }: Props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const miniTitle = title.length > 6 ? `${title.substring(0, 3)}...` : title;
	return (
		<div >
			<AddExpenseModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }} />
			{/* --- TOP HEADER --- */}
			<header className={`xl:pl-64 sm:px-8 pb-8 flex flex-row items-center gap-2 ${hideAction ? 'justify-center' : 'justify-between'}`}>
				{!hideAction && <MobileMenu />}
				{icon &&
					<div className='text-primary size-15 bg-white border border-slate-200 rounded-2xl p-4 hidden xl:block shrink-0'>
						{icon}
					</div>
				}
				<div className={`min-w-0 ${hideAction ? 'text-center' : ''}`}>
					<h1 className={`text-xl sm:text-2xl font-bold mt-1 text-slate-900 ${hideAction ? 'text-center' : 'text-left'}`}>
						<span className="max-[374px]:hidden block truncate">
							{title}
						</span>
						<span className="hidden max-[374px]:block">
							{miniTitle}
						</span>
					</h1>
					<p className={`truncate text-sm text-primary hidden sm:block ${hideAction ? 'text-center' : 'text-left'}`}>{subtitle}</p>
				</div>

				{!hideAction && (
					<div className="flex items-center gap-3">
						<button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
							<BellIcon className="w-5 h-5" />
						</button>

						{customAction ? (
							customAction
						) : (
							<Button variant="primary" onClick={() => setIsModalOpen(true)} className="py-2.5 px-4 sm:px-6 flex items-center gap-2 shrink-0">
							    <PlusIcon className="w-4 h-4" />
							    <span className="hidden sm:inline">Add Expense</span>
							</Button>
						)}
					</div>
				)}

			</header>

		</div>
	);
};

export default Header;

