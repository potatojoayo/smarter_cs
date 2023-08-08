<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import OrderMasterDetailModal from '$lib/components/modal/OrderMasterDetailModal.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import CancelState from '$lib/components/CancelState.svelte';
	import ListFilter from '$lib/components/filters/ListFilter.svelte';
	import formatMoney from '$lib/utils/formatMoney';
	import { formatDate } from '$lib/utils/formatDate';
	import type { PageData } from './$types';
	import type CancelOrderRequest from '$data/classes/CancelOrderRequest';

	export let data: PageData;

	let totalCount: number,
		cancelOrderRequests: CancelOrderRequest[],
		orderMasterDetailModalOpen = false,
		orderNumber: string;

	$: {
		totalCount = data.totalCount;
		cancelOrderRequests = data.cancelOrderRequests;
	}

	function handleOrderNumberClick(request: CancelOrderRequest) {
		orderNumber = request.orderNumber;
		orderMasterDetailModalOpen = true;
	}
</script>

<div class="p-8">
	<div class="p-8 rounded-lg border bg-white">
		<ListFilter
			dateLabel="접수일"
			placeholder="문의번호, 주문번호, 체육관명"
			stateOptions={['전체', '취소요청', '취소완료']}
		/>
		<Table classes="mt-8 w-full">
			<Thead>
				<Th classes="w-40">문의번호</Th>
				<Th classes="w-44">주문번호</Th>
				<Th classes="w-32">체육관</Th>
				<Th classes="w-32">사유</Th>
				<Th classes="w-32">주문금액</Th>
				<Th classes="w-32">작업비</Th>
				<Th classes="w-28">배송비</Th>
				<Th classes="w-40">결제금액</Th>
				<Th classes="w-28">처리상태</Th>
				<Th classes="w-32">요청날짜</Th>
			</Thead>
			<Tbody>
				{#each cancelOrderRequests as request}
					<Tr>
						<Td>
							{#if request.csRequestNumber}
								<a
									href="/inquiry/detail/{request.csRequestId}?category=주문취소"
									class="text-blue-500 hover:text-blue-600"
								>
									{request.csRequestNumber}
								</a>
							{:else}
								앱에서 취소 완료
							{/if}
						</Td>
						<Td>
							<TextButton
								text={request.orderNumber}
								on:click={() => handleOrderNumberClick(request)}
							/>
						</Td>
						<Td>
							{request.gymName}
						</Td>
						<Td>
							{request.reason ?? '-'}
						</Td>
						<Td>
							{formatMoney({ money: request.priceProducts })}
						</Td>
						<Td>
							{formatMoney({ money: request.priceWorks })}
						</Td>
						<Td>
							{formatMoney({ money: request.priceDelivery })}
						</Td>
						<Td>
							{formatMoney({ money: request.priceTotal })}
						</Td>
						<Td>
							<CancelState state={request.state} />
						</Td>
						<Td>
							{formatDate(request.dateCreated)}
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
