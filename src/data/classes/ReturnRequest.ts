import ReturnRequestDetail from './ReturnRequestDetail';

export default class ReturnRequest {
	returnReason: string;
	receiver: string;
	phone: string;
	address: string;
	detailAddress: string;
	zipCode: string;
	totalProductsPrice: number;
	state: string;
	returnProductsName: string;
	returnDetails: ReturnRequestDetail[] = [];
	userId: number;
	currentUserSmarterMoney: number;
	isDeliveryPriceExempt: boolean;
	constructor({
		returnReason,
		receiver,
		phone,
		address,
		detailAddress,
		zipCode,
		totalProductsPrice,
		state,
		returnProductsName,
		returnDetails,
		userId,
		currentUserSmarterMoney,
		isDeliveryPriceExempt
	}: {
		returnReason: string;
		receiver: string;
		phone: string;
		address: string;
		detailAddress: string;
		zipCode: string;
		totalProductsPrice: number;
		state: string;
		returnProductsName: string;
		returnDetails: {
			productMasterName: string;
			priceWork: number;
			color: string;
			size: string;
			returnQuantity: number;
			returnPrice: number;
			orderDetail: {
				priceGym: number;
			};
		}[];
		userId: number;
		currentUserSmarterMoney: number;
		isDeliveryPriceExempt: boolean;
	}) {
		this.returnReason = returnReason;
		this.receiver = receiver;
		this.phone = phone;
		this.address = address;
		this.detailAddress = detailAddress;
		this.zipCode = zipCode;
		this.totalProductsPrice = totalProductsPrice;
		this.state = state;
		this.returnProductsName = returnProductsName;
		this.returnDetails = returnDetails.map((rd) => new ReturnRequestDetail(rd));
		this.userId = userId;
		this.currentUserSmarterMoney = currentUserSmarterMoney;
		this.isDeliveryPriceExempt = isDeliveryPriceExempt;
	}
}
