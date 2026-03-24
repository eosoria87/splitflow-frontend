const formatDateLabel = (dateStr: string): string => {
	const [year, month, day] = dateStr.split('-').map(Number);
	return new Date(year, month - 1, day).toLocaleDateString('en-US', {
		month: 'long', day: 'numeric', year: 'numeric',
	});
};

export default formatDateLabel;
