import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Bars3CenterLeftIcon,
	UserPlusIcon,
	LightBulbIcon,
	ChevronDownIcon
} from "@heroicons/react/24/outline";
import Button from "../components/ui/Button";

import type { TransactionCategory } from "../types/Transaction";
import { categoryConfig } from "../constants/transactionCategories";
import MainContainer from "../components/ui/MainContainer";
import { mockMembers } from "../data/mockMembers";
import type { Member } from "../types/Member";
import Header from "../components/navigation/Header";
import Sidebar from "../components/navigation/Sidebar";
import groupService from "../services/groupService";
import { useAuth } from "../hooks/useAuth";

// Maps frontend category keys to the values the backend accepts
const categoryToBackend: Record<TransactionCategory, string> = {
	transport: 'travel',
	accommodation: 'home',
	food: 'other',
	shopping: 'other',
};


// 2. Map our strict types to the friendly UI labels seen in your design
const categoryLabels: Record<TransactionCategory, string> = {
	transport: "Travel",
	accommodation: "Home",
	food: "Dining",
	shopping: "Other"
};

// Extract the keys from our config so we can loop through them
const categoryKeys = Object.keys(categoryConfig) as TransactionCategory[];

const CreateGroupPage = () => {
	const { session } = useAuth();
	const navigate = useNavigate();

	const [groupName, setGroupName] = useState("");
	const [description, setDescription] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<TransactionCategory>('transport');
	const [inviteEmail, setInviteEmail] = useState("");
	const [members, setMembers] = useState<Member[]>(mockMembers);
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const handleCreateGroup = async () => {
		if (!groupName.trim() || !session?.access_token) return;
		setApiError(null);
		setIsLoading(true);
		try {
			await groupService.createGroup(
				{ name: groupName.trim(), description: description.trim() || undefined, category: categoryToBackend[selectedCategory] },
				session.access_token
			);
			navigate('/dashboard');
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to create group';
			setApiError(message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 pt-8 pb-12">
			<Header title="Create New Group" subtitle="Set up your shared expense group and invite your friends." />
			<Sidebar />


			<MainContainer columnsNum={2}>

				{/* --- LEFT COLUMN: GROUP DETAILS --- */}
				<div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col h-full">

					<div className="flex items-center gap-2 mb-6">
						<Bars3CenterLeftIcon className="w-5 h-5 text-teal-500" />
						<h2 className="text-lg font-bold text-slate-900">Group Details</h2>
					</div>

					<div className="space-y-6 flex-1">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">Group Name</label>
							<input
								type="text"
								placeholder="e.g., Summer Trip to Bali"
								value={groupName}
								onChange={(e) => setGroupName(e.target.value)}
								className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
							/>
						</div>

						{/* Category Selector powered by your central config */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
								{categoryKeys.map((catKey) => {
									// Grab the icon dynamically from the config!
									const { icon: Icon } = categoryConfig[catKey];
									const isActive = selectedCategory === catKey;

									return (
										<button
											key={catKey}
											onClick={() => setSelectedCategory(catKey)}
											className={`flex flex-col items-center justify-center py-4 rounded-xl border transition-all ${isActive
												? 'bg-teal-50 border-teal-500 text-teal-600 shadow-sm'
												: 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300'
												}`}
										>
											<Icon className="w-6 h-6 mb-2" />
											<span className="text-xs font-medium">{categoryLabels[catKey]}</span>
										</button>
									);
								})}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Description <span className="text-slate-400 font-normal">(Optional)</span>
							</label>
							<textarea
								placeholder="What are you sharing expenses for?"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={4}
								className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none"
							/>
						</div>
					</div>

					<div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
						{apiError && <p className="text-red-500 text-sm">{apiError}</p>}
						<div className="flex items-center justify-end gap-3">
							<Button variant="outline" className="py-2.5 px-6" onClick={() => navigate('/dashboard')}>Cancel</Button>
							<Button variant="primary" onClick={handleCreateGroup} disabled={!groupName.trim() || isLoading} className="py-2.5 px-6">
								{isLoading ? 'Creating…' : '✓ Create Group'}
							</Button>
						</div>
					</div>
				</div>

				{/* --- RIGHT COLUMN: MANAGE MEMBERS --- */}
				<div className="flex flex-col gap-6">

					<div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
						<div className="flex items-center gap-2 mb-6">
							<UserPlusIcon className="w-5 h-5 text-teal-500" />
							<h2 className="text-lg font-bold text-slate-900">Manage Members</h2>
						</div>

						<div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8">
							<label className="block text-sm font-medium text-slate-700 mb-2">Invite by email</label>
							<div className="flex gap-2">
								<input
									type="email"
									placeholder="friend@example.com"
									value={inviteEmail}
									onChange={(e) => setInviteEmail(e.target.value)}
									className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
								/>
								<button className="px-5 py-2.5 bg-white border border-teal-500 text-teal-600 font-medium rounded-lg text-sm hover:bg-teal-50 transition-colors">
									Invite
								</button>
							</div>
							<p className="text-[11px] text-slate-400 mt-2">They will receive an email with a join link.</p>
						</div>

						<div>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Members</h3>
								<span className="bg-teal-50 text-teal-600 text-xs font-bold px-2 py-0.5 rounded-full">
									{members.length}
								</span>
							</div>

							<div className="space-y-3">
								{members.map((member) => (
									<div key={member.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">

										<div className="flex items-center gap-3">
											<div className="relative">
												{member.avatar ? (
													<img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
												) : (
													<div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
														{member.name.substring(0, 2).toUpperCase()}
													</div>
												)}
												<div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${member.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'
													}`}></div>
											</div>

											<div>
												<p className="sm:text-left text-sm font-bold text-slate-900">{member.name}</p>
												<p className="text-xs text-slate-500">{member.email}</p>
											</div>
										</div>

										<div>
											{member.role === 'Admin' && (
												<span className="bg-teal-50 text-teal-600 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md">Admin</span>
											)}
											{member.role === 'Member' && (
												<button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 font-medium">
													Member <ChevronDownIcon className="w-3 h-3" />
												</button>
											)}
											{member.role === 'Pending' && (
												<span className="text-[11px] font-medium text-slate-400 italic">Pending</span>
											)}
										</div>

									</div>
								))}
							</div>
						</div>
					</div>

					<div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex gap-3 text-sm text-slate-600 items-start">
						<LightBulbIcon className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
						<p>
							<span className="font-bold text-teal-600">Pro Tip:</span> Ensure all members are added to the group upfront. Admins have full control over managing expenses.
						</p>
					</div>

				</div>

			</MainContainer>
		</div>
	);
};

export default CreateGroupPage;
