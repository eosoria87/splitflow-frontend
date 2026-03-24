import { useState } from "react";
import Button from "./Button";
import groupService from "../../services/groupService";

interface Props {
	groupId: string;
	groupName: string;
	isOwner: boolean;
	onGroupDeleted: () => void;
}

const DeleteGroupSection = ({ groupId, groupName, isOwner, onGroupDeleted }: Props) => {
	const [isConfirming, setIsConfirming] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleDelete = async () => {
		setIsLoading(true);
		setError(null);
		try {
			await groupService.deleteGroup(groupId);
			sessionStorage.removeItem(`sf_group_${groupId}`);
			onGroupDeleted();
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Failed to delete group. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="border-t border-red-100 pt-5 mt-2">
			<p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3">Danger Zone</p>

			{!isConfirming ? (
				<button
				onClick={() => setIsConfirming(true)}
				disabled={!isOwner}
				className="text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors border border-red-200 disabled:opacity-40 disabled:cursor-not-allowed"
				>
					Delete Group
				</button>
			) : (
				<div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-3">
					<p className="text-sm text-slate-700">
						Are you sure you want to delete <span className="font-bold">"{groupName}"</span>? This action cannot be undone.
					</p>
					{error && <p className="text-sm text-red-500 font-medium">{error}</p>}
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => setIsConfirming(false)} disabled={isLoading} className="py-2">
							Cancel
						</Button>
						<button
							onClick={handleDelete}
							disabled={isLoading}
							className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
						>
							{isLoading && (
								<svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
								</svg>
							)}
							{isLoading ? 'Deleting...' : 'Yes, delete'}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default DeleteGroupSection;
