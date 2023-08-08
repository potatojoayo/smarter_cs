export default class ManualCouponTargetList {
	totalUsersCount: number;
	totalExpectedPrice: number;
	gymIds: number[];

    constructor({
        totalUsersCount,
        totalExpectedPrice,
        gymIds
    }: {
        totalUsersCount: number;
        totalExpectedPrice: number;
        gymIds: number[];
    }) {
        this.totalUsersCount = totalUsersCount;
        this.totalExpectedPrice = totalExpectedPrice;
        this.gymIds = gymIds;
    }
}
