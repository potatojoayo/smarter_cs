import CouponMaster from '$data/classes/CouponMaster';
import CouponIssueHistory from '$data/classes/CouponIssueHistory';
import HttpClient from '$data/graphql/client';
import CouponQuery from '$data/graphql/queries/CouponQuery';
import CouponMutation from '$data/graphql/mutations/CouponMutation';
import CouponUsedHistory from '$data/classes/CouponUsedHistory';
import type ManualCouponTargetList from '$data/classes/ManualCouponTargetList';
import { ParentAddressZipCode, type AddressZipCodeType } from '$data/classes/AddressZipCode';
import CouponMasterIssueHistory from '$data/classes/CouponMasterIssueHistory';
import type { CouponMasterIssueHistoryType } from '$data/classes/CouponMasterIssueHistory';

export default class CouponService {
	static async getCouponMaster({ name = '' }: { name: string }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CouponQuery.CouponMaster, {
			name
		})) as {
			couponMaster: {
				id: number;
				name: string;
				price: number;
				dateCreated: Date;
				totalIssuedCount: number;
			};
		};
		return result.couponMaster;
	}

	//수동발행쿠폰 발행 대상자 불러오기
	static async getManualCouponTargetList({
		couponMasterId,
		subject,
		subjectPrice,
		issueCount
	}: {
		couponMasterId: number | undefined;
		subject: string;
		subjectPrice: number;
		issueCount: number;
	}): Promise<{ couponInfos: ManualCouponTargetList }> {
		const client = HttpClient.getInstance();
		const result = (await client.request(CouponQuery.manualCouponTargetList, {
			couponMasterId,
			subject,
			subjectPrice,
			issueCount
		})) as {
			couponInfos: {
				totalUsersCount: number;
				totalExpectedPrice: number;
				gymIds: number[];
			};
		};
		return { couponInfos: result.couponInfos };
	}

	//수동발행쿠폰 리스트 불러오기
	static async getManualCouponList({
		couponType,
		page
	}: {
		couponType: string;
		page: number;
	}): Promise<{ couponMasters: CouponMaster[]; totalCount: number }> {
		const client = HttpClient.getInstance();
		const result = (await client.request(CouponQuery.menualCouponList, {
			couponType,
			page
		})) as {
			couponMasters: {
				couponMasters: {
					id: number;
					name: string;
					price: number;
					dateCreated: Date;
					totalIssuedCount: number;
				}[];
				totalCount: number;
			};
		};

		return {
			couponMasters: result.couponMasters.couponMasters.map((cm) => new CouponMaster(cm)),
			totalCount: result.couponMasters.totalCount
		};
	}

	//쿠폰 사용내역 불러오기
	static async getUsedCouponList({
		couponMasterId,
		page,
		couponType,
		keyword,
		start,
		end
	}: {
		couponMasterId: number;
		page: number;
		couponType: string;
		keyword: string | null;
		start: string | null;
		end: string | null;
	}): Promise<{ usedCouponsHistories: CouponUsedHistory[]; totalCount: number }> {
		const client = HttpClient.getInstance();
		const result = (await client.request(CouponQuery.usedCouponList, {
			couponMasterId,
			page,
			couponType,
			keyword,
			start,
			end
		})) as {
			usedCoupons: {
				totalCount: number;
				usedCouponsHistories: {
					couponNumber: string;
					gymName: string;
					price: number;
					orderNumber: string;
					dateUsed: Date;
				}[];
			};
		};
		return {
			usedCouponsHistories: result.usedCoupons.usedCouponsHistories.map(
				(uch) => new CouponUsedHistory(uch)
			),
			totalCount: result.usedCoupons.totalCount
		};
	}

	//쿠폰 발급내역 불러오기
	static async getIssuedCoupon({
		couponType,
		page,
		keyword,
		start,
		end
	}: {
		couponType: string;
		page: number;
		keyword: string | null;
		start: string | null;
		end: string | null;
	}): Promise<{ issuedCouponsHistories: CouponIssueHistory[]; totalCount: number }> {
		const client = HttpClient.getInstance();
		const result = (await client.request(CouponQuery.CouponIssued, {
			couponType,
			page,
			keyword,
			start,
			end
		})) as {
			issuedCoupons: {
				totalCount: number;
				issuedCouponsHistories: {
					id: number;
					couponNumber: string;
					gymName: string;
					price: number;
					dateIssued: Date;
					startOfUse: Date;
					endOfUse: Date;
					couponName?: string;
				}[];
			};
		};
		return {
			issuedCouponsHistories: result.issuedCoupons.issuedCouponsHistories.map(
				(ich) => new CouponIssueHistory(ich)
			),
			totalCount: result.issuedCoupons.totalCount
		};
	}
	//수동발행쿠폰->쿠폰목록->쿠폰만들기->쿠폰발행
	static async createManualCoupon({
		name,
		price,
		message
	}: {
		name: string;
		price: number;
		message: string;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CouponMutation.createManualCoupon, {
			name,
			price,
			message
		})) as {
			createCoupon: {
				success: boolean;
			};
		};
		return {
			success: result.createCoupon.success
		};
	}

	static async updateNewMemberCoupon({
		price,
		countPerIssue,
		expireDay
	}: {
		price: number;
		countPerIssue: number;
		expireDay: number;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CouponMutation.UpdateNewMemberCoupon, {
			price,
			countPerIssue,
			expireDay
		})) as {
			updateNewMemberCoupon: {
				success: boolean;
				couponMaster: {
					id: number;
					price: number;
					countPerIssue: number;
					type: string;
					name: string;
					expireDay: number;
					totalIssuedCount: number;
				};
			};
		};
		return {
			success: result.updateNewMemberCoupon.success,
			couponMaster: new CouponMaster(result.updateNewMemberCoupon.couponMaster)
		};
	}
	static async updateReferralCoupon({
		price,
		countPerIssue,
		expireDay
	}: {
		price: number;
		countPerIssue: number;
		expireDay: number;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CouponMutation.UpdateReferralCoupon, {
			price,
			countPerIssue,
			expireDay
		})) as {
			updateReferralCoupon: {
				success: boolean;
				couponMaster: {
					id: number;
					price: number;
					countPerIssue: number;
					type: string;
					name: string;
					expireDay: number;
					totalIssuedCount: number;
				};
			};
		};
		return {
			success: result.updateReferralCoupon.success,
			couponMaster: new CouponMaster(result.updateReferralCoupon.couponMaster)
		};
	}

	static async addressZipCodes() {
		const client = HttpClient.getInstance();
		const { addressZipCodes } = (await client.request(CouponQuery.AddressZipCodes)) as {
			addressZipCodes: (AddressZipCodeType & {
				children: AddressZipCodeType[];
			})[];
		};
		return addressZipCodes.map((a) => new ParentAddressZipCode(a));
	}

	static async issueManualCoupon(variables: {
		couponMasterId: number;
		gymIds: number[];
		issueNumber: number;
		expireDay: number;
		couponMessage: string;
		addressZipCodeId?: number;
		condition?: string;
		thresholdAmount?: number;
		searchType: string;
	}) {
		const client = HttpClient.getInstance();
		const {
			issueManualCoupon: { success, message }
		} = (await client.request(CouponMutation.IssueManualCoupon, variables)) as {
			issueManualCoupon: {
				success: boolean;
				message: string;
			};
		};

		return {
			success,
			message
		};
	}

	static async manualCouponMasterIssueHistories({
		page,
		keyword,
		start,
		end
	}: {
		page: number;
		keyword: string | null;
		start: string | null;
		end: string | null;
	}): Promise<{
		manualCouponMasterIssueHistories: CouponMasterIssueHistory[];
		totalCount: number;
	}> {
		const client = HttpClient.getInstance();
		const result = (await client.request(CouponQuery.ManualCouponIssueHistories, {
			page,
			keyword,
			start,
			end
		})) as {
			couponMasterIssueHistories: {
				totalCount: number;
				couponMasterIssueHistories: CouponMasterIssueHistoryType[];
			};
		};
		return {
			manualCouponMasterIssueHistories:
				result.couponMasterIssueHistories.couponMasterIssueHistories.map(
					(ich) => new CouponMasterIssueHistory(ich)
				),
			totalCount: result.couponMasterIssueHistories.totalCount
		};
	}
}
