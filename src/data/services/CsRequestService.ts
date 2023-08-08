import HttpClient from '$data/graphql/client';
import CsRequestQuery from '$data/graphql/queries/CsRequestQuery';
import CsRequest from '$data/classes/CsRequest';
import type { CsRequestContents, CsRequestMemo } from '$data/classes/CsRequest';
import CsRequestMutation from '$data/graphql/mutations/CsRequestMutation';
import Customer from '$data/classes/Customer';
import DeliveryAddress from '$data/classes/DeliveryAddress';
import SmarterMoneyTransaction from '$data/classes/SmarterMoneyTransaction';
import Draft from '$data/classes/Draft';
import OrderMaster from '$data/classes/OrderMaster';
import ParentCategory from '$data/classes/Category';

export default class CsRequestService {
	static async getRequest(variables: {
		id: number;
		getDeliveryAddresses: boolean;
		getSmarterMoneyTransactions: boolean;
		getDrafts: boolean;
		getOrderMaster: boolean;
		deliveryAddressPage?: number;
		smarterMoneyPage?: number;
		draftPage?: number;
		orderMasterPage?: number;
		getCategories: boolean;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CsRequestQuery.CsRequestDetail, variables)) as {
			csRequest: {
				id: number;
				gymId: number;
				requestNumber: string;
				dateRequested: Date;
				orderNumber?: string;
				gymName: string;
				category: string;
				reason: string;
				csState: string;
				dateCompleted?: Date;
				orderState?: string;
				memo: string;
				requestContents: CsRequestContents[];

				orderMasterId?: number;

				orderMaster?: {
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
					details: {
						id: number;
						studentNames?: string[];
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
				gym: {
					id: number;
					user: {
						userId: number;
						identification: string;
						name: string;
						phone: string;
						refundAccountBank?: string;
						refundAccountNo?: string;
						refundAccountOwner?: string;
					};
					name: string;
					agency?: {
						name: string;
					};
					address: string;
					detailAddress: string;
					zipCode: string;
					memo?: string;
					smarterMoney?: number;
					businessRegistrationNumber?: string;
					businessRegistrationCertificate?: URL;

					smarterMoneyHistories?: {
						smarterMoneyHistories: {
							id: number;
							dateCreated: Date;
							transactionType: string;
							description: string;
							amount: number;
							orderNumber: string;
						}[];
						totalCount: number;
					};

					addresses?: {
						addresses: {
							id: number;
							name: string;
							receiver: string;
							address: string;
							detailAddress: string;
							isDefault: boolean;
							phone: string;
							zipCode: string;
							deliveryMemo?: string;
						}[];
						totalCount: number;
					};

					orderMasters?: {
						orderMasters: {
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
						}[];
						totalCount: number;
					};

					drafts?: {
						drafts: {
							id: number;
							categoryName: string;
							subCategoryName: string;
							priceWork: number;
							priceWorkLabor: number;
							printing?: string;
							font?: string;
							threadColor?: string;
							dateCreated: Date;
							memo?: string;
							image: URL;
						}[];
						totalCount: number;
					};
				};
			};
			agencies: {
				edges: {
					node: {
						name: string;
					};
				}[];
			};

			orderMaster?: {
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
			};

			categories?: {
				name: string;
				children: { name: string }[];
			}[];
		};
		const csRequest = new CsRequest(result.csRequest),
			customer = new Customer(result.csRequest.gym),
			deliveryAddresses = result.csRequest.gym.addresses?.addresses.map(
				(a) => new DeliveryAddress(a)
			),
			deliveryAddressTotalCount = result.csRequest.gym.addresses?.totalCount,
			agencies = result.agencies.edges.map((e) => e.node.name).sort(),
			smarterMoneyTransactions =
				result.csRequest.gym.smarterMoneyHistories?.smarterMoneyHistories.map(
					(s) => new SmarterMoneyTransaction(s)
				),
			smarterMoneyTransactionTotalCount = result.csRequest.gym.smarterMoneyHistories?.totalCount,
			drafts = result.csRequest.gym.drafts?.drafts.map((d) => new Draft(d)),
			draftTotalCount = result.csRequest.gym.drafts?.totalCount,
			orderMasters = result.csRequest.gym.orderMasters?.orderMasters.map(
				(om) => new OrderMaster(om)
			),
			orderMasterTotalCount = result.csRequest.gym.orderMasters?.totalCount,
			orderMaster = result.csRequest.orderMaster
				? new OrderMaster(result.csRequest.orderMaster)
				: result.orderMaster
				? new OrderMaster(result.orderMaster)
				: undefined,
			categories = result.categories?.map((c) => new ParentCategory(c));

		return {
			csRequest,
			customer,
			deliveryAddresses,
			deliveryAddressTotalCount,
			agencies,
			smarterMoneyTransactions,
			smarterMoneyTransactionTotalCount,
			drafts,
			draftTotalCount,
			orderMasters,
			orderMasterTotalCount,
			orderMaster,
			categories
		};
	}

	static async getRequests(variables: {
		keyword?: string | null;
		category?: string;
		csState?: string;
		start?: string | null;
		end?: string | null;
		page: string;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CsRequestQuery.CsRequests, variables)) as {
			csRequests: {
				totalCount: number;
				csRequests: {
					id: number;
					gymId: number;
					requestNumber: string;
					dateRequested: Date;
					gymName: string;
					category: string;
					reason: string;
					csState: string;
					dateCompleted?: Date;
					orderState: string;
					requestMemos: {
						id: number;
						contents: string;
						dateCreated: Date;
					}[];
				}[];
			};
		};
		const { totalCount, csRequests } = result.csRequests;
		const requests: CsRequest[] = [];
		csRequests.forEach(function (csRequest) {
			requests.push(new CsRequest(csRequest));
		});
		return {
			totalCount,
			csRequests: requests
		};
	}

