<script lang="ts">
	import NewInquirySidebar from '$lib/components/inquiry/NewInquirySidebar.svelte';
	import CsRequestHistory from '$lib/components/inquiry/CsRequestHistory.svelte';
	import OrderHistory from '$lib/components/inquiry/OrderHistory.svelte';
	import SmarterMoneyHistory from '$lib/components/inquiry/SmarterMoneyHistory.svelte';
	import Drafts from '$lib/components/inquiry/Drafts.svelte';
	import OrderMasterDetail from '$lib/components/inquiry/OrderMasterDetail.svelte';
	import DeliveryAddress from '$lib/components/inquiry/DeliveryAddress.svelte';
	import { getInquiryType, InquiryType } from '$data/enums/InqueryType';
	import type OrderMaster from '$data/classes/OrderMaster';
	import type Customer from '$data/classes/Customer';
	import type CsRequest from '$data/classes/CsRequest';
	import type { PageData } from './$types';
	import type SmarterMoneyTransaction from '$data/classes/SmarterMoneyTransaction';
	import type Draft from '$data/classes/Draft';
	import type DeliveryAddressType from '$data/classes/DeliveryAddress';

	export let data: PageData;
	let customer: Customer | undefined,
		csRequests: CsRequest[] | undefined,
		csRequestTotalCount: number | undefined,
		orderMasters: OrderMaster[] | undefined,
		orderMasterTotalCount: number | undefined,
		category: string,
		inquiryType: InquiryType,
		smarterMoneyTransactions: SmarterMoneyTransaction[] | undefined = [],
		smarterMoneyTransactionTotalCount: number | undefined,
		drafts: Draft[] | undefined = [],
		draftTotalCount: number | undefined,
		deliveryAddresses: DeliveryAddressType[] = [],
		deliveryAddressTotalCount: number | undefined,
		orderMaster: OrderMaster | undefined;

	$: customer = data.customer;
	$: csRequests = data.csRequests;
	$: csRequestTotalCount = data.csRequestTotalCount;
	$: orderMasters = data.orderMasters;
	$: orderMasterTotalCount = data.orderMasterTotalCount;
	$: category = data.category;
	$: inquiryType = getInquiryType({ category });
	$: smarterMoneyTransactions = data.smarterMoneyTransactions;
	$: smarterMoneyTransactionTotalCount = data.smarterMoneyTransactionTotalCount;
	$: deliveryAddresses = data.deliveryAddresses ?? [];
	$: deliveryAddressTotalCount = data.deliveryAddressTotalCount;
	$: drafts = data.drafts;
	$: draftTotalCount = data.draftTotalCount;
	$: orderMaster = data.orderMaster;
</script>

<div class="flex">
	<NewInquirySidebar {category} {customer} {orderMaster} />
	<div class="ml-96 2xl:ml-[480px] p-8 w-full flex flex-col space-y-8">
		{#if customer}
			<CsRequestHistory {csRequests} totalCount={csRequestTotalCount} />
		{/if}
		{#if inquiryType === InquiryType.order && !orderMaster}
			<OrderHistory {orderMasters} totalCount={orderMasterTotalCount} />
		{/if}
		{#if inquiryType === InquiryType.smarterMoney}
			<SmarterMoneyHistory
				{smarterMoneyTransactions}
				{customer}
				totalCount={smarterMoneyTransactionTotalCount}
			/>
		{/if}
		{#if inquiryType === InquiryType.address}
			<DeliveryAddress {deliveryAddresses} totalCount={deliveryAddressTotalCount} />
		{/if}
		{#if inquiryType === InquiryType.draft}
			<Drafts {drafts} totalCount={draftTotalCount} />
		{/if}
		{#if orderMaster}
			<OrderMasterDetail {orderMaster} select />
		{/if}
	</div>
</div>
