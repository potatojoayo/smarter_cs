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
	import type { PageData } from './$types';
	import type CouponMasterIssueHistory from '$data/classes/CouponMasterIssueHistory';

	export let data: PageData;

	let manualCouponMasterIssueHistories: CouponMasterIssueHistory[], totalCount: number;
	$: manualCouponMasterIssueHistories = data.manualCouponMasterIssueHistories;
	$: totalCount = data.totalCount;
</script>

<div class="p-8">
	<div class="w-full p-8 rounded-lg border bg-white">
		<ListFilter dateLabel="발급일" placeholder="쿠폰명" />
		<Table classes="mt-8 w-full">
			<Thead>
				<Th classes="w-28">발급일</Th>
				<Th classes="w-32">쿠폰명</Th>
				<Th classes="w-24">검색유형</Th>
				<Th classes="w-24">쿠폰 금액</Th>
				<Th classes="w-28">체육관당 발급 매수</Th>
				<Th classes="w-28">발급 체육관 수</Th>
				<Th classes="w-24">총 발급 매수</Th>
				<Th classes="w-28">총 발급 금액</Th>
				<Th classes="w-28">사용기한</Th>
			</Thead>
			<Tbody>
				{#each manualCouponMasterIssueHistories as history}
					<Tr>
						<Td>
							{formatDate(history.dateIssued)}
						</Td>
						<Td>
							{history.couponMaster.name}
						</Td>
						<Td>
							{history.searchType}
						</Td>
						<Td>
							{formatMoney({
								money: history.issuedAmountPerGym / history.issuedCountPerGym,
								suffix: true
							})}
						</Td>
						<Td>
							{history.issuedCountPerGym}
						</Td>
						<Td>
							{history.totalIssuedCount / history.issuedCountPerGym}
						</Td>
						<Td>
							{history.totalIssuedCount}
						</Td>
						<Td>
							{formatMoney({ money: history.totalIssuedAmount, suffix: true })}
						</Td>
						<Td>
							{history.dateExpired}
						</Td>
					</Tr>
				{/each}
			</Tbody>
		</Table>
		<div class="mt-8 flex justify-center">
			<Pagination {totalCount} />
		</div>
	</div>
</div>