	static async createCsRequest(variables: {
		orderMasterId?: number;
		gymId: number;
		category: string;
		reason?: string;
		contents?: string;
		memo?: string;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CsRequestMutation.CreateCsRequest, variables)) as {
			createCsRequest: {
				success: boolean;
				csRequestId?: number;
			};
		};
		return {
			success: result.createCsRequest.success,
			csRequestId: result.createCsRequest.csRequestId
		};
	}

	static async updateCsRequest(variables: {
		id: number;
		category?: string;
		reason?: string;
		memo?: string;
		csState?: string;
		orderMasterId?: number;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CsRequestMutation.UpdateCsRequest, variables)) as {
			updateCsRequest: {
				success: boolean;
			};
		};
		return result.updateCsRequest.success;
	}

	static async deleteCsRequestContents(variables: { id: number }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CsRequestMutation.DeleteCsRequestContents, variables)) as {
			deleteCsRequestContents: {
				success: boolean;
				csRequestContents: CsRequestContents[];
			};
		};
		return {
			success: result.deleteCsRequestContents.success,
			csRequestContents: result.deleteCsRequestContents.csRequestContents
		};
	}

	static async createCsRequestContents(variables: { id: number; contents: string }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CsRequestMutation.CreateCsRequestContents, variables)) as {
			createCsRequestContents: {
				success: boolean;
				csRequestContents: CsRequestContents[];
			};
		};
		return {
			success: result.createCsRequestContents.success,
			csRequestContents: result.createCsRequestContents.csRequestContents
		};
	}

	static async updateCsRequestContents(variables: { contentId: number; contents: string }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CsRequestMutation.UpdateCsRequestContents, variables)) as {
			updateCsRequestContents: {
				success: boolean;
				csRequestContents: CsRequestContents;
			};
		};
		return {
			success: result.updateCsRequestContents.success,
			csRequestContents: result.updateCsRequestContents.csRequestContents
		};
	}

	static async UpdateContentReply(variables: { replyId: number; contents: string }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CsRequestMutation.UpdateContentReply, variables)) as {
			updateContentReply: {
				success: boolean;
				reply: CsRequestContents;
			};
		};
		return {
			success: result.updateContentReply.success,
			reply: result.updateContentReply.reply
		};
	}

	// static async deleteCsRequestMemo(variables: { id: number }) {
	// 	const client = HttpClient.getInstance();
	// 	const result = (await client.request(CsRequestMutation.DeleteCsRequestMemo, variables)) as {
	// 		deleteCsRequestMemo: {
	// 			success: boolean;
	// 			csRequestMemos: CsRequestMemo[];
	// 		};
	// 	};
	// 	return {
	// 		success: result.deleteCsRequestMemo.success,
	// 		csRequestMemos: result.deleteCsRequestMemo.csRequestMemos
	// 	};
	// }

	// static async createCsRequestMemo(variables: { id: number; memo: string }) {
	// 	const client = HttpClient.getInstance();
	// 	const result = (await client.request(CsRequestMutation.CreateCsRequestMemo, variables)) as {
	// 		createCsRequestMemo: {
	// 			success: boolean;
	// 			csRequestMemos: CsRequestMemo[];
	// 		};
	// 	};
	// 	return {
	// 		success: result.createCsRequestMemo.success,
	// 		csRequestMemos: result.createCsRequestMemo.csRequestMemos
	// 	};
	// }

	static async createCsRequestReply(variables: { parentId: number; contents: string }) {
		const client = HttpClient.getInstance();
		const {
			createContentReply: { success, reply }
		} = (await client.request(CsRequestMutation.CreateContentReply, variables)) as {
			createContentReply: {
				success: boolean;
				reply: CsRequestContents;
			};
		};
		return { success, reply };
	}

	static async deleteCsRequestReply(variables: { contentId: number }) {
		const client = HttpClient.getInstance();
		const {
			deleteContentReply: { success }
		} = (await client.request(CsRequestMutation.DeleteContentReply, variables)) as {
			deleteContentReply: {
				success: boolean;
			};
		};

		return success;
	}
}
