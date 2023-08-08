import CouponService from '$data/services/CouponService';
import type { Page } from '@sveltejs/kit';

export async function load({ url }: Page) {
	const keyword = url.searchParams.get('keyword');
	const start = url.searchParams.get('start');
	const end = url.searchParams.get('end');
	const page = url.searchParams.get('page') || 1;
	const result = await CouponService.getUsedCouponList({
		couponMasterId: 1,
		page: +page,
		couponType: '수동쿠폰',
		keyword,
		start,
		end
	});

	const { usedCouponsHistories, totalCount } = result;
	return {
		usedCouponsHistories: usedCouponsHistories,
		totalCount: totalCount
	};
}
