<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import ReturnRequestModal from '$lib/components/modal/ReturnRequestModal.svelte';
	import ListFilter from '$lib/components/filters/ListFilter.svelte';
	import OrderMasterDetailModal from '$lib/components/modal/OrderMasterDetailModal.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import ReturnState from '$lib/components/ReturnState.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import formatMoney from '$lib/utils/formatMoney';
	import { formatDate } from '$lib/utils/formatDate';
	import type ReturnRequest from '$data/classes/ReturnRequests.js';
	export let data;
	let returnId: number;
	let returnState: string;

	let orderNumber = '',
		orderMasterDetailModalOpen = false,
		returnRequests: ReturnRequest[];

	$: returnRequests = data.returnRequests;
	$: totalCount = data.totalCount;

	let editReturnRequestModalOpen = false;

	function handleOrderNumberClick(request: ReturnRequest) {
		orderNumber = request.orderNumber;
		orderMasterDetailModalOpen = true;
	}
</script>

<div class="p-8">
	<div class="p-8 rounded-lg border bg-white">
		<ListFilter
			dateLabel="요청날짜"
			stateOptions={['전체', '반품요청', '반품완료']}
			placeholder="문의번호, 주문번호, 체육관명"
		/>
		<Table classes="mt-8 w-full">
			<Thead>
				<Th classes="w-36">문의번호</Th>
				<Th classes="w-36">주문번호</Th>
				<Th classes="pl-4 w-28">체육관</Th>
				<Th classes="w-24">사유</Th>
				<Th classes="w-32">상품명</Th>
				<Th classes="w-28">상품금액합계</Th>
				<Th classes="w-28">처리상태</Th>
				<Th classes="w-28">요청날짜</Th>
			</Thead>
			<Tbody>
				{#each returnRequests as request}
					<Tr
						onClick={() => {
							editReturnRequestModalOpen = true;
							returnId = request.id;
							returnState = request.state;
						}}
					>
						<Td>
							{#if request.csRequestNumber}
								<a
									href="/inquiry/detail/{request.csRequestId}?category=주문취소"
									class="text-blue-500 hover:text-blue-600"
								>
									{request.csRequestNumber}
								</a>
							{:else}
								유저 반품요청
							{/if}
						</Td>
						<Td>
							<TextButton
								text={request.orderNumber}
								on:click={() => handleOrderNumberClick(request)}
							/>
						</Td>
						<Td classes="px-4">
							{request.gymName}
						</Td>
						<Td>
							{request.returnReason}
						</Td>
						<Td>
							{request.returnProductsName}
						</Td>
						<Td>
							{formatMoney({ money: request.totalProductsPrice }) ?? ''}
						</Td>
						<Td>
							<ReturnState state={request.state} />
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

{#if editReturnRequestModalOpen}
	<ReturnRequestModal bind:open={editReturnRequestModalOpen} {returnId} {returnState} />
{/if}
