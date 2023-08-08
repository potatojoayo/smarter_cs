export default class Product {
	id: number;
	color: string;
	size: string;
	priceAdditional: number;
	draftId?: number;
	studentNames?: string[];
	modelNumber?: string;
	inventoryQuantity?: number;
	state?: string;
	dateCreated?: Date;
	dateUpdated?: Date;

	constructor({
		id,
		size,
		priceAdditional,
		color,
		modelNumber,
		inventoryQuantity,
		state,
		dateCreated,
		dateUpdated
	}: {
		id: number;
		color: string;
		size: string;
		priceAdditional: number;
		modelNumber?: string;
		inventoryQuantity?: number;
		state?: string;
		dateCreated?: Date;
		dateUpdated?: Date;
	}) {
		this.id = id;
		this.color = color;
		this.priceAdditional = priceAdditional;
		this.size = size;
		this.modelNumber = modelNumber;
		this.inventoryQuantity = inventoryQuantity;
		this.state = state;
		this.dateCreated = dateCreated;
		this.dateUpdated = dateUpdated;
	}
}
