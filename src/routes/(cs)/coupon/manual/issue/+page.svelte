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
	import type CouponIssueHistory from '$data/classes/CouponIssueHistory';
	import type { PageData } from './$types';

	export let data: PageData;

	let issuedManualCoupons: CouponIssueHistory[], totalCount: number;
	$: issuedManualCoupons = data.issuedManualCoupons;
	$: totalCount = data.totalCount;
</script>

<div class="p-8">
	<div class="w-full p-8 rounded-lg border bg-white">
		<ListFilter dateLabel="발급일" placeholder="쿠폰번호,이름,체육관명" />
		<Table classes="mt-8 w-full">
			<Thead>
				<Th classes="w-28">쿠폰번호</Th>
				<Th classes="w-20">이름</Th>
				<Th classes="w-36">체육관명</Th>
				<Th classes="w-20">발급 금액</Th>
				<Th classes="w-24">발급일</Th>
				<Th classes="w-40">사용기한</Th>
			</Thead>
			<Tbody>
				{#each issuedManualCoupons as coupon}
					<Tr>
						<Td>{coupon.couponNumber}</Td>
						<Td>{coupon.couponName}</Td>
						<Td>{coupon.gymName}</Td>
						<Td>{formatMoney({ money: coupon.price })}</Td>
						<Td>{formatDate(coupon.dateIssued)}</Td>
						<Td>{formatDate(coupon.startOfUse)} ~ {formatDate(coupon.endOfUse)}</Td>
					</Tr>
				{/each}
			</Tbody>
		</Table>
		<div class="mt-8 flex justify-center">
			<Pagination {totalCount} />
		</div>
	</div>
</div>
