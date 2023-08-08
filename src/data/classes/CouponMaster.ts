import CouponService from '$data/services/CouponService';

export default class CouponMaster {
	id: number;
	price: number;
	countPerIssue?: number;
	type?: string;
	name: string;
	expireDay?: number;
	dateCreated?: Date;
	totalIssuedCount: number;
	constructor({
		id,
		price,
		countPerIssue,
		type,
		name,
		expireDay,
		dateCreated,
		totalIssuedCount
	}: {
		id: number;
		price: number;
		countPerIssue?: number;
		type?: string;
		name: string;
		expireDay?: number;
		dateCreated?: Date;
		totalIssuedCount: number;
	}) {
		this.id = id;
		this.price = price;
		this.countPerIssue = countPerIssue;
		this.type = type;
		this.name = name;
		this.expireDay = expireDay;
		this.dateCreated = dateCreated;
		this.totalIssuedCount = totalIssuedCount;
	}
	/*신규가입쿠폰 설정 변경*/
	async changeNewMemberCoupon({
		price,
		countPerIssue,
		expireDay
	}: {
		price: number;
		countPerIssue: number;
		expireDay: number;
	}) {
		if (this.type !== '신규가입쿠폰') {
			throw new Error('type이 신규가입쿠폰이 아닙니다.');
		}
		const result = await CouponService.updateNewMemberCoupon({
			price,
			countPerIssue,
			expireDay
		});
		if (result.success) {
			alert('저장되었습니다.');
			return result.couponMaster;
		}
	}
	/*추천인쿠폰 설정 변경*/
	async changeReferralCoupon({
		price,
		countPerIssue,
		expireDay
	}: {
		price: number;
		countPerIssue: number;
		expireDay: number;
	}) {
		if (this.type !== '추천인쿠폰') {
			throw new Error('type이 추천인쿠폰이 아닙니다.');
		}
		const result = await CouponService.updateReferralCoupon({
			price,
			countPerIssue,
			expireDay
		});
		if (result.success) {
			alert('저장되었습니다.');
			return result.couponMaster;
		}
	}
	/*수동발행쿠폰 추가 생성 */
	static async createManualCoupon({
		price,
		name,
		message
	}: {
		price: number;
		name: string;
		message: string;
	}) {
		const result = await CouponService.createManualCoupon({
			price,
			name,
			message
		});
		return result.success;
	}

	/*수동발행쿠폰 발급 */
	static async issueManualCoupon({
		couponMasterId,
		subject,
		subjectPrice,
		issueCount
	}: {
		couponMasterId: number | undefined;
		subject: string;
		subjectPrice: number;
		issueCount: number;
	}) {
		const result = await CouponService.getManualCouponTargetList({
			couponMasterId,
			subject,
			subjectPrice,
			issueCount
		});
		return result;
	}
}
