export default class CancelOrderRequest {
	id: number;
	csRequestNumber: string;
	csRequestId: number;
	orderNumber: string;
	orderMasterId: number;
	gymName: string;
	reason?: string;
	priceProducts: number;
	priceWorks: number;
	priceDelivery: number;
	priceTotal: number;
	state: string;
	dateCreated: Date;
	dateCompleted?: Date;
	checked = false;

	constructor({
		csRequestNumber,
		csRequestId,
		orderNumber,
		orderMasterId,
		reason,
		priceWorks,
		priceProducts,
		priceTotal,
		priceDelivery,
		gymName,
		state,
		dateCompleted,
		dateCreated,
		id
	}: {
		csRequestNumber: string;
		csRequestId: number;
		orderNumber: string;
		orderMasterId: number;
		gymName: string;
		reason?: string;
		priceProducts: number;
		priceWorks: number;
		priceDelivery: number;
		priceTotal: number;
		state: string;
		dateCreated: Date;
		dateCompleted?: Date;
		id: number;
	}) {
		this.csRequestNumber = csRequestNumber;
		this.csRequestId = csRequestId;
		this.orderNumber = orderNumber;
		this.orderMasterId = orderMasterId;
		this.id = id;
		this.gymName = gymName;
		this.priceProducts = priceProducts;
		this.priceWorks = priceWorks;
		this.priceDelivery = priceDelivery;
		this.priceTotal = priceTotal;
		this.state = state;
		this.dateCreated = dateCreated;
		this.dateCompleted = dateCompleted;
		this.reason = reason;
	}
}
