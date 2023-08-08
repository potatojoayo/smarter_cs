<script lang="ts">
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import type Draft from '$data/classes/Draft';
	import formatMoney from '$lib/utils/formatMoney';
	import DraftDetailModal from '$lib/components/modal/DraftDetailModal.svelte';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	import Button from '../buttons/Button.svelte';
	import type Customer from '$data/classes/Customer';
	import { page } from '$app/stores';

	export let drafts: Draft[] = [],
		totalCount = 0,
		editable = false,
		draftPage = 1,
		back = false,
		select = false,
		selectedDraft: Draft | undefined = undefined,
		customer: Customer | undefined = undefined,
		onDraftAdded: ((draft: Draft) => void) | undefined = undefined;

	let draftDialogOpen = false,
		draftId: number,
		add = false;

	function handleRowClick(draft: Draft) {
		if (select) {
			if (draft.isSelected) {
				drafts.forEach((d) => (d.isSelected = false));
				selectedDraft = undefined;
			} else {
				drafts.forEach((d) => (d.isSelected = false));
				draft.isSelected = true;
				selectedDraft = draft;
			}
			drafts = drafts;
		} else {
			draftId = draft.id;
			draftDialogOpen = true;
		}
	}

	function handleAddDraft() {
		draftDialogOpen = true;
		add = true;
		editable = true;
	}
</script>

<div class="flex flex-col p-8 border rounded bg-white">
	<div class="flex justify-between w-full">
		{#if back}
			<button
				on:click={() => {
					changeSearchParam({
						param: 'mode',
						value: 'Default'
					});
				}}
				class="flex space-x-2 items-center w-fit"
			>
				<i class="fa-regular fa-arrow-left text-gray-700 text-2xl" />
				<LgBlack>로고시안 목록</LgBlack>
			</button>
		{:else if !select}
			<LgBlack>로고시안 목록</LgBlack>
		{/if}
		{#if !$page.url.pathname.includes('new-inquiry')}
			<Button on:click={handleAddDraft} text="로고시안 추가" />
		{/if}
	</div>

	<Table classes="mt-4">
		<Thead>
			{#if select}
				<Th classes="w-10" />
			{/if}
			<Th classes="w-40">로고시안</Th>
			{#if !select}
				<Th classes="w-28">카테고리</Th>
				<Th classes="w-28">서브카테고리</Th>
				<Th classes="w-28">용역비</Th>
			{/if}
			<Th classes="w-28">작업비</Th>
			{#if !select}
				<Th classes="w-28">폰트</Th>
				<Th classes="w-28">실색깔</Th>
				<Th classes="w-28">프린팅방식</Th>
				<Th>메모</Th>
			{/if}
		</Thead>
		<Tbody>
			{#if drafts}
				{#each drafts as draft}
					<Tr onClick={() => handleRowClick(draft)}>
						{#if select}
							<Td>
								<div>
									<input type="checkbox" class="w-4 h-4" name="draft" checked={draft.isSelected} />
								</div>
							</Td>
						{/if}
						<Td classes="flex">
							<button
								on:click={(e) => {
									e.stopPropagation();
									window.open(draft.image, '_blank', 'width=1024, height=768');
								}}
							>
								<img src={draft.image} alt="로고시안" class="max-h-20" />
							</button>
						</Td>
						{#if !select}
							<Td>
								{draft.categoryName}
							</Td>
							<Td classes="whitespace-nowrap">
								{draft.subCategoryName}
							</Td>
							<Td>
								{formatMoney({ money: draft.priceWorkLabor })}
							</Td>
						{/if}
						<Td>
							{formatMoney({ money: draft.priceWork })}
						</Td>
						{#if !select}
							<Td>
								{draft.font ?? ''}
							</Td>
							<Td>
								{draft.threadColor ?? ''}
							</Td>
							<Td>
								{draft.printing ?? ''}
							</Td>
							<Td>
								{draft.memo ?? ''}
							</Td>
						{/if}
					</Tr>
				{/each}
			{/if}
		</Tbody>
	</Table>
	<div class="mt-8 flex justify-center items-center">
		<Pagination param="draftPage" rowCount={10} {totalCount} />
	</div>
</div>

{#if draftDialogOpen}
	<DraftDetailModal
		bind:open={draftDialogOpen}
		{draftId}
		{editable}
		{draftPage}
		{onDraftAdded}
		bind:add
		userId={customer?.userId}
	/>
{/if}
