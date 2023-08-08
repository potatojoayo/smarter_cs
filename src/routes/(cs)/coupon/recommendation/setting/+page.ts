import CouponMaster from '$data/classes/CouponMaster';
import CouponService from '$data/services/CouponService';

export async function load() {
	const referralCoupon = await CouponService.getCouponMaster({ name: '추천인쿠폰' });
	return {
		referralCoupon: new CouponMaster(referralCoupon)
	};
}
