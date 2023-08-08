import TaOrderService from '$data/services/TaOrderService';
import TaOrderDetail from './TaOrderDetail';

export default class TaOrderMaster {
	id: number;
	orderNumber: string;
	dateOrdered: Date;
	gymName: string;
	totalPriceGym: number;
	totalPriceSpecial: number;
	pricePaid: number;
	priceDelivery: number;
	priceToBePaid: number;
	state: string;
	taName?: string;
	ordererName?: string;
	phone?: string;
	address?: string;
	detailAddress?: string;
	zipCode?: string;
	receiver?: string;
	isPickUp?: boolean;
	taOrderDetails: TaOrderDetail[] = [];

	constructor({
		id,
		orderNumber,
		dateOrdered,
		gymName,
		totalPriceGym,
		totalPriceSpecial,
		pricePaid,
		priceDelivery,
		priceToBePaid,
		state,
		taName,
		ordererName,
		phone,
		address,
		detailAddress,
		zipCode,
		receiver,
		isPickUp,
		taOrderDetails
	}: {
		id: number;
		orderNumber: string;
		dateOrdered: Date;
		gymName: string;
		totalPriceGym: number;
		totalPriceSpecial: number;
		pricePaid: number;
		priceDelivery: number;
		priceToBePaid: number;
		state: string;
		taName?: string;
		ordererName?: string;
		phone?: string;
		address?: string;
		detailAddress?: string;
		zipCode?: string;
		receiver?: string;
		isPickUp?: boolean;
		taOrderDetails?: Required<TaOrderDetail>[];
	}) {
		this.id = id;
		this.orderNumber = orderNumber;
		this.state = state;
		this.dateOrdered = dateOrdered;
		this.gymName = gymName;
		this.totalPriceGym = totalPriceGym;
		this.totalPriceSpecial = totalPriceSpecial;
		this.pricePaid = pricePaid;
		this.priceDelivery = priceDelivery;
		this.priceToBePaid = priceToBePaid;
		this.taName = taName;
		this.ordererName = ordererName;
		this.phone = phone;
		this.address = address;
		this.detailAddress = detailAddress;
		this.zipCode = zipCode;
		this.receiver = receiver;
		this.isPickUp = isPickUp;
		this.taOrderDetails = taOrderDetails?.map((t) => new TaOrderDetail(t)) ?? [];
	}

	async update() {
		return await TaOrderService.updateTaOrder({
			id: this.id,
			details: this.taOrderDetails.map((d) => {
				return { id: d.id, priceSpecial: d.priceSpecial };
			}),
			priceDelivery: this.priceDelivery,
			pricePaid: this.pricePaid
		});
	}
}
