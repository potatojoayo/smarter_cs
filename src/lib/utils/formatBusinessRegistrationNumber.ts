export function formatBusinessRegistrationNumber(businessRegistrationNumber?: string): string {
	if (businessRegistrationNumber)
		return businessRegistrationNumber.replace(/^(\d{3})(\d{2})(\d{5})$/, `$1 - $2 - $3`);
	return '';
}
