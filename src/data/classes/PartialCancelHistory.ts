export default class PartialCancelHistory {
	csRequestNumber: string;
	csRequestId: number;
	orderNumber: string;
	orderMasterId: number;
	gymName: string;
	reason?: string;
	priceProduct: number;
	priceTotal: number;
	color: string;
	size: string;
	productName: string;
	canceledQuantity: number;
	dateCreated: Date;

	constructor({
		csRequestNumber,
		csRequestId,
		orderNumber,
		orderMasterId,
		reason,
		gymName,
		dateCreated,
		canceledQuantity,
		productName,
		priceProduct,
		size,
		color,
		priceTotal
	}: {
		csRequestNumber: string;
		csRequestId: number;
		orderNumber: string;
		orderMasterId: number;
		gymName: string;
		reason?: string;
		priceProduct: number;
		priceTotal: number;
		color: string;
		size: string;
		productName: string;
		canceledQuantity: number;
		dateCreated: Date;
	}) {
		this.csRequestNumber = csRequestNumber;
		this.csRequestId = csRequestId;
		this.orderNumber = orderNumber;
		this.orderMasterId = orderMasterId;
		this.gymName = gymName;
		this.dateCreated = dateCreated;
		this.reason = reason;
		this.priceProduct = priceProduct;
		this.color = color;
		this.size = size;
		this.productName = productName;
		this.canceledQuantity = canceledQuantity;
		this.priceTotal = priceTotal;
	}
}
