<script lang="ts">
	import Thead from '$lib/components/table/Thead.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import OrderMasterDetailModal from '$lib/components/modal/OrderMasterDetailModal.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import CancelState from '$lib/components/CancelState.svelte';
	import ListFilter from '$lib/components/filters/ListFilter.svelte';
	import CancelORderService from '$data/services/CancelOrderService';
	import formatMoney from '$lib/utils/formatMoney';
	import { reload } from '$lib/utils/reload';
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

	async function handleCompleteCancel() {
		const checkedOrderRequests = cancelOrderRequests.filter((c) => c.checked);
		if (checkedOrderRequests.length === 0) {
			return alert('취소완료할 요청을 선택해주세요.');
		}
		if (!confirm('선택하신 취소요청을 완료하시겠습니까?')) return;
		const { success, message } = await CancelORderService.concludeCancelOrderWithoutDeposit({
			cancelIds: checkedOrderRequests.map((c) => c.id)
		});
		alert(message);
		if (success) {
			reload();
		}
	}

	function handleOrderNumberClick(request: CancelOrderRequest) {
		orderNumber = request.orderNumber;
		orderMasterDetailModalOpen = true;
	}
</script>

<div class="p-8">
	<div class="p-8 rounded-lg border bg-white">
		<div class=" flex justify-between items-end">
			<ListFilter
				dateLabel="접수일"
				placeholder="문의번호, 주문번호, 체육관명"
				stateOptions={['전체', '취소요청', '취소완료']}
			/>
			<Button text="취소완료" classes="h-10" on:click={handleCompleteCancel} />
		</div>

		<Table classes="mt-8 w-full">
			<Thead>
				<Th classes="w-12 ">
					<div class="flex">
						<input
							type="checkbox"
							class="w-4 h-4"
							on:change={(e) => {
								const checked = e.target.checked;
								cancelOrderRequests.forEach((c) => {
									if (c.state === '취소요청') {
										c.checked = checked;
									}
									cancelOrderRequests = cancelOrderRequests;
								});
							}}
						/>
					</div>
				</Th>
				<Th classes="w-40">문의번호</Th>
				<Th classes="w-44">주문번호</Th>
				<Th classes="w-24">체육관</Th>
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
					<Tr
						onClick={() => {
							if (request.state === '취소완료') return;
							request.checked = !request.checked;
						}}
					>
						<Td>
							<div class="flex">
								<input
									type="checkbox"
									class="w-4 h-4"
									checked={request.checked}
									disabled={request.state === '취소완료'}
									on:change={(e) => {
										request.checked = e.target.checked;
									}}
								/>
							</div>
						</Td>
						<Td>
							<a
								href="/inquiry/detail/{request.csRequestId}?category=주문취소"
								class="text-blue-500 hover:text-blue-600"
							>
								{request.csRequestNumber}
							</a>
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
