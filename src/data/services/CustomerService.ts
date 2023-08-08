import HttpClient from '$data/graphql/client';
import CustomerQuery from '$data/graphql/queries/CustomerQuery';
import Customer from '$data/classes/Customer';
import CsRequest from '$data/classes/CsRequest';
import OrderMaster from '$data/classes/OrderMaster';
import SmarterMoneyTransaction from '$data/classes/SmarterMoneyTransaction';
import DeliveryAddress from '$data/classes/DeliveryAddress';
import Draft from '$data/classes/Draft';
import CustomerMutation from '$data/graphql/mutations/CustomerMutation';

export default class CustomerService {
	static async getCustomers(variables?: {
		keyword?: string;
		totalPurchasedAmount?: number;
		prevMonthPurchasedAmount?: number;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CustomerQuery.Customers, variables)) as {
			customers: {
				id: number;
				user: {
					phone: string;
					name: string;
				};
				name: string;
			}[];
		};
		return result.customers.map((c) => new Customer(c));
	}

	static async getCustomersWithTotalCount(variables?: {
		page: number;
		totalPurchasedAmount?: number;
		prevMonthPurchasedAmount?: number;
		addressZipCodeId?: number;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CustomerQuery.CustomersWithTotalCount, variables)) as {
			customersWithTotalCount: {
				customers: {
					id: number;
					user: {
						phone: string;
						name: string;
					};
					name: string;
				}[];
				totalCount: number;
			};
		};
		return {
			customers: result.customersWithTotalCount.customers.map((c) => new Customer(c)),
			totalCount: result.customersWithTotalCount.totalCount
		};
	}

	static async getCustomer(variables: { id: number; csRequestPage: number }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CustomerQuery.Customer, variables)) as {
			customer: {
				id: number;
				smarterMoney: number;
				user: {
					userId: number;
					identification: string;
					phone: string;
					name: string;
					wallet: {
						balance: number;
					};
					refundAccountBank?: string;
					refundAccountNo?: string;
					refundAccountOwner?: string;
				};
				name: string;
				address: string;
				detailAddress?: string;
				zipCode?: string;
				agency: {
					name: string;
				};
				businessRegistrationNumber: string;
				businessRegistrationCertificate: URL;
				memo: string;
				csRequests: {
					csRequests: {
						id: number;
						gymId: number;
						requestNumber: string;
						dateRequested: Date;
						gymName?: string;
						category: string;
						reason: string;
						csState: string;
						dateCompleted?: Date;
						orderState: string;
						memo: string;
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
						coupon: {
							couponNumber: string;
							couponName: string;
							price: number;
						};
						priceDelivery: number;
						priceToPay: number;
					}[];
					totalCount: number;
				};

				smarterMoneyHistories?: {
					smarterMoneyHistories: {
						dateCreated: Date;
						transactionType: string;
						description: string;
						amount: number;
						orderNumber?: string;
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
						image: string;
					}[];
					totalCount: number;
				};
			};
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
				coupon?: {
					couponNumber: string;
					couponName: string;
					price: number;
				};
			};
		};

		return {
			customer: new Customer(result.customer),
			csRequests: result.customer.csRequests.csRequests.map((c) => new CsRequest(c)),
			csRequestTotalCount: result.customer.csRequests.totalCount,
			orderMasters: result.customer.orderMasters?.orderMasters.map((o) => new OrderMaster(o)),
			orderMasterTotalCount: result.customer.orderMasters?.totalCount,
			smarterMoneyTransactions: result.customer.smarterMoneyHistories?.smarterMoneyHistories.map(
				(smh) => new SmarterMoneyTransaction(smh)
			),
			smarterMoneyTransactionTotalCount: result.customer.smarterMoneyHistories?.totalCount,
			deliveryAddresses: result.customer.addresses?.addresses.map((a) => new DeliveryAddress(a)),
			deliveryAddressTotalCount: result.customer.addresses?.totalCount,
			drafts: result.customer.drafts?.drafts.map((d) => new Draft(d)),
			draftTotalCount: result.customer.drafts?.totalCount,
			orderMaster: result.orderMaster ? new OrderMaster(result.orderMaster) : undefined
		};
	}

	static async setPassword(variables: { id: number; password: string; confirmPassword: string }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CustomerMutation.SetPassword, variables)) as {
			setPassword: {
				success: boolean;
			};
		};
		return result.setPassword.success;
	}

	static async updateUserInfo(variables: {
		id: number;
		gymName?: string;
		userName?: string;
		phone?: string;
		agencyName?: string;
		memo?: string;
		address?: string;
		detailAddress?: string;
		zipCode?: string;
		refundAccountBank?: string;
		refundAccountNo?: string;
		refundAccountOwner?: string;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CustomerMutation.UpdateUserInfo, variables)) as {
			updateUserInfo: {
				success: boolean;
			};
		};
		return result.updateUserInfo.success;
	}

	static async updateAddress(variables: {
		page: number;
		id: number;
		name: string;
		receiver: string;
		address: string;
		detailAddress: string;
		isDefault: boolean;
		phone: string;
		zipCode: string;
		deliveryMemo?: string;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CustomerMutation.UpdateAddress, variables)) as {
			updateAddress: {
				success: boolean;
				addresses?: {
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
			};
		};
		return {
			success: result.updateAddress.success,
			addresses: result.updateAddress.addresses?.map((a) => new DeliveryAddress(a))
		};
	}

	static async createAddress(variables: {
		gymId: number;
		name: string;
		receiver: string;
		address: string;
		detailAddress: string;
		isDefault: boolean;
		phone: string;
		zipCode: string;
		deliveryMemo?: string;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CustomerMutation.CreateAddress, variables)) as {
			createAddress: {
				success: boolean;
			};
		};
		return {
			success: result.createAddress.success
		};
	}

	static async chargeSmarterMoney(variables: {
		userId: number;
		amount: number;
		description?: string;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CustomerMutation.CsChargeSmarterMoney, variables)) as {
			csChargeSmarterMoney: {
				success: boolean;
			};
		};
		return result.csChargeSmarterMoney.success;
	}

	static async subtractSmarterMoney(variables: {
		userId: number;
		amount: number;
		description?: string;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CustomerMutation.CsSubtractSmarterMoney, variables)) as {
			csSubtractSmarterMoney: {
				success: boolean;
			};
		};
		return result.csSubtractSmarterMoney.success;
	}

	static async deleteAddress(variables: { addressId: number }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CustomerMutation.DeleteAddress, variables)) as {
			deleteAddress: {
				success: boolean;
			};
		};
		return result.deleteAddress.success;
	}
}
