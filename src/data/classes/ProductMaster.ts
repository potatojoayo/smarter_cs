import ProductService from '$data/services/ProductService';
import Product from './Product';

export default class ProductMaster {
	id: number;
	name: string;
	priceGym: number;
	needDraft: boolean;

	category?: string;
	subCategory?: string;
	brand?: string;
	state?: string;
	dateCreated?: Date;
	dateUpdated?: Date;
	thumbnail?: string;

	colors?: string[];
	sizes?: string[];
	productNumber?: string;

	deliveryType?: string;
	supplier?: string;
	priceParent?: number;
	priceVendor?: number;
	priceConsumer?: number;
	priceDelivery?: number;
	descriptionImage?: string;
	products?: Product[];
	memo?: string;

	constructor({
		id,
		needDraft,
		name,
		priceGym,
		colors,
		sizes,
		productNumber,
		category,
		subCategory,
		brand,
		state,
		dateCreated,
		dateUpdated,
		thumbnail,
		deliveryType,
		supplier,
		priceParent,
		priceVendor,
		priceConsumer,
		priceDelivery,
		products,
		memo
	}: ProductMasterConstructor) {
		this.id = id;
		this.name = name;
		this.priceGym = priceGym;
		this.needDraft = needDraft;
		this.category = category?.name;
		this.subCategory = subCategory?.name;
		this.brand = brand?.name;
		this.state = state;
		this.dateCreated = dateCreated;
		this.dateUpdated = dateUpdated;
		this.thumbnail = thumbnail;
		this.colors = colors;
		this.sizes = sizes;
		this.productNumber = productNumber;
		this.deliveryType = deliveryType;
		this.supplier = supplier?.name;
		this.priceParent = priceParent;
		this.priceVendor = priceVendor;
		this.priceConsumer = priceConsumer;
		this.priceDelivery = priceDelivery;
		this.products = products?.map((p) => new Product(p));
		this.memo = memo;
	}

	static async fromId(id: number): Promise<ProductMaster> {
		return await ProductService.productmaster({ id });
	}

	async updateMemo() {
		if (!this.memo) return false;
		return await ProductService.updateMemo({ productMasterId: this.id, memo: this.memo });
	}
}

export interface ProductMasterConstructor {
	id: number;
	name: string;
	priceGym: number;
	needDraft: boolean;
	colors?: string[];
	sizes?: string[];
	productNumber?: string;
	category?: {
		name: string;
	};
	subCategory?: {
		name: string;
	};
	brand?: {
		name: string;
	};
	state?: string;
	dateCreated?: Date;
	dateUpdated?: Date;
	thumbnail?: string;

	deliveryType?: string;
	supplier?: {
		name: string;
	};
	priceParent?: number;
	priceVendor?: number;
	priceConsumer?: number;
	priceDelivery?: number;
	descriptionImage?: string;
	memo?: string;
	products?: {
		id: number;
		color: string;
		size: string;
		priceAdditional: number;
		modelNumber?: string;
		inventoryQuantity?: number;
		state?: string;
		dateCreated?: Date;
		dateUpdated?: Date;
	}[];
}
