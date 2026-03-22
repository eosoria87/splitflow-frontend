export const getStatusColors = (status: string) => {
	switch (status.toLowerCase()) {
		case 'settled': return "bg-teal-50 text-primary";
		case 'pending': return "bg-orange-50 text-orange-600";
		case 'disputed': return "bg-red-50 text-red-600";
		default: return "bg-teal-50 text-slate-400";
	}
}
