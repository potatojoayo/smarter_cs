<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import ListFilter from '$lib/components/filters/ListFilter.svelte';
	import { formatDate } from '$lib/utils/formatDate.js';
	import formatMoney from '$lib/utils/formatMoney.js';
	import type CouponUsedHistory from '$data/classes/CouponUsedHistory.js';

	export let data;

	let usedCoupons: CouponUsedHistory[], totalCount: number;
	$: usedCoupons = data.usedCouponsHistories;
	$: totalCount = data.totalCount;
</script>

<div class="p-8">
	<div class="w-full p-8 rounded-lg border bg-white">
		<ListFilter dateLabel="사용일" placeholder="이름, 체육관명" />
		<Table classes="mt-8 w-full">
			<Thead>
				<Th>이름</Th>
				<Th>체육관명</Th>
				<Th>사용금액</Th>
				<Th>주문번호</Th>
				<Th>사용일</Th>
			</Thead>
			<Tbody>
				{#each usedCoupons as coupon}
					<Tr>
						<Td>{coupon.couponName}</Td>
						<Td>{coupon.gymName}</Td>
						<Td>{formatMoney({ money: coupon.price })}</Td>
						<Td>{coupon.orderNumber}</Td>
						<Td>{formatDate(coupon.dateUsed)}</Td>
					</Tr>
				{/each}
			</Tbody>
		</Table>
		<div class="mt-8 flex justify-center">
			<Pagination {totalCount} />
		</div>
	</div>
</div>
