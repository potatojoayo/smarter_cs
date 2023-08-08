import extractNumberString from '$lib/utils/extractNumberString';

function formatMoney({
	money,
	suffix = true
}: {
	money?: string | number;
	suffix?: boolean;
}): string {
	if (money === null) {
		if (suffix) {
			return '0 원';
		} else {
			return '0';
		}
	}
	if (money === 0) {
		if (suffix) {
			return '0 원';
		} else {
			return '0';
		}
	}
	if (typeof money === 'undefined') {
		return '';
	}
	if (typeof money === 'string' && money) {
		money = parseInt(extractNumberString(money), 10);
	}
	const formattedMoney = money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	if (suffix) {
		return formattedMoney + ' 원';
	} else {
		return formattedMoney;
	}
}

export default formatMoney;
