<script lang="ts">
	import { formatDate } from '$lib/utils/formatDate';
	import Td from '$lib/components/table/Td.svelte';
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import CsState from '$lib/components/CsState.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import type CsRequest from '$data/classes/CsRequest';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import MdGray from '$lib/components/base/MdGray.svelte';

	export let csRequests: CsRequest[] = [],
		totalCount = 0;
</script>

<div class="flex flex-col p-8 border rounded bg-white">
	<LgBlack>상담내역</LgBlack>
	{#if csRequests.length > 0}
		<Table classes="mt-4">
			<Thead>
				<Th classes="w-40">문의번호</Th>
				<Th classes="w-32">접수일</Th>
				<Th classes="w-32">구분</Th>
				<Th classes="w-32">사유</Th>
				<Th classes="w-32">주문상태</Th>
				<Th classes="w-32">처리상태</Th>
				<Th classes="w-32">처리일</Th>
				<Th classes="hidden 2xl:block">내용</Th>
			</Thead>
			<Tbody>
				{#each csRequests as request}
					<Tr>
						<Td>
							<a
								href="/inquiry/detail/{request.id}?category={request.category}"
								class="text-blue-500 hover:text-blue-600"
							>
								{request.requestNumber}
							</a>
						</Td>
						<Td>
							{formatDate(request.dateRequested)}
						</Td>
						<Td>
							{request.category}
						</Td>
						<Td>
							{request.reason ?? '-'}
						</Td>
						<Td>
							{request.orderState ?? '-'}
						</Td>
						<Td>
							<CsState state={request.csState} />
						</Td>
						<Td>
							{formatDate(request.dateCompleted)}
						</Td>
						<Td classes="hidden 2xl:block">
							{#if request.requestContents.length > 0}
								{request.requestContents[0].contents}
							{:else}
								-
							{/if}
						</Td>
					</Tr>
				{/each}
			</Tbody>
		</Table>

		<div class="mt-8 flex justify-center items-center">
			<Pagination param="csRequestPage" rowCount={5} {totalCount} />
		</div>
	{:else}
		<div class="mt-4">
			<MdGray>상담내역이 없습니다.</MdGray>
		</div>
	{/if}
</div>
