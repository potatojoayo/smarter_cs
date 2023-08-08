import CouponService from "$data/services/CouponService";
import type {Page} from "@sveltejs/kit"

export async function load({url}:Page) {
    const page = url.searchParams.get('page') || 1;
    const result = (await CouponService.getManualCouponList({ couponType: "수동쿠폰", page: +page}));

    const {couponMasters, totalCount} = result;
    return {
        manualCoupons: couponMasters,
        totalCount: totalCount
    }
}