import CustomerService from '$data/services/CustomerService';
import type CsRequest from '$data/classes/CsRequest';
import type OrderMaster from '$data/classes/OrderMaster';
import type SmarterMoneyTransaction from '$data/classes/SmarterMoneyTransaction';
import type DeliveryAddress from '$data/classes/DeliveryAddress';
import type Draft from '$data/classes/Draft';

export default class Customer {
	userId?: number;
	gymId: number;
	identification?: string;
	userName: string;
	gymName: string;
	phone: string;
	address?: string;
	detailAddress?: string;
	zipCode?: string;
	agencyName?: string;
	smarterMoney?: number;
	businessRegistrationNumber?: string;
	businessRegistrationCertificate?: URL;
	memo?: string;
	refundAccountBank?: string;
	refundAccountNo?: string;
	refundAccountOwner?: string;
	totalPurchasedAmount?: number;
	prevMonthPurchasedAmount?: number;

	static async fromId(variables: {
		id: number;
		csRequestPage: number;
		getOrderMasters: boolean;
		orderMasterPage: number | null;
		getSmarterMoneyTransactions: boolean;
		smarterMoneyPage: number | null;
		getAddresses: boolean;
		addressPage: number | null;
		getDrafts: boolean;
		draftPage: number | null;
		orderMasterId: string | null;
		getOrderMaster: boolean;
	}): Promise<{
		customer: Customer;
		csRequests: CsRequest[];
		csRequestTotalCount: number;
		orderMasters?: OrderMaster[];
		orderMasterTotalCount?: number;
		smarterMoneyTransactions?: SmarterMoneyTransaction[];
		smarterMoneyTransactionTotalCount?: number;
		deliveryAddresses?: DeliveryAddress[];
		deliveryAddressTotalCount?: number;
		drafts?: Draft[];
		draftTotalCount?: number;
		orderMaster?: OrderMaster;
	}> {
		return await CustomerService.getCustomer(variables);
	}

	constructor({
		id,
		user,
		name,
		address,
		detailAddress,
		agency,
		businessRegistrationNumber,
		businessRegistrationCertificate,
		memo,
		smarterMoney,
		zipCode,
		totalPurchasedAmount,
		prevMonthPurchasedAmount
	}: {
		id: number;
		smarterMoney?: number;
		user: {
			userId?: number;
			identification?: string;
			phone: string;
			name: string;
			refundAccountBank?: string;
			refundAccountNo?: string;
			refundAccountOwner?: string;
			wallet?: {
				balance: number;
			};
		};
		name: string;
		address?: string;
		detailAddress?: string;
		zipCode?: string;
		agency?: {
			name: string;
		};
		businessRegistrationNumber?: string;
		businessRegistrationCertificate?: URL;
		memo?: string;
		totalPurchasedAmount?: number;
		prevMonthPurchasedAmount?: number;
	}) {
		this.gymId = +id;
		this.userId = user.userId;
		this.identification = user.identification;
		this.smarterMoney = smarterMoney;
		this.userName = user.name;
		this.address = address;
		this.smarterMoney = smarterMoney;
		this.detailAddress = detailAddress;
		this.refundAccountBank = user.refundAccountBank;
		this.refundAccountNo = user.refundAccountNo;
		this.refundAccountOwner = user.refundAccountOwner;
		this.zipCode = zipCode;
		this.phone = user.phone;
		if (agency) {
			this.agencyName = agency.name;
		}
		if (user.wallet) this.smarterMoney = +user.wallet.balance;
		this.businessRegistrationNumber = businessRegistrationNumber;

		this.businessRegistrationCertificate = businessRegistrationCertificate;
		this.memo = memo;
		this.gymName = name;
		this.totalPurchasedAmount = totalPurchasedAmount;

		this.prevMonthPurchasedAmount = prevMonthPurchasedAmount;
	}

	async setPassword(variables: { password: string; confirmPassword: string }) {
		if (!this.userId) {
			alert('유저 아이디가 없습니다.');
			return false;
		}
		return await CustomerService.setPassword({
			id: this.userId,
			...variables
		});
	}

	async updateUserInfo(variables: {
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
		if (!this.userId) return alert('유저 아이디가 없습니다.');
		return await CustomerService.updateUserInfo({ id: this.gymId, ...variables });
	}

	async chargeSmarterMoney(variables: { amount: number; description?: string }) {
		if (!this.userId) return alert('유저 아이디가 없습니다.');
		return await CustomerService.chargeSmarterMoney({ userId: this.userId, ...variables });
	}

	async subtractSmarterMoney(variables: { amount: number; description?: string }) {
		if (!this.userId) return alert('유저 아이디가 없습니다.');
		return await CustomerService.subtractSmarterMoney({ userId: this.userId, ...variables });
	}
}
