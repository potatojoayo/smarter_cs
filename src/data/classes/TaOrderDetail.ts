export default class TaOrderDetail {
	id: number;
	productImage: string;
	productName: string;
	color: string;
	size: string;
	priceGym: number;
	priceSpecial: number;
	quantity: number;
	totalPriceSpecial: number;
	priceWork: number;

	constructor({
		id,
		productImage,
		productName,
		color,
		size,
		priceGym,
		priceSpecial,
		quantity,
		totalPriceSpecial,
		priceWork
	}: {
		id: number;
		productImage: string;
		productName: string;
		color: string;
		size: string;
		priceGym: number;
		priceSpecial: number;
		quantity: number;
		totalPriceSpecial: number;
		priceWork: number;
	}) {
		this.id = id;
		this.productImage = productImage;
		this.productName = productName;
		this.color = color;
		this.size = size;
		this.priceGym = priceGym;
		this.priceSpecial = priceSpecial;
		this.quantity = quantity;
		this.totalPriceSpecial = totalPriceSpecial;
		this.priceWork = priceWork;
	}
}
