<script lang="ts">
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import { formatDate } from '$lib/utils/formatDate';
	import formatMoney from '$lib/utils/formatMoney';
	import type SmarterMoneyTransaction from '$data/classes/SmarterMoneyTransaction';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import OrderMasterDetailModal from '$lib/components/modal/OrderMasterDetailModal.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import ChargeSmarterMoneyModal from '$lib/components/modal/ChargeSmarterMoneyModal.svelte';
	import type Customer from '$data/classes/Customer';
	import SubtractSmarterMoneyModal from '$lib/components/modal/SubtractSmarterMoneyModal.svelte';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';

	export let smarterMoneyTransactions: SmarterMoneyTransaction[] = [],
		totalCount = 0,
		editable = false,
		customer: Customer | undefined = undefined,
		back = false;

	let orderNumber: string,
		orderMasterDetailModalOpen = false,
		chargeSmarterMoneyModalOpen = false,
		withdrawSmarterMoneyModalOpen = false;
	function openOrderMasterDetailModal(selectedOrderNumber: string) {
		orderNumber = selectedOrderNumber;
		orderMasterDetailModalOpen = true;
	}
	function openChargeSmarterMoneyModal() {
		chargeSmarterMoneyModalOpen = true;
	}
	function openWithdrawSmarterMoneyModal() {
		withdrawSmarterMoneyModalOpen = true;
	}
</script>

<div class="flex flex-col p-8 border rounded bg-white">
	{#if back}
		<button
			on:click={() => {
				changeSearchParam({
					param: 'mode',
					value: 'Default'
				});
			}}
			class="flex space-x-2 items-center w-fit"
		>
			<i class="fa-regular fa-arrow-left text-gray-700 text-2xl" />
			<LgBlack>스마터머니 내역</LgBlack>
		</button>
	{:else}
		<LgBlack>스마터머니 내역</LgBlack>
	{/if}

	<div class="mt-4 border-b border-gray-800">
		<MdBlack>현재 보유 스마터머니</MdBlack>
	</div>
	<div class="mt-2 flex justify-between">
		<LgBlack>
			{formatMoney({ money: customer.smarterMoney })}
		</LgBlack>
		{#if editable}
			<div class="flex space-x-2">
				<Button text="차감하기" red on:click={openWithdrawSmarterMoneyModal} />
				<Button text="충전하기" on:click={openChargeSmarterMoneyModal} />
			</div>
		{/if}
	</div>

	<Table classes="mt-4">
		<Thead>
			<Th classes="w-28">거래일시</Th>
			<Th classes="w-20">구분</Th>
			<Th classes="w-40">주문번호</Th>
			<Th>내용</Th>
			<Th classes="w-32">거래금액</Th>
		</Thead>
		<Tbody>
			{#each smarterMoneyTransactions as transaction}
				<Tr>
					<Td>{formatDate(transaction.dateCreated)}</Td>
					<Td>{transaction.transactionType}</Td>
					<Td>
						{#if transaction.orderNumber}
							<TextButton
								text={transaction.orderNumber}
								on:click={() => {
									openOrderMasterDetailModal(transaction.orderNumber);
								}}
							/>
						{/if}
					</Td>
					<Td>{transaction.description}</Td>
					<Td>
						{#if transaction.amount}
							{`${['충전', '적립'].includes(transaction.transactionType) ? '+' : '-'} ` +
								formatMoney({ money: transaction.amount })}
						{/if}
					</Td>
				</Tr>
			{/each}
		</Tbody>
	</Table>
	<div class="mt-8 flex justify-center items-center">
		<Pagination param="smarterMoneyPage" rowCount={10} {totalCount} />
	</div>
</div>

{#if orderMasterDetailModalOpen}
	<OrderMasterDetailModal {orderNumber} bind:open={orderMasterDetailModalOpen} />
{/if}
{#if chargeSmarterMoneyModalOpen}
	<ChargeSmarterMoneyModal bind:open={chargeSmarterMoneyModalOpen} {customer} />
{/if}
{#if withdrawSmarterMoneyModalOpen}
	<SubtractSmarterMoneyModal bind:open={withdrawSmarterMoneyModalOpen} {customer} />
{/if}
