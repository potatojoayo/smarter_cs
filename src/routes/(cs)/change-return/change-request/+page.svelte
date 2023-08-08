<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import OrderMasterDetailModal from '$lib/components/modal/OrderMasterDetailModal.svelte';
	import ChangeRequestModal from '$lib/components/modal/ChangeRequestModal.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import ChangeState from '$lib/components/ChangeState.svelte';
	import ListFilter from '$lib/components/filters/ListFilter.svelte';
	import { formatDate } from '$lib/utils/formatDate';
	import formatMoney from '$lib/utils/formatMoney';
	import type ChangeRequest from '$data/classes/ChangeRequest.js';
	import type { PageData } from './$types';
	export let data: PageData;
	let changeRequests: ChangeRequest[],
		orderNumber: string,
		orderMasterDetailModalOpen = false,
		changeRequestModalOpen = false,
		changeRequest: ChangeRequest,
		page: number;
	$: changeRequests = data.changeRequests;
	$: totalCount = data.totalCount;
	$: page = data.page;

	function handleOrderNumberClick(request: ChangeRequest) {
		orderNumber = request.orderNumber;
		orderMasterDetailModalOpen = true;
	}

	function handleChangeRequestClick(request: ChangeRequest) {
		changeRequest = request;
		changeRequestModalOpen = true;
	}
</script>

<div class="p-8">
	<div class="p-8 rounded-lg border bg-white">
		<ListFilter
			dateLabel="요청날짜"
			placeholder="문의번호, 주문번호, 체육관명"
			stateOptions={['전체', '교환요청', '교환완료']}
		/>
		<Table classes="mt-8 w-full">
			<Thead>
				<Th classes="w-36">문의번호</Th>
				<Th classes="w-36">주문번호</Th>
				<Th classes="pl-4 w-28">체육관</Th>
				<Th classes="w-24">사유</Th>
				<Th classes="w-32">상품명</Th>
				<Th classes="w-28">변동금액합계</Th>
				<Th classes="w-28">처리상태</Th>
				<Th classes="w-28">요청날짜</Th>
			</Thead>
			<Tbody>
				{#each changeRequests as request}
					<Tr
						onClick={() => {
							handleChangeRequestClick(request);
						}}
					>
						<Td>
							{#if request.csRequestNumber}
								<a
									on:click={(e) => {
										e.stopPropagation();
									}}
									href="/inquiry/detail/{request.csRequestId}?category=주문취소"
									class="text-blue-500 hover:text-blue-600"
								>
									{request.csRequestNumber}
								</a>
							{:else}
								유저 교환요청
							{/if}
						</Td>
						<Td>
							<TextButton
								text={request.orderNumber}
								on:click={(e) => {
									e.stopPropagation();
									handleOrderNumberClick(request);
								}}
							/>
						</Td>
						<Td classes="px-4">
							{request.gymName}
						</Td>
						<Td>
							{request.changeReason ?? '-'}
						</Td>
						<Td>
							{request.changeProductsName}
						</Td>
						<Td>
							{formatMoney({ money: request.totalChangingPrice }) ?? ''}
						</Td>
						<!-- <Td>
							{request.changedPriceCharge ?? ''}
						</Td> -->
						<Td>
							<ChangeState state={request.state} />
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

{#if changeRequestModalOpen}
	<ChangeRequestModal
		changeRequestId={changeRequest.id}
		bind:open={changeRequestModalOpen}
		{page}
		editable={changeRequest.state === '교환요청'}
	/>
{/if}
