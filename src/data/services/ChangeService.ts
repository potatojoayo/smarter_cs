import ChangeRequest from '$data/classes/ChangeRequest';
import HttpClient from '$data/graphql/client';
import ChangeRequestQuery from '$data/graphql/queries/ChangeRequestQuery';
import ChangeRequestMutation from '$data/graphql/mutations/ChangeRequestMutation';
import DeliveryAgency from '$data/classes/DeliveryAgency';
import type Delivery from '$data/classes/Delivery';

export default class ChangeService {
	static async getChangeRequests({
		page,
		keyword,
		state,
		start,
		end
	}: {
		page: number;
		keyword: string | null;
		state: string | null;
		start: string | null;
		end: string | null;
	}): Promise<{
		changeRequests: ChangeRequest[];
		totalCount: number;
	}> {
		const client = HttpClient.getInstance();
		const result = (await client.request(ChangeRequestQuery.changeRequests, {
			page,
			keyword,
			state,
			start,
			end
		})) as {
			changeRequests: {
				totalCount: number;
				changeRequests: {
					id: number;
					csRequest?: {
						id: number;
					};
					csRequestNumber?: string;
					orderNumber: string;
					gymName: string;
					changeReason: string;
					changeProductsName: string;
					totalChangingPrice: number;
					state: string;
					dateCreated: Date;
				}[];
			};
		};
		return {
			totalCount: result.changeRequests.totalCount,
			changeRequests: result.changeRequests.changeRequests.map((rr) => new ChangeRequest(rr))
		};
	}

	static async getChangeRequest(variables: { id: number }) {
		const client = HttpClient.getInstance();

		const result = (await client.request(ChangeRequestQuery.ChangeRequestQuery, variables)) as {
			changeRequest: {
				id: number;
				csRequestNumber?: string;
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
				currentSmarterMoney?: number;
				afterSmarterMoney?: number;
				customer: {
					smarterMoney: number;
					user: {
						userId: number;
					};
				};
				changeRequestDetails: {
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
			};
			deliveryAgencies: {
				id: number;
				name: string;
			}[];
		};
		return {
			changeRequest: new ChangeRequest(result.changeRequest),
			smarterMoney: result.changeRequest.customer.smarterMoney,
			userId: result.changeRequest.customer.user.userId,
			deliveryAgencies: result.deliveryAgencies.map((da) => new DeliveryAgency(da))
		};
	}

	static async updateChangeRequest(variables: {
		changeRequestId: number;
		changeRequestDetails?: {
			changingProductId: number;
			changingQuantity: number;
			id: number;
		}[];
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
		changeReason?: string;
		isChangedPriceExempt?: boolean;
		isDeliveryPriceExempt?: boolean;
		deliveryPrice?: number;
		trackingNumber?: string;
		deliveryAgencyId?: number;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(ChangeRequestMutation.UpdateChangeRequest, variables)) as {
			updateChangeRequest: {
				success: boolean;
			};
		};
		return result.updateChangeRequest.success;
	}

	static async completeChangeRequest(variables: {
		changeRequestId: number;
		changeRequestDetails?: {
			changingProductId: number;
			changingQuantity: number;
			id: number;
		}[];
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
		changeReason?: string;
		isChangedPriceExempt?: boolean;
		isDeliveryPriceExempt?: boolean;
		deliveryPrice?: number;
		trackingNumber?: string;
		deliveryAgencyId?: number;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(
			ChangeRequestMutation.CompleteChangeRequest,
			variables
		)) as {
			completeChange: {
				success: boolean;
			};
		};
		return result.completeChange.success;
	}
}
