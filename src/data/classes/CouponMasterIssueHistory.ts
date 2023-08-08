import type CouponMaster from './CouponMaster';

export default class CouponMasterIssueHistory {
	couponMaster: CouponMaster;
	condition: string;
	thresholdAmount: number;
	issuedCountPerGym: number;
	issuedAmountPerGym: number;
	searchType: string;
	totalIssuedCount: number;
	totalIssuedAmount: number;
	expiredDay: number;
	couponMessage: string;
	dateIssued: Date;

	constructor(couponMasterIssueHistory: CouponMasterIssueHistoryType) {
		this.couponMaster = couponMasterIssueHistory.couponMaster;
		this.condition = couponMasterIssueHistory.condition;
		this.thresholdAmount = couponMasterIssueHistory.thresholdAmount;
		this.issuedCountPerGym = couponMasterIssueHistory.issuedCountPerGym;
		this.issuedAmountPerGym = couponMasterIssueHistory.issuedAmountPerGym;
		this.searchType = couponMasterIssueHistory.searchType;
		this.totalIssuedCount = couponMasterIssueHistory.totalIssuedCount;
		this.totalIssuedAmount = couponMasterIssueHistory.totalIssuedAmount;
		this.expiredDay = couponMasterIssueHistory.expiredDay;
		this.couponMessage = couponMasterIssueHistory.couponMessage;
		this.dateIssued = couponMasterIssueHistory.dateIssued;
	}

	get dateExpired() {
		const date = new Date(`${this.dateIssued}`);
		date.setDate(date.getDate() + this.expiredDay);
		return date.toISOString().slice(0, 10);
	}
}

export interface CouponMasterIssueHistoryType {
	couponMaster: CouponMaster;
	condition: string;
	thresholdAmount: number;
	issuedCountPerGym: number;
	issuedAmountPerGym: number;
	searchType: string;
	totalIssuedCount: number;
	totalIssuedAmount: number;
	expiredDay: number;
	couponMessage: string;
	dateIssued: Date;
}
