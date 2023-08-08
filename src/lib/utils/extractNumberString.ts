function extractNumberString(number: string): string {
	if (!number) return '';
	return number.replace(/[^0-9]/g, '');
}

export default extractNumberString;
