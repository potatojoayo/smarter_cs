<script lang="ts">
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import type OrderMaster from '$data/classes/OrderMaster';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import { formatDate } from '$lib/utils/formatDate';
	import formatMoney from '$lib/utils/formatMoney';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	import MdGray from '$lib/components/base/MdGray.svelte';
	import OrderState from '../OrderState.svelte';
	import UsedCouponModal from '$lib/components/modal/UsedCouponModal.svelte';

	export let orderMasters: OrderMaster[] = [],
		totalCount = 0;

	let usedCouponModalOpen = false,
		orderMaster: OrderMaster = orderMasters[0];

	function handleClick(orderMaster: OrderMaster): void {
		changeSearchParam({
			param: 'orderMasterId',
			value: orderMaster.id.toString(),
			replaceState: false
		});
	}

	function onClickCouponModal() {
		usedCouponModalOpen = true;
	}
</script>

<div class="flex flex-col p-8 border rounded bg-white">
	<LgBlack>주문내역</LgBlack>

	{#if orderMasters.length > 0}
		<Table classes="mt-4">
			<Thead>
				<Th classes="w-40">주문번호</Th>
				<Th classes="w-32">주문일자</Th>
				<Th classes="w-24">배송비</Th>
				<Th classes="w-24">합계금액</Th>
				<Th classes="w-20">스마터머니</Th>
				<Th classes="w-20 pl-2">쿠폰</Th>
				<Th classes="w-28">결제할금액</Th>
				<Th classes="w-28">주문상태</Th>
				<Th classes="w-36">메모</Th>
				<Th classes="w-10">방문수령</Th>
			</Thead>
			<Tbody>
				{#each orderMasters as orderMaster}
					<Tr
						onClick={() => {
							handleClick(orderMaster);
						}}
					>
						<Td>
							<TextButton
								text={orderMaster.orderNumber}
								on:click={() => {
									handleClick(orderMaster);
								}}
							/>
						</Td>
						<Td>
							{formatDate(orderMaster.dateCreated)}
						</Td>
						<Td>
							{formatMoney({ money: orderMaster.priceDelivery })}
						</Td>
						<Td>
							{formatMoney({ money: orderMaster.priceTotal })}
						</Td>
						<Td>
							{formatMoney({ money: orderMaster.smarterMoney })}
						</Td>

						<Td>
							<TextButton on:click={onClickCouponModal} text={orderMaster.couponName ?? ''} />
						</Td>
						<Td>
							{formatMoney({ money: orderMaster.priceToPay })}
						</Td>
						<Td>
							<OrderState state={orderMaster.orderState} />
						</Td>
						<Td>
							{orderMaster.memo ?? ''}
						</Td>
						<Td>
							{orderMaster.isPickUp ? 'O' : 'X'}
						</Td>
					</Tr>
				{/each}
			</Tbody>
		</Table>
		<div class="mt-8 flex justify-center items-center">
			<Pagination param="orderMasterPage" rowCount={10} {totalCount} />
		</div>
	{:else}
		<div class="mt-4">
			<MdGray>주문내역이 없습니다.</MdGray>
		</div>
	{/if}
</div>

{#if usedCouponModalOpen}
	<UsedCouponModal bind:open={usedCouponModalOpen} {orderMaster} />
{/if}
