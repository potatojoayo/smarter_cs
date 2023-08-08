<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import CreateManualCouponModal from '$lib/components/modal/CreateManualCouponModal.svelte';
	import IssueManualCouponModal from '$lib/components/modal/IssueManualCouponModal.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import { formatDate } from '$lib/utils/formatDate.js';
	import formatMoney from '$lib/utils/formatMoney.js';
	import type CouponMaster from '$data/classes/CouponMaster.js';

	export let data;

	let manualCoupons: CouponMaster[], totalCount: number;
	$: manualCoupons = data.manualCoupons;
	$: totalCount = data.totalCount;

	let createModalOpen = false;
	let issueManualCouponModalOpen = false;
	let couponName: string;
	let couponMasterId: number | undefined = undefined;
</script>

<div class="p-8">
	<div class="w-full p-8 rounded-lg border bg-white">
		<div class="flex justify-end items-end">
			<Button
				text="쿠폰만들기"
				on:click={() => {
					createModalOpen = !createModalOpen;
				}}
			/>
		</div>

		<Table classes="mt-2 w-full">
			<Thead>
				<Th classes="w-44">이름</Th>
				<Th classes="w-28">1장당 금액</Th>
				<Th classes="w-28">누적 발급 매수</Th>
				<Th classes="w-28">누적 발급 금액</Th>
				<Th classes="w-32">생성일</Th>
			</Thead>
			<Tbody>
				{#each manualCoupons as coupon}
					<Tr
						onClick={() => {
							issueManualCouponModalOpen = true;
							couponName = coupon.name;
							couponMasterId = coupon.id;
						}}
					>
						<Td>{coupon.name}</Td>
						<Td>{formatMoney({ money: coupon.price })}</Td>
						<Td>{coupon.totalIssuedCount}</Td>
						<Td>{formatMoney({ money: coupon.price * coupon.totalIssuedCount })}</Td>
						<Td>{formatDate(coupon.dateCreated)}</Td>
					</Tr>
				{/each}
			</Tbody>
		</Table>
		<div class="mt-8 flex justify-center">
			<Pagination {totalCount} />
		</div>
	</div>
</div>

{#if createModalOpen}
	<CreateManualCouponModal bind:open={createModalOpen} />
{/if}
{#if issueManualCouponModalOpen}
	<IssueManualCouponModal bind:open={issueManualCouponModalOpen} {couponName} />
{/if}
