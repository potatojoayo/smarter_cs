export default class ReturnRequestDetail {
	id: number;
	productMasterName: string;
	priceWork: number;
	color: string;
	size: string;
	returnQuantity: number;
	returnPrice: number;
	priceProduct: number;

	constructor({
		id,
		productMasterName,
		priceWork,
		color,
		size,
		returnQuantity,
		returnPrice,
		orderDetail
	}: {
		id: number;
		productMasterName: string;
		priceWork: number;
		color: string;
		size: string;
		returnQuantity: number;
		returnPrice: number;
		orderDetail: {
			priceGym: number;
		};
	}) {
		this.id = id;
		this.productMasterName = productMasterName;
		this.priceWork = priceWork;
		this.color = color;
		this.size = size;
		this.returnQuantity = returnQuantity;
		this.returnPrice = returnPrice;
		this.priceProduct = orderDetail.priceGym;
	}
}
