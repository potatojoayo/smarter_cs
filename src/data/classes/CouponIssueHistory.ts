export default class CouponIssueHistory {
	id: number;
	couponNumber: string;
	gymName: string;
	price: number;
	dateIssued: Date;
	startOfUse: Date;
	endOfUse: Date;
	couponName?: string;
	referralCode?: string;

	constructor({
		id,
		couponNumber,
		gymName,
		price,
		dateIssued,
		startOfUse,
		endOfUse,
		coupon
	}: {
		id: number;
		couponNumber: string;
		gymName: string;
		price: number;
		dateIssued: Date;
		startOfUse: Date;
		endOfUse: Date;
		coupon?: {
			referralCode?: string;
			couponMaster: {
				name: string;
			};
		};
	}) {
		this.id = id;
		this.couponNumber = couponNumber;
		this.gymName = gymName;
		this.price = price;
		this.dateIssued = dateIssued;
		this.referralCode = coupon?.referralCode;
		this.startOfUse = startOfUse;
		this.endOfUse = endOfUse;
		this.couponName = coupon?.couponMaster.name;
	}
}
