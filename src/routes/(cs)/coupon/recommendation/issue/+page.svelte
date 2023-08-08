<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import ListFilter from '$lib/components/filters/ListFilter.svelte';
	import formatMoney from '$lib/utils/formatMoney.js';
	import { formatDate } from '$lib/utils/formatDate.js';
	import { formatPhone } from '$lib/utils/formatPhone';
	import type CouponIssueHistory from '$data/classes/CouponIssueHistory.js';
	import type { PageData } from './$types';

	export let data: PageData;

	let issuednewMemberCoupons: CouponIssueHistory[], totalCount: number;
	$: issuednewMemberCoupons = data.issuedCouponsHistories;
	$: totalCount = data.totalCount;
</script>

<div class="p-8">
	<div class="w-full p-8 rounded-lg border bg-white">
		<ListFilter dateLabel="발급일" placeholder="쿠폰번호, 체육관명" />
		<Table classes="mt-8 w-full">
			<Thead>
				<Th classes="w-32">쿠폰번호</Th>
				<Th classes="w-40">추천인코드</Th>
				<Th classes="w-32">체육관명</Th>
				<Th classes="w-40">발급금액</Th>
				<Th classes="w-40">발급일</Th>
				<Th classes="w-40">사용기한</Th>
			</Thead>
			<Tbody>
				{#each issuednewMemberCoupons as coupon}
					<Tr>
						<Td>{coupon.couponNumber}</Td>
						<Td>{formatPhone(coupon.referralPhone)}</Td>
						<Td>{coupon.gymName}</Td>
						<Td>{formatMoney({ money: coupon.price })}</Td>
						<Td>{formatDate(coupon.dateIssued)}</Td>
						<Td>{formatDate(coupon.endOfUse)}</Td>
					</Tr>
				{/each}
			</Tbody>
		</Table>
		<div class="mt-8 flex justify-center">
			<Pagination {totalCount} />
		</div>
	</div>
</div>
