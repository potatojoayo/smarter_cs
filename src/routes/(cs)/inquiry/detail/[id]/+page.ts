import type { Page } from '@sveltejs/kit';
import CsRequestService from '$data/services/CsRequestService';
import InquiryMode from '$data/enums/InquiryMode';
import { getInquiryType, InquiryType } from '$data/enums/InqueryType';

export async function load({ params, url }: Page) {
	const category = url.searchParams.get('category') as string;

	let getDeliveryAddresses = false,
		getSmarterMoneyTransactions = false,
		getDrafts = false,
		back = false,
		getOrderMaster = false,
		getCategories = false;

	const id = +params.id,
		mode = url.searchParams.get('mode') ?? 'Default',
		deliveryAddressPage = url.searchParams.get('deliveryAddressPage'),
		smarterMoneyPage = url.searchParams.get('smarterMoneyPage'),
		inquiryType = getInquiryType({ category }),
		draftPage = url.searchParams.get('draftPage'),
		orderMasterPage = url.searchParams.get('orderMasterPage');

	switch (mode) {
		case InquiryMode.DeliveryAddress:
			getDeliveryAddresses = true;
			back = true;
			break;
		case InquiryMode.SmarterMoney:
			getSmarterMoneyTransactions = true;
			back = true;
			break;
		case InquiryMode.Draft:
			getDrafts = true;
			back = true;
			break;
		case InquiryMode.AdditionalOrder:
			getCategories = true;
			break;
		case InquiryMode.Default:
			switch (inquiryType) {
				case InquiryType.order:
					getOrderMaster = true;
					break;
				case InquiryType.address:
					getDeliveryAddresses = true;
					break;
				case InquiryType.draft:
					getDrafts = true;
					break;
				case InquiryType.smarterMoney:
					getSmarterMoneyTransactions = true;
					break;
				case InquiryType.general:
					break;
			}
			break;
	}

	const {
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
	} = await CsRequestService.getRequest({
		id,
		getDeliveryAddresses,
		getSmarterMoneyTransactions,
		getDrafts,
		deliveryAddressPage: deliveryAddressPage ? +deliveryAddressPage : 1,
		smarterMoneyPage: smarterMoneyPage ? +smarterMoneyPage : 1,
		draftPage: draftPage ? +draftPage : 1,
		orderMasterPage: orderMasterPage ? +orderMasterPage : 1,
		getOrderMaster,
		getCategories
	});

	return {
		csRequest,
		customer,
		category,
		getDeliveryAddresses,
		deliveryAddresses,
		deliveryAddressTotalCount,
		agencies,
		getSmarterMoneyTransactions,
		smarterMoneyTransactions,
		smarterMoneyTransactionTotalCount,
		getDrafts,
		drafts,
		draftTotalCount,
		draftPage: draftPage ? +draftPage : undefined,
		orderMasters,
		orderMasterTotalCount,
		getOrderMaster,
		back,
		orderMaster,
		mode,
		categories
	};
}
