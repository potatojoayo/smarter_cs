<script lang="ts">
	import Thead from '$lib/components/table/Thead.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import ListFilter from '$lib/components/filters/ListFilter.svelte';
	import OrderMasterDetailModal from '$lib/components/modal/OrderMasterDetailModal.svelte';
	import formatMoney from '$lib/utils/formatMoney';
	import { formatDate } from '$lib/utils/formatDate';
	import type PartialCancelHistory from '$data/classes/PartialCancelHistory';
	import type { PageData } from './$types';

	export let data: PageData;

	let totalCount: number,
		partialCancelHistories: PartialCancelHistory[],
		orderMasterDetailModalOpen = false,
		orderNumber: string;

	$: {
		partialCancelHistories = data.partialCancelHistories;
		totalCount = data.totalCount;
	}

	function handleOrderNumberClick(history: PartialCancelHistory) {
		orderNumber = history.orderNumber;
		orderMasterDetailModalOpen = true;
	}
</script>

<div class="p-8">
	<div class="p-8 rounded-lg border bg-white">
		<ListFilter dateLabel="접수일" placeholder="문의번호, 주문번호, 체육관명" />
		<Table classes="mt-8 w-full">
			<Thead>
				<Th classes="w-40">문의번호</Th>
				<Th classes="w-44">주문번호</Th>
				<Th classes="w-24">체육관</Th>
				<Th classes="w-32">사유</Th>
				<Th classes="w-40">상품명</Th>
				<Th classes="w-28">색상</Th>
				<Th classes="w-28">사이즈</Th>
				<Th classes="w-28">개당단가</Th>
				<Th classes="w-20">취소수량</Th>
				<Th classes="w-32">취소금액</Th>
				<Th classes="w-32">취소날짜</Th>
			</Thead>
			<Tbody>
				{#each partialCancelHistories as history}
					<Tr>
						<Td>
							<a
								href="/inquiry/detail/{history.csRequestId}?category=주문취소"
								class="text-blue-500 hover:text-blue-600"
							>
								{history.csRequestNumber}
							</a>
						</Td>
						<Td>
							<TextButton
								text={history.orderNumber}
								on:click={() => handleOrderNumberClick(history)}
							/>
						</Td>
						<Td>
							{history.gymName}
						</Td>
						<Td>
							{history.reason ?? '-'}
						</Td>
						<Td>
							{history.productName}
						</Td>
						<Td>
							{history.color}
						</Td>
						<Td>
							{history.size}
						</Td>
						<Td>
							{formatMoney({ money: history.priceProduct })}
						</Td>
						<Td>
							{history.canceledQuantity}
						</Td>
						<Td>
							{formatMoney({ money: history.priceTotal })}
						</Td>
						<Td>
							{formatDate(history.dateCreated)}
						</Td>
					</Tr>
				{/each}
			</Tbody>
		</Table>

		<div class="flex justify-center mt-8">
			<Pagination {totalCount} />
		</div>
	</div>
</div>

{#if orderMasterDetailModalOpen}
	<OrderMasterDetailModal {orderNumber} bind:open={orderMasterDetailModalOpen} />
{/if}
