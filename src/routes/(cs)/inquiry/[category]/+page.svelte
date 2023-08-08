<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import CsState from '$lib/components/CsState.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import ListFilter from '$lib/components/filters/ListFilter.svelte';
	import { formatDate } from '$lib/utils/formatDate';
	import { goto } from '$app/navigation';
	import type CsRequest from '$data/classes/CsRequest';

	export let data;

	let csRequests: CsRequest[], totalCount: number;
	$: csRequests = data ? data.csRequests : [];
	$: totalCount = data ? data.totalCount : 0;
</script>

<div class="p-8">
	<div class="p-8 rounded-lg border bg-white">
		<ListFilter
			dateLabel="접수일"
			placeholder="체육관명, 관장이름, 휴대폰번호"
			inputTextTitle="회원검색"
			stateOptions={['전체', '미처리', '처리완료']}
			inquiryOptions={['전체', '일반문의', '주문변경', '로고시안', '스마터머니', '오배송']}
		/>
		<Table classes="mt-8 w-full">
			<Thead>
				<Th classes="w-36">문의번호</Th>
				<Th classes="w-28">접수일</Th>
				<Th classes="w-36">체육관명</Th>
				<Th classes="w-20">구분</Th>
				<Th classes="w-20">사유</Th>
				<Th classes="w-20">주문상태</Th>
				<Th classes="w-28">처리상태</Th>
				<Th classes="w-28">처리일</Th>
			</Thead>
			<Tbody>
				{#each csRequests as request}
					<Tr
						onClick={() => {
							goto(`detail/${request.id}?category=${request.category}`);
						}}
					>
						<Td>
							{request.requestNumber}
						</Td>
						<Td>
							{formatDate(request.dateRequested)}
						</Td>
						<Td>
							{request.gymName}
						</Td>
						<Td>
							{request.category}
						</Td>
						<Td>
							{request.reason ?? ''}
						</Td>
						<Td>
							{request.orderState ?? ''}
						</Td>
						<Td>
							<CsState state={request.csState} />
						</Td>
						<Td>
							{formatDate(request.dateCompleted)}
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
