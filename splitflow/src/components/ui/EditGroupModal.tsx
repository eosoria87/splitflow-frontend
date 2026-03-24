import { useState, useEffect } from "react";
import { CheckIcon, XMarkIcon, PencilIcon, Squares2X2Icon } from "@heroicons/react/24/solid";
import Button from "./Button";
import Dropdown from "./Dropdown";
import DeleteGroupSection from "./DeleteGroupSection";
import groupService from "../../services/groupService";

const GROUP_CATEGORIES = [
	{ value: 'travel',  label: 'Travel'  },
	{ value: 'home',    label: 'Home'    },
	{ value: 'couple',  label: 'Couple'  },
	{ value: 'friends', label: 'Friends' },
	{ value: 'other',   label: 'Other'   },
];

interface Props {
	isOpen: boolean;
	onClose: () => void;
	groupId: string;
	initialName: string;
	initialCategory: string;
	initialDescription?: string;
	isOwner: boolean;
	onGroupUpdated: () => void;
	onGroupDeleted: () => void;
}

const EditGroupModal = ({
	isOpen,
	onClose,
	groupId,
	initialName,
	initialCategory,
	initialDescription = '',
	isOwner,
	onGroupUpdated,
	onGroupDeleted,
}: Props) => {
	const [name, setName] = useState(initialName);
	const [category, setCategory] = useState(initialCategory);
	const [description, setDescription] = useState(initialDescription);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isOpen) {
			setName(initialName);
			setCategory(initialCategory);
			setDescription(initialDescription);
			setError(null);
		}
	}, [isOpen, initialName, initialCategory, initialDescription]);

	const isFormValid = name.trim() !== '';
	const hasChanges =
		name.trim() !== initialName.trim() ||
		category !== initialCategory ||
		description.trim() !== initialDescription.trim();

	const handleSave = async () => {
		if (!isFormValid) return;
		setError(null);
		setIsLoading(true);
		try {
			await groupService.updateGroup(groupId, {
				name: name.trim(),
				category,
				description: description.trim() || undefined,
			});
			sessionStorage.removeItem(`sf_group_${groupId}`);
			onGroupUpdated();
			onClose();
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Failed to update group. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm sm:p-6">
			<div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

				{/* Header */}
				<div className="flex bg-[#f2fbfb] items-start justify-between p-6 border-b border-slate-100 shrink-0">
					<div>
						<h2 className="text-xl font-bold text-left text-slate-900">Edit Group</h2>
						<p className="text-sm text-slate-500 mt-1">Update the group's name, category or description.</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
					>
						<XMarkIcon className="w-5 h-5" />
					</button>
				</div>

				{/* Body */}
				<div className="p-6 overflow-y-auto flex-1 space-y-5 text-left">

					{/* Name */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1.5">Group Name</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
								<PencilIcon className="w-4 h-4" />
							</div>
							<input
								type="text"
								value={name}
								onChange={e => setName(e.target.value)}
								placeholder="e.g. Summer Trip"
								className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
							/>
						</div>
					</div>

					{/* Category */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
						<Dropdown
							options={GROUP_CATEGORIES}
							value={category}
							onChange={setCategory}
							icon={<Squares2X2Icon className="w-4 h-4" />}
						/>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-slate-400 font-normal">(optional)</span></label>
						<textarea
							value={description}
							onChange={e => setDescription(e.target.value)}
							placeholder="What's this group for?"
							rows={3}
							className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors resize-none"
						/>
					</div>

					<DeleteGroupSection
						groupId={groupId}
						groupName={initialName}
					isOwner={isOwner}
					onGroupDeleted={onGroupDeleted}
					/>
				</div>

				{/* Footer */}
				<div className="p-6 border-t border-slate-100 bg-white shrink-0 rounded-b-2xl">
					{error && <p className="text-sm text-red-500 font-medium mb-3 text-right">{error}</p>}
					<div className="flex justify-end gap-3">
						<Button variant="outline" onClick={onClose} disabled={isLoading} className="py-2.5">
							Cancel
						</Button>
						<Button variant="primary" onClick={handleSave} disabled={isLoading || !isFormValid || !hasChanges} className="py-2.5 flex items-center gap-2">
							{isLoading ? (
								<svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
								</svg>
							) : (
								<CheckIcon className="w-4 h-4" />
							)}
							{isLoading ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
				</div>

			</div>
		</div>
	);
};

export default EditGroupModal;
