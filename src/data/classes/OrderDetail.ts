import OrderService from '$data/services/OrderService';
import type Delivery from './Delivery';

export default class OrderDetail {
	id: number;
	productName: string;
	color: string;
	size: string;
	priceProduct: number;
	quantity: number;
	priceWork: number;
	priceWorkLabor: number;
	studentNames?: string[];
	priceTotal: number;
	state: string;
	draftId?: number;
	workId?: number;
	checked = false;
	otherOptions?: { color: string; size: string; productId: number; priceProduct: number }[];
	changingOption?: { color: string; size: string; productId: number; priceProduct: number };
	delivery?: Delivery;

	constructor({
		id,
		product,
		productMaster,
		studentNames,
		priceTotal,
		state,
		work,
		quantity,
		draft
	}: {
		id: number;
		productMaster: {
			priceGym: number;
		};
		product: {
			name: string;
			color: string;
			size: string;
			priceAdditional: number;
		};
		quantity: number;
		draft?: {
			id: number;
			priceWork: number;
			priceWorkLabor: number;
		};
		work?: {
			workId: number;
		};
		priceTotal: number;
		studentNames?: string[];
		state: string;
	}) {
		this.id = id;
		this.productName = product.name;
		this.color = product.color;
		this.size = product.size;
		this.priceProduct = productMaster.priceGym + product.priceAdditional;
		this.quantity = quantity;
		this.priceWork = draft ? draft.priceWork : 0;
		this.priceWorkLabor = draft ? draft.priceWorkLabor : 0;
		this.priceTotal = priceTotal;
		this.state = state;
		this.draftId = draft?.id;
		this.workId = work?.workId;
		this.studentNames = studentNames;
	}

	async getDelivery() {
		this.delivery = await OrderService.OrderDetailDelivery({ orderDetailId: this.id });
	}

	hasStudentNames(): boolean {
		return this.studentNames !== undefined && this.studentNames.length > 0;
	}

	async changeStudentName({
		changedName,
		changingName
	}: {
		changedName: string;
		changingName: string;
	}) {
		return await OrderService.changeStudentName({
			orderDetailId: this.id,
			changedName,
			changingName
		});
	}

	async cancelStudent({ studentName }: { studentName: string }) {
		return await OrderService.cancelStudentName({
			orderDetailId: this.id,
			studentName
		});
	}
}
