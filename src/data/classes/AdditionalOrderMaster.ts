import OrderDetail from '$data/classes/OrderDetail';

export default class AdditionalOrderMaster {
	id: number;
	orderNumber: string;
	dateCreated: Date;
	details: OrderDetail[];
	paymentMethod?: string = '-';
	priceTotal: number;
	priceToPay: number;
	paidAmount?: number = 0;
	datePaid?: Date;

	constructor(orderMaster: {
		id: number;
		orderNumber: string;
		dateCreated: Date;
		priceTotal: number;
		priceToPay: number;
		paymentRequest?: {
			method: string;
		};
		paymentSuccess?: {
			method: string;
			amount: number;
			requestedAt: Date;
		};
		details: {
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
				id: number;
			};
			priceTotal: number;
			state: string;
		}[];
	}) {
		this.id = orderMaster.id;
		this.orderNumber = orderMaster.orderNumber;
		this.dateCreated = orderMaster.dateCreated;
		this.priceTotal = orderMaster.priceTotal;
		this.details = orderMaster.details.map((d) => new OrderDetail(d));
		this.priceToPay = orderMaster.priceToPay;
		if (orderMaster.paymentSuccess) {
			this.paymentMethod = orderMaster.paymentSuccess.method;
			this.paidAmount = orderMaster.paymentSuccess.amount;
			this.datePaid = orderMaster.paymentSuccess.requestedAt;
		} else {
			this.paymentMethod = orderMaster.paymentRequest?.method ?? '-';
		}
	}
}
