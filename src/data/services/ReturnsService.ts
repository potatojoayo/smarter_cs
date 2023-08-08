import ReturnRequest from '$data/classes/ReturnRequest';
import ReturnRequests from '$data/classes/ReturnRequests';
import HttpClient from '$data/graphql/client';
import ReturnRequestMutation from '$data/graphql/mutations/ReturnRequestMutation';
import ReturnsQuery from '$data/graphql/queries/ReturnsQuery';

export default class ReturnsService {
	static async getReturnsRequests({
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
	}): Promise<{ returnRequests: ReturnRequests[]; totalCount: number }> {
		const client = HttpClient.getInstance();
		const result = (await client.request(ReturnsQuery.returnsRequests, {
			page,
			keyword,
			state,
			start,
			end
		})) as {
			returnRequests: {
				totalCount: number;
				returnRequests: {
					id: number;
					csRequest?: {
						id: number;
					};
					csRequestNumber?: string;
					orderNumber: string;
					gymName: string;
					returnReason: string;
					returnProductsName: string;
					totalReturnPrice: number;
					totalProductsPrice: number;
					state: string;
					dateCreated: Date;
				}[];
			};
		};

		return {
			totalCount: result.returnRequests.totalCount,
			returnRequests: result.returnRequests.returnRequests.map((rr) => new ReturnRequests(rr))
		};
	}
	static async getReturnRequest({ returnId }: { returnId: number }): Promise<ReturnRequest> {
		const client = HttpClient.getInstance();
		const result = (await client.request(ReturnsQuery.returnRequest, {
			returnId
		})) as {
			returnRequest: {
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
					id: number;
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
			};
		};
		return new ReturnRequest(result.returnRequest);
	}
	static async updateReturn(variables: {
		returnId: number;
		address: string;
		detailAddress: string;
		deliveryPrice: number;
		isDeliveryPriceExempt: boolean;
		memo: string;
		phone: string;
		receiver: string;
		returnDetails: {
			id: number;
			returnQuantity: number;
		}[];
		returnReason: string;
		zipCode: string;
	}) {
		const client = HttpClient.getInstance();
		const { updateReturn } = (await client.request(
			ReturnRequestMutation.UpdateReturn,
			variables
		)) as {
			updateReturn: {
				success: boolean;
				message: string;
			};
		};
		return { success: updateReturn.success, message: updateReturn.message };
	}
	static async completeReturn(variables: {
		returnId: number;
		address: string;
		detailAddress: string;
		deliveryPrice: number;
		isDeliveryPriceExempt: boolean;
		memo: string;
		phone: string;
		receiver: string;
		returnDetails: {
			id: number;
			returnQuantity: number;
		}[];
		returnReason: string;
		zipCode: string;
	}) {
		const client = HttpClient.getInstance();
		const { completeReturn } = (await client.request(
			ReturnRequestMutation.CompleteReturn,
			variables
		)) as {
			completeReturn: {
				success: boolean;
				message: string;
			};
		};
		return { success: completeReturn.success, message: completeReturn.message };
	}
}
