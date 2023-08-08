import ChangeRequestDetail from '$data/classes/ChangeRequestDetail';
import ChangeService from '$data/services/ChangeService';
import type Delivery from './Delivery';

export default class ChangeRequest {
	id: number;
	csRequestNumber: string;
	csRequestId?: number;
	orderNumber: string;
	gymName: string;
	changeReason: string;
	changeProductsName: string;
	totalChangingPrice: number;
	state: string;
	dateCreated: Date;
	pickUpReceiver?: string;
	pickUpZipCode?: string;
	pickUpDetailAddress?: string;
	pickUpAddress?: string;
	pickUpPhone?: string;
	deliveryAddress?: string;
	deliveryDetailAddress?: string;
	deliveryPhone?: string;
	deliveryReceiver?: string;
	deliveryZipCode?: string;
	memo?: string;
	isChangedPriceExempt?: boolean;
	isDeliveryPriceExempt?: boolean;
	deliveryPrice?: number;
	priceToPay?: number;
	changeRequestDetails?: ChangeRequestDetail[];
	delivery?: Delivery;
	currentSmarterMoney?: number;
	afterSmarterMoney?: number;

	constructor({
		id,
		csRequestNumber,
		csRequest,
		orderNumber,
		gymName,
		changeReason,
		changeProductsName,
		totalChangingPrice,
		state,
		dateCreated,
		deliveryPrice,
		isDeliveryPriceExempt,
		deliveryAddress,
		deliveryDetailAddress,
		deliveryReceiver,
		isChangedPriceExempt,
		deliveryPhone,
		deliveryZipCode,
		pickUpDetailAddress,
		pickUpAddress,
		pickUpReceiver,
		pickUpZipCode,
		pickUpPhone,
		priceToPay,
		memo,
		changeDetails,
		delivery,
		currentSmarterMoney,
		afterSmarterMoney
	}: {
		id: number;
		csRequestNumber: string;
		csRequest?: {
			id: number;
		};
		orderNumber: string;
		gymName: string;
		changeReason: string;
		changeProductsName: string;
		totalChangingPrice: number;
		state: string;
		dateCreated: Date;
		delivery?: Delivery;

		pickUpReceiver?: string;
		pickUpZipCode?: string;
		pickUpDetailAddress?: string;
		currentSmarterMoney?: number;
		afterSmarterMoney?: number;
		pickUpAddress?: string;
		pickUpPhone?: string;
		deliveryAddress?: string;
		deliveryDetailAddress?: string;
		deliveryPhone?: string;
		deliveryReceiver?: string;
		deliveryZipCode?: string;
		memo?: string;
		isChangedPriceExempt?: boolean;
		isDeliveryPriceExempt?: boolean;
		deliveryPrice?: number;
		priceToPay?: number;
		changeDetails?: {
			id: number;
			priceWork: number;
			productName: string;
			changingQuantity: number;
			priceProduct: number;
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
		}[];
	}) {
		this.id = id;
		if(csRequestNumber){
			this.csRequestNumber = csRequestNumber;
		}
		this.orderNumber = orderNumber;
		this.gymName = gymName;
		this.changeReason = changeReason;
		this.changeProductsName = changeProductsName;
		this.totalChangingPrice = totalChangingPrice;
		this.state = state;
		this.dateCreated = dateCreated;
		if (csRequest){
			this.csRequestId = csRequest.id;
		}
		// this.csRequestId = csRequest.id;
		this.pickUpReceiver = pickUpReceiver;
		this.pickUpZipCode = pickUpZipCode;
		this.pickUpDetailAddress = pickUpDetailAddress;
		this.pickUpAddress = pickUpAddress;
		this.pickUpPhone = pickUpPhone;
		this.deliveryAddress = deliveryAddress;
		this.deliveryDetailAddress = deliveryDetailAddress;
		this.deliveryPhone = deliveryPhone;
		this.deliveryReceiver = deliveryReceiver;
		this.deliveryZipCode = deliveryZipCode;
		this.memo = memo;
		this.delivery = delivery;
		this.isChangedPriceExempt = isChangedPriceExempt;
		this.isDeliveryPriceExempt = isDeliveryPriceExempt;
		this.deliveryPrice = deliveryPrice;
		this.currentSmarterMoney = currentSmarterMoney;
		this.afterSmarterMoney = afterSmarterMoney;
		this.priceToPay = priceToPay;
		if (changeDetails)
			this.changeRequestDetails = changeDetails.map((crd) => new ChangeRequestDetail(crd));
	}

	async update({
		trackingNumber,
		deliveryAgencyId
	}: {
		trackingNumber?: string;
		deliveryAgencyId?: number;
	}) {
		return await ChangeService.updateChangeRequest({
			changeReason: this.changeReason,
			changeRequestDetails: this.changeRequestDetails
				? this.changeRequestDetails.map((d) => {
						return {
							id: d.id,
							changingQuantity: d.changingQuantity,
							changingProductId: d.changingProduct.id
						};
				  })
				: [],
			deliveryAddress: this.deliveryAddress,
			deliveryDetailAddress: this.deliveryDetailAddress,
			deliveryPhone: this.deliveryPhone,
			deliveryPrice: this.deliveryPrice,
			deliveryReceiver: this.deliveryReceiver,
			deliveryZipCode: this.deliveryZipCode,
			isChangedPriceExempt: this.isChangedPriceExempt,
			isDeliveryPriceExempt: this.isDeliveryPriceExempt,
			memo: this.memo,
			pickUpAddress: this.pickUpAddress,
			pickUpDetailAddress: this.pickUpDetailAddress,
			pickUpPhone: this.pickUpPhone,
			pickUpReceiver: this.pickUpReceiver,
			pickUpZipCode: this.pickUpZipCode,
			changeRequestId: this.id,
			deliveryAgencyId,
			trackingNumber
		});
	}

	async complete({
		trackingNumber,
		deliveryAgencyId
	}: {
		trackingNumber?: string;
		deliveryAgencyId?: number;
	}) {
		return await ChangeService.completeChangeRequest({
			changeReason: this.changeReason,
			changeRequestDetails: this.changeRequestDetails
				? this.changeRequestDetails.map((d) => {
						return {
							id: d.id,
							changingQuantity: d.changingQuantity,
							changingProductId: d.changingProduct.id
						};
				  })
				: [],
			deliveryAddress: this.deliveryAddress,
			deliveryDetailAddress: this.deliveryDetailAddress,
			deliveryPhone: this.deliveryPhone,
			deliveryPrice: this.deliveryPrice,
			deliveryReceiver: this.deliveryReceiver,
			deliveryZipCode: this.deliveryZipCode,
			isChangedPriceExempt: this.isChangedPriceExempt,
			isDeliveryPriceExempt: this.isDeliveryPriceExempt,
			memo: this.memo,
			pickUpAddress: this.pickUpAddress,
			pickUpDetailAddress: this.pickUpDetailAddress,
			pickUpPhone: this.pickUpPhone,
			pickUpReceiver: this.pickUpReceiver,
			pickUpZipCode: this.pickUpZipCode,

			changeRequestId: this.id,
			deliveryAgencyId,
			trackingNumber
		});
	}
}
