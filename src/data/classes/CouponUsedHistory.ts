export default class CouponUsedHistory {
	couponNumber: string;
	gymName: string;
	price: number;
	orderNumber: string;
	dateUsed: Date;
	couponName?: string;
	referralCode?: string;

	constructor({
		couponNumber,
		gymName,
		price,
		orderNumber,
		dateUsed,
		coupon
	}: {
		couponNumber: string;
		gymName: string;
		price: number;
		orderNumber: string;
		dateUsed: Date;
		coupon?: {
			referralCode?: string;
			couponMaster: {
				name: string;
			};
		};
	}) {
		this.couponNumber = couponNumber;
		this.referralCode = coupon?.referralCode;
		this.gymName = gymName;
		this.price = price;
		this.orderNumber = orderNumber;
		this.dateUsed = dateUsed;
		this.couponName = coupon?.couponMaster.name;
	}
}
