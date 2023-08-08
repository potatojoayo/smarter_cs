export default class OrderedProduct {
	id: number;
	color: string;
	size: string;
	draftId?: number;
	studentNames?: string[];
	quantity = 0;
	productMasterId: number;
	productId: number;
	productName: string;
	priceProduct: number;
	priceWork = 0;
	priceTotal = 0;

	constructor({
		id,
		size,
		priceAdditional = 0,
		color,
		productName,
		priceProduct,
		productId,
		productMasterId
	}: {
		id: number;
		color: string;
		size: string;
		priceAdditional?: number;
		productName: string;
		priceProduct: number;
		productMasterId: number;
		productId: number;
	}) {
		this.id = id;
		this.color = color;
		this.size = size;
		this.productName = productName;
		this.priceProduct = priceProduct + priceAdditional;
		this.productMasterId = productMasterId;
		this.productId = productId;
	}
}
