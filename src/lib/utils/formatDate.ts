export function formatDate(date?: Date | string): string {
	if (!date) return '-';
	const offset = 1000 * 60 * 60 * 9;
	if (typeof date === 'string') date = new Date(date);
	date = new Date(date.getTime() + offset);
	return date.toISOString().split('T')[0];
}
