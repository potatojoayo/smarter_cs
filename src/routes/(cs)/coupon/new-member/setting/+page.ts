import CouponMaster from '$data/classes/CouponMaster';
import CouponService from '$data/services/CouponService';

export async function load() {
	const newMemberCoupon = await CouponService.getCouponMaster({ name: '신규가입쿠폰' });
	return {
		newMemberCoupon: new CouponMaster(newMemberCoupon)
	};
}
