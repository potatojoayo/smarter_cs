import Product from '$data/classes/Product';

export default class ChangeRequestDetail {
	id: number;
	changedProduct: Product;
	changingProduct: Product;
	changingQuantity: number;
	priceChangedProduct: number;
	priceWork: number;
	options: Product[];
	productName: string;
	changingPrice: number;
	totalChangingPrice: number;

	constructor({
		id,
		productName,
		options,
		changingQuantity,
		priceWork,
		changedProduct,
		changingProduct,
		priceChangedProduct,
		changingPrice,
		totalChangingPrice
	}: {
		id: number;
		productName: string;
		changingQuantity: number;
		priceProduct: number;
		priceWork: number;
		changedProduct: {
			id: number;
			color: string;
			size: string;
			priceAdditional: number;
		};
		priceChangedProduct: number;
		changingProduct: {
			id: number;
			color: string;
			size: string;
			priceAdditional: number;
		};
		changingPrice: number;
		totalChangingPrice: number;
		options: {
			id: number;
			color: string;
			size: string;
			priceAdditional: number;
		}[];
	}) {
		this.id = id;
		this.productName = productName;
		this.changingPrice = changingPrice;
		this.changingQuantity = changingQuantity;
		this.priceChangedProduct = priceChangedProduct;
		this.totalChangingPrice = totalChangingPrice;
		this.changedProduct = new Product(changedProduct);
		this.changingProduct = new Product(changingProduct);
		this.options = options.map((o) => new Product(o));
		this.priceWork = priceWork;
	}
}
