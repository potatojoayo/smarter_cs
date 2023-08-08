import type { Page } from '@sveltejs/kit';
import Customer from '$data/classes/Customer';
import { getInquiryType, InquiryType } from '$data/enums/InqueryType';

export async function load({ url }: Page) {
	const gymId = url.searchParams.get('gymId');
	const csRequestPage = url.searchParams.get('csRequestPage') ?? '1';
	const orderMasterPage = url.searchParams.get('orderMasterPage');
	const smarterMoneyPage = url.searchParams.get('smarterMoneyPage');
	const draftPage = url.searchParams.get('draftPage');
	const deliveryAddressPage = url.searchParams.get('deliveryAddressPage');
	const category = url.searchParams.get('category') ?? '일반문의';
	const orderMasterId = url.searchParams.get('orderMasterId');

	let customer,
		csRequests,
		csRequestTotalCount,
		orderMasters,
		orderMasterTotalCount,
		drafts,
		draftTotalCount,
		smarterMoneyTransactions,
		smarterMoneyTransactionTotalCount,
		deliveryAddresses,
		deliveryAddressTotalCount,
		orderMaster;

	if (gymId) {
		const result = await Customer.fromId({
			id: +gymId,
			csRequestPage: +csRequestPage,
			orderMasterPage: orderMasterPage ? +orderMasterPage : null,
			getOrderMasters: getInquiryType({ category }) === InquiryType.order && !orderMasterId,
			getSmarterMoneyTransactions: getInquiryType({ category }) === InquiryType.smarterMoney,
			smarterMoneyPage: smarterMoneyPage ? +smarterMoneyPage : null,
			getAddresses: getInquiryType({ category }) === InquiryType.address,
			addressPage: deliveryAddressPage ? +deliveryAddressPage : null,
			getDrafts: getInquiryType({ category }) === InquiryType.draft,
			draftPage: draftPage ? +draftPage : null,
			getOrderMaster: orderMasterId != null,
			orderMasterId
		});
		customer = result.customer;
		csRequests = result.csRequests;
		csRequestTotalCount = result.csRequestTotalCount;
		orderMasters = result.orderMasters;
		orderMasterTotalCount = result.orderMasterTotalCount;
		smarterMoneyTransactions = result.smarterMoneyTransactions;
		smarterMoneyTransactionTotalCount = result.smarterMoneyTransactionTotalCount;
		deliveryAddresses = result.deliveryAddresses;
		deliveryAddressTotalCount = result.deliveryAddressTotalCount;
		drafts = result.drafts;
		draftTotalCount = result.draftTotalCount;
		orderMaster = result.orderMaster;
	}

	return {
		customer,
		csRequests,
		csRequestTotalCount,
		orderMasters,
		orderMasterTotalCount,
		category,
		smarterMoneyTransactions,
		smarterMoneyTransactionTotalCount,
		deliveryAddresses,
		deliveryAddressTotalCount,
		drafts,
		draftTotalCount,
		orderMaster
	};
}
