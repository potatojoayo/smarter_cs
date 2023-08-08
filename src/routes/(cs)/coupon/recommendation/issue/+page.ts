import CouponService from '$data/services/CouponService';
import type { Page } from '@sveltejs/kit';

export async function load({ url }: Page) {
	const keyword = url.searchParams.get('keyword');
	const start = url.searchParams.get('start');
	const end = url.searchParams.get('end');
	const page = url.searchParams.get('page') || 1;
	const result = await CouponService.getIssuedCoupon({
		couponType: '추천인쿠폰',
		page: +page,
		keyword,
		start,
		end
	});

	const { issuedCouponsHistories, totalCount } = result;

	return {
		issuedCouponsHistories: issuedCouponsHistories,
		totalCount: totalCount
	};
}
