import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Bars3CenterLeftIcon,
	UserPlusIcon,
	LightBulbIcon,
	CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "../components/ui/Button";
import type { GroupCategory } from "../types/Transaction";
import { groupCategoryConfig } from "../constants/transactionCategories";
import MainContainer from "../components/ui/MainContainer";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import groupService from "../services/groupService";
import { useAuth } from "../hooks/useAuth";

const categoryToBackend: Record<GroupCategory, string> = {
	travel: 'travel',
	home: 'home',
	couple: 'couple',
	friends: 'friends',
	other: 'other',
};

const categoryKeys = Object.keys(groupCategoryConfig) as GroupCategory[];

const getCurrentUserName = (): string => {
	try { return JSON.parse(localStorage.getItem('sf_user') || '{}').name ?? 'You'; }
	catch { return 'You'; }
};

const getInitials = (name: string) =>
	name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ── Step indicator ────────────────────────────────────────────────────────────

const steps = ['Group Details', 'Invite Members'];

const StepIndicator = ({ current }: { current: number }) => (
	<div className="flex items-center gap-2 mb-8">
		{steps.map((label, i) => {
			const done = i < current;
			const active = i === current;
			return (
				<div key={i} className="flex items-center gap-2">
					<div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
						done ? 'bg-teal-500 text-white' :
						active ? 'bg-teal-500 text-white' :
						'bg-slate-100 text-slate-400'
					}`}>
						{done ? <CheckCircleIcon className="w-4 h-4" /> : i + 1}
					</div>
					<span className={`text-sm font-medium ${active ? 'text-slate-900' : done ? 'text-teal-600' : 'text-slate-400'}`}>
						{label}
					</span>
					{i < steps.length - 1 && (
						<div className={`w-12 h-px mx-1 ${done ? 'bg-teal-300' : 'bg-slate-200'}`} />
					)}
				</div>
			);
		})}
	</div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const CreateGroupPage = () => {
	const { session } = useAuth();
	const navigate = useNavigate();

	// Step 1 state
	const [step, setStep] = useState(0);
	const [groupName, setGroupName] = useState("");
	const [nameError, setNameError] = useState<string | null>(null);
	const [existingNames, setExistingNames] = useState<string[]>([]);
	const [description, setDescription] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<GroupCategory>('travel');
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);

	// Step 2 state
	const [inviteEmail, setInviteEmail] = useState("");
	const [addedMembers, setAddedMembers] = useState<{ email: string; userId: string }[]>([]);
	const [inviteError, setInviteError] = useState<string | null>(null);
	const [isInviting, setIsInviting] = useState(false);

	useEffect(() => {
		if (!session?.access_token) return;
		groupService.getGroups(session.access_token)
			.then(groups => setExistingNames(groups.map(g => g.name.toLowerCase())))
			.catch(() => {});
	}, [session?.access_token]);

	const validateName = (name: string) => {
		if (existingNames.includes(name.trim().toLowerCase())) {
			setNameError('You already have a group with this name.');
			return false;
		}
		setNameError(null);
		return true;
	};

	const handleCreateGroup = async () => {
		if (!groupName.trim() || !session?.access_token) return;
		if (!validateName(groupName)) return;
		setApiError(null);
		setIsLoading(true);
		try {
			const group = await groupService.createGroup(
				{ name: groupName.trim(), description: description.trim() || undefined, category: categoryToBackend[selectedCategory] },
				session.access_token
			);
			setCreatedGroupId(group.id);
			setStep(1);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to create group';
			setApiError(message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddMember = async () => {
		const email = inviteEmail.trim().toLowerCase();
		if (!email || !createdGroupId) return;
		if (addedMembers.some(m => m.email === email)) {
			setInviteError('This email is already in the group.');
			return;
		}
		setInviteError(null);
		setIsInviting(true);
		try {
			const userId = await groupService.addMember(createdGroupId, email);
			setAddedMembers(prev => [...prev, { email, userId }]);
			setInviteEmail("");
		} catch (err: unknown) {
			const backendMsg: string = (err as any)?.response?.data?.error ?? (err instanceof Error ? err.message : '');
			setInviteError(
				backendMsg.toLowerCase().includes('not found')
					? 'This email is not registered. The person must have a Splitflow account to be added.'
					: 'Failed to add member. Please try again.'
			);
		} finally {
			setIsInviting(false);
		}
	};

	const handleRemoveMember = async (email: string) => {
		if (!createdGroupId) return;
		const member = addedMembers.find(m => m.email === email);
		if (!member) return;
		try {
			await groupService.removeMember(createdGroupId, member.userId);
			setAddedMembers(prev => prev.filter(m => m.email !== email));
		} catch {
			setInviteError('Failed to remove member. Please try again.');
		}
	};

	const handleFinish = () => {
		navigate(createdGroupId ? `/group/${createdGroupId}` : '/dashboard');
	};

	return (
		<div className="min-h-screen bg-slate-50 pt-8 pb-12">
			<Header title="Create New Group" subtitle="Set up your shared expense group." hideAction />
			<Sidebar />

			<MainContainer columnsNum={1}>
				<div className="flex flex-col items-center max-w-xl mx-auto">
					<StepIndicator current={step} />

					{/* ── STEP 1: Group Details ── */}
					{step === 0 && (
						<div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
							<div className="flex items-center gap-2 mb-6">
								<Bars3CenterLeftIcon className="w-5 h-5 text-teal-500" />
								<h2 className="text-lg font-bold text-slate-900">Group Details</h2>
							</div>

							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">Group Name</label>
									<input
										type="text"
										placeholder="e.g., Summer Trip to Bali"
										value={groupName}
										onChange={(e) => { setGroupName(e.target.value); if (nameError) setNameError(null); }}
										onBlur={() => { if (groupName.trim()) validateName(groupName); }}
										className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:ring-2 outline-none transition-all ${nameError ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-teal-500/20 focus:border-teal-500'}`}
									/>
									{nameError && <p className="text-red-500 text-xs mt-1.5">{nameError}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
									<div className="grid grid-cols-5 gap-3">
										{categoryKeys.map((catKey) => {
											const { icon: Icon, name } = groupCategoryConfig[catKey];
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
													<span className="text-xs font-medium">{name}</span>
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
										rows={3}
										className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none"
									/>
								</div>
							</div>

							<div className="mt-8 pt-6 border-t border-slate-100">
								{apiError && <p className="text-red-500 text-sm mb-3">{apiError}</p>}
								<div className="flex items-center justify-between">
									<Button variant="outline" className="py-2.5 px-6" onClick={() => navigate('/dashboard')}>
										Cancel
									</Button>
									<Button
										variant="primary"
										onClick={handleCreateGroup}
										disabled={!groupName.trim() || !!nameError || isLoading}
										className="py-2.5 px-6"
									>
										{isLoading ? 'Creating…' : 'Continue →'}
									</Button>
								</div>
							</div>
						</div>
					)}

					{/* ── STEP 2: Invite Members ── */}
					{step === 1 && (
						<div className="flex flex-col gap-4">
							{/* Success banner */}
							<div className="flex items-center justify-center gap-3 bg-teal-50 border border-teal-100 rounded-2xl px-5 py-4">
								<CheckCircleIcon className="w-6 h-6 text-teal-500 shrink-0" />
								<div>
									<p className="text-sm font-bold text-teal-700">"{groupName}" created!</p>
									<p className="text-xs text-teal-600 mt-0.5">Add at least one member to get started — members can only be added here.</p>
								</div>
							</div>

							<div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
								<div className="flex items-center gap-2 mb-6">
									<UserPlusIcon className="w-5 h-5 text-teal-500" />
									<h2 className="text-lg font-bold text-slate-900">Invite Members</h2>
								</div>

								{/* Invite input */}
								<div className="mb-6">
									<label className="block text-sm text-left font-medium text-slate-700 mb-2">Add member by email <span className="text-red-400">*</span></label>
									<div className="flex gap-2">
										<input
											type="email"
											placeholder="friend@example.com"
											value={inviteEmail}
											onChange={(e) => { setInviteEmail(e.target.value); if (inviteError) setInviteError(null); }}
											onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
											disabled={isInviting}
											className={`flex-1 px-4 py-2.5 bg-white border rounded-xl text-sm focus:ring-2 outline-none transition-all ${inviteError ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-teal-500/20 focus:border-teal-500'}`}
										/>
										<Button variant="outline" onClick={handleAddMember} disabled={!inviteEmail.trim() || isInviting} className="py-2.5 px-5 border-teal-400 text-teal-600 hover:bg-teal-50">
											{isInviting ? '...' : 'Add'}
										</Button>
									</div>
									{inviteError && <p className="text-red-500 text-xs mt-1.5 text-left">{inviteError}</p>}
								</div>

								{/* Members list */}
								<div>
									<div className="flex items-center justify-between mb-3">
										<h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Members</h3>
										<span className="bg-teal-50 text-teal-600 text-xs font-bold px-2 py-0.5 rounded-full">
											{1 + addedMembers.length}
										</span>
									</div>

									<div className="space-y-2">
										{/* Current user — always admin */}
										<div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
											<div className="flex items-center gap-3">
												<div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold shrink-0">
													{getInitials(getCurrentUserName())}
												</div>
												<div>
													<p className="text-sm font-bold text-slate-900">{getCurrentUserName()}</p>
													<p className="text-xs text-slate-400">Group creator</p>
												</div>
											</div>
											<span className="bg-teal-50 text-teal-600 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md">Admin</span>
										</div>

										{/* Added members */}
										{addedMembers.map(({ email, userId }) => (
											<div key={userId} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
												<div className="flex items-center gap-3">
													<div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold shrink-0">
														{email[0].toUpperCase()}
													</div>
													<div>
														<p className="text-sm text-slate-700 font-medium">{email}</p>
														<p className="text-xs text-teal-500 font-medium">Added</p>
													</div>
												</div>
												<button
													onClick={() => handleRemoveMember(email)}
													className="text-xs text-slate-400 hover:text-red-500 transition-colors"
												>
													Remove
												</button>
											</div>
										))}
									</div>
								</div>

								<div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end">
									<Button
										variant="primary"
										onClick={handleFinish}
										disabled={addedMembers.length === 0}
										className="py-2.5 px-6"
									>
										Go to Group →
									</Button>
								</div>
							</div>

							<div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex gap-3 text-sm text-slate-600 items-start">
								<LightBulbIcon className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
								<p>
									<span className="font-bold text-teal-600">Heads up:</span> Members can only be added during group creation. Make sure to add everyone now.
								</p>
							</div>
						</div>
					)}
				</div>
			</MainContainer>
		</div>
	);
};

export default CreateGroupPage;
