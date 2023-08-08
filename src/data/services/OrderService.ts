import HttpClient from '$data/graphql/client';
import OrderQuery from '$data/graphql/queries/OrderQuery';
import OrderMaster from '$data/classes/OrderMaster';
import OrderMutations from '$data/graphql/mutations/OrderMutations';
import ChangeRequestMutation from '$data/graphql/mutations/ChangeRequestMutation';
import Delivery from '$data/classes/Delivery';
import DeliveryAgency from '$data/classes/DeliveryAgency';
import Directions from '$data/classes/Directions';

export default class OrderService {
	static async cancelOrder(variables: { csRequestId: number }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(OrderMutations.CsCancelOrder, variables)) as {
			csCancelOrder: {
				success: boolean;
				message: string;
			};
		};

		return {
			success: result.csCancelOrder.success,
			message: result.csCancelOrder.message
		};
	}
	static async getOrderMaster(variables: { id?: number; orderNumber?: string }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(OrderQuery.OrderMaster, variables)) as {
			orderMaster: {
				id: number;
				orderNumber: string;
				dateCreated: Date;
				priceTotal: number;
				smarterMoney: number;
				orderState: string;
				memo: string;
				isPickUp: boolean;
				priceDelivery: number;
				priceToPay: number;
				gymName?: string;
				agencyName?: string;
				orderer?: string;
				phone?: string;
				paymentRequest?: {
					method: string;
				};
				paymentSuccess?: {
					method: string;
					amount: number;
					requestedAt: Date;
				};
				receiver?: string;
				address?: string;
				detailAddress?: string;
				zipCode?: string;
				deliveryRequest?: string;
				details?: {
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
			};
		};
		return new OrderMaster(result.orderMaster);
	}

	static async returnOrders(variables: {
		csRequestId: number;
		orderDetails: { id: number; quantity: number }[];
		returnReason?: string;
		receiver: string;
		phone: string;
		zipCode: string;
		address: string;
		detailAddress: string;
		memo?: string;
	}) {
		const client = HttpClient.getInstance();
		const { createReturnRequest } = (await client.request(
			OrderMutations.CreateReturnRequest,
			variables
		)) as {
			createReturnRequest: {
				success: boolean;
				message: string;
			};
		};
		return {
			success: createReturnRequest.success,
			message: createReturnRequest.message
		};
	}

	static async changeOrders(variables: {
		csRequestId: number;
		orderDetails: {
			orderDetailId: number;
			changingQuantity: number;
			changingProductId: number;
		}[];
		changeReason?: string;
		pickUpReceiver: string;
		pickUpPhone: string;
		pickUpAddress: string;
		pickUpDetailAddress: string;
		pickUpZipCode: string;
		deliveryReceiver: string;
		deliveryPhone: string;
		deliveryAddress: string;
		deliveryDetailAddress: string;
		deliveryZipCode: string;
		memo: string;
	}) {
		const client = HttpClient.getInstance();
		const { createChangeRequest } = (await client.request(
			ChangeRequestMutation.CreateChangeRequest,
			variables
		)) as {
			createChangeRequest: {
				success: boolean;
				message: string;
			};
		};
		return {
			success: createChangeRequest.success,
			message: createChangeRequest.message
		};
	}

	static async partialCancelOrders(variables: { csRequestId: number; orderDetailIds: number[] }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(OrderMutations.CsPartialCancel, variables)) as {
			csPartialCancel: {
				success: boolean;
				message: string;
			};
		};
		return {
			success: result.csPartialCancel.success,
			message: result.csPartialCancel.message
		};
	}

	static async additionalOrder(variables: {
		csRequestId: number;
		orderedProducts: {
			productMasterId: number;
			productId: number;
			quantity: number;
			draftId?: number;
			studentNames?: string[];
			userRequest?: string;
		}[];
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(OrderMutations.AdditionalOrder, variables)) as {
			additionalOrder: {
				success: boolean;
				message: string;
			};
		};

		return {
			success: result.additionalOrder.success,
			message: result.additionalOrder.message
		};
	}

	static async OrderDetailDelivery(variables: { orderDetailId: number }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(OrderQuery.OrderDetailDelivery, variables)) as {
			orderDetailDelivery: {
				deliveryAgency: {
					id: number;
					name: string;
				};
				trackingNumber: string;
				photo?: string;
			};
		};
		return new Delivery({
			deliveryAgency: new DeliveryAgency(result.orderDetailDelivery.deliveryAgency),
			trackingNumber: result.orderDetailDelivery.trackingNumber,
			photo: result.orderDetailDelivery.photo
		});
	}

	static async workById(variables: { workId: number }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(OrderQuery.WorkById, variables)) as {
			workById: {
				memoBySubcontractor: string;
				memoByAdmin: string;
				memoByPreWorker: string;
				details: {
					draft: {
						id: number;
						image: string;
						memo: string;
						font: string;
						priceWork: number;
						printing: string;
						priceWorkLabor: number;
						threadColor: string;
						subCategory: {
							name: string;
						};
					};
					product: {
						name: string;
						color: string;
						size: string;
					};
					productMaster: {
						thumbnail: string;
					};
					quantity: number;
					state: string;
					orderMaster: {
						user: {
							phone: string;
							name: string;
							gym: {
								name: string;
							};
						};
					};
					studentNames: string[];
					userRequest: string;
				}[];
			};
		};
		return {
			details: result.workById.details.map((d) => new Directions(d)),
			memoBySubcontractor: result.workById.memoBySubcontractor,
			memoByAdmin: result.workById.memoByAdmin,
			memoByPreWorker: result.workById.memoByPreWorker
		};
	}

	static async wrongDelivery(variables: { orderMasterId: number; orderDetailIds: number[] }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(OrderMutations.WrongDelivery, variables)) as {
			wrongDelivery: {
				success: boolean;
				message: string;
			};
		};
		return {
			success: result.wrongDelivery.success,
			message: result.wrongDelivery.message
		};
	}

	static async changeStudentName(variables: {
		orderDetailId: number;
		changedName: string;
		changingName: string;
	}) {
		const client = HttpClient.getInstance();
		const {
			changeStudentName: { success, message }
		} = (await client.request(OrderMutations.ChangeStudentName, variables)) as {
			changeStudentName: {
				success: boolean;
				message: string;
			};
		};
		return {
			success,
			message
		};
	}

	static async cancelStudentName(variables: { orderDetailId: number; studentName: string }) {
		const client = HttpClient.getInstance();
		const {
			cancelStudent: { success, message }
		} = (await client.request(OrderMutations.CancelStudent, variables)) as {
			cancelStudent: {
				success: boolean;
				message: string;
			};
		};
		return {
			success,
			message
		};
	}
}
