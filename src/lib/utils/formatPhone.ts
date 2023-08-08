export function formatPhone(phone?: string): string {
	if (phone) return phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1 - $2 - $3`);
	return '';
}
