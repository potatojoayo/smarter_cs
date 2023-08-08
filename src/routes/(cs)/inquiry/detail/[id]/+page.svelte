<script lang="ts">
	import SmarterMoneyHistory from '$lib/components/inquiry/SmarterMoneyHistory.svelte';
	import Drafts from '$lib/components/inquiry/Drafts.svelte';
	import OrderMasterDetail from '$lib/components/inquiry/OrderMasterDetail.svelte';
	import AdditionalOrder from '$lib/components/inquiry/AdditionalOrder.svelte';
	import DeliveryAddress from '$lib/components/inquiry/DeliveryAddress.svelte';
	import InquiryInfo from '$lib/components/inquiry/InquiryInfo.svelte';
	import InquiryDetailSidebar from '$lib/components/inquiry/InquiryDetailSidebar.svelte';
	import InquiryMode from '$data/enums/InquiryMode';
	import { getInquiryType } from '$data/enums/InqueryType';
	import type SmarterMoneyTransaction from '$data/classes/SmarterMoneyTransaction';
	import type CsRequest from '$data/classes/CsRequest';
	import type Customer from '$data/classes/Customer';
	import type Draft from '$data/classes/Draft';
	import type OrderMaster from '$data/classes/OrderMaster';
	import type ParentCategory from '$data/classes/Category';
	import type { PageData } from './$types';
	import type DeliveryAddressType from '$data/classes/DeliveryAddress';

	export let data: PageData;

	let category: string,
		getDeliveryAddresses: boolean,
		deliveryAddresses: DeliveryAddressType[] | undefined,
		deliveryAddressTotalCount: number | undefined,
		agencies: string[],
		getSmarterMoneyTransactions: boolean,
		smarterMoneyTransactions: SmarterMoneyTransaction[] | undefined,
		smarterMoneyTransactionsTotalCount: number | undefined,
		isCompleted: boolean,
		csRequest: CsRequest,
		customer: Customer,
		getDrafts: boolean,
		draftTotalCount: number | undefined,
		drafts: Draft[] | undefined,
		draftPage: number | undefined,
		getOrderMaster: boolean,
		orderMaster: OrderMaster | undefined,
		back: boolean,
		mode: string,
		categories: ParentCategory[] | undefined;

	$: ({
		csRequest,
		customer,
		category,
		agencies,
		getDeliveryAddresses,
		deliveryAddresses,
		deliveryAddressTotalCount,
		getSmarterMoneyTransactions,
		smarterMoneyTransactions,
		smarterMoneyTransactionsTotalCount,
		getDrafts,
		draftTotalCount,
		drafts,
		draftPage,
		getOrderMaster,
		back,
		orderMaster,
		mode,
		categories
	} = data);

	$: isCompleted = csRequest.csState === '처리완료';
</script>

<div class="flex">
	<InquiryDetailSidebar
		{customer}
		{isCompleted}
		{agencies}
		inquiryType={getInquiryType({ category })}
	/>
	<div class="flex flex-col p-8 ml-96 2xl:ml-[400px] space-y-8 w-full">
		<InquiryInfo {csRequest} />
		{#if getDeliveryAddresses && deliveryAddresses}
			<DeliveryAddress
				totalCount={deliveryAddressTotalCount}
				{deliveryAddresses}
				gymId={customer.gymId}
				editable={!isCompleted}
				{back}
			/>
		{:else if getSmarterMoneyTransactions}
			<SmarterMoneyHistory
				{smarterMoneyTransactions}
				totalCount={smarterMoneyTransactionsTotalCount}
				{customer}
				editable={!isCompleted}
				{back}
			/>
		{:else if getDrafts}
			<Drafts
				{drafts}
				totalCount={draftTotalCount}
				editable={!isCompleted}
				{draftPage}
				{back}
				{customer}
			/>
		{:else if getOrderMaster && orderMaster}
			<OrderMasterDetail {orderMaster} editable={!isCompleted} {back} {customer} bind:csRequest />
		{:else if mode === InquiryMode.AdditionalOrder && categories}
			<AdditionalOrder {categories} {customer} {csRequest} />
		{/if}
	</div>
</div>
