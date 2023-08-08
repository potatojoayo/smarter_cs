function extractNumber(number?: string): number {
	if (!number) return 0;
	return +number.replace(/[^0-9]/g, '');
}
export default extractNumber;
