<script lang="ts">
	import { page } from '$app/stores';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	import MdGray from '../base/MdGray.svelte';
	import Button from '../buttons/Button.svelte';
	import DropdownSelect from '../input/DropdownSelect.svelte';
	import InputDate from '../input/InputDate.svelte';
	import InputText from '../input/InputText.svelte';
	import OutlinedButton from '../buttons/OutlinedButton.svelte';
	import { changeSearchParams } from '$lib/utils/changeSearchParams';
	import { formatDate } from '$lib/utils/formatDate';
	export let dateLabel: string,
		stateOptions: string[] | undefined = undefined,
		placeholder: string,
		inputTextTitle = '검색',
		inquiryOptions: string[] | undefined = undefined;
	let keyword: string;

	let endMax = formatDate(new Date());
	let startMax: string | null = endMax;
	$: startMax = $page.url.searchParams.get('end');
	let endMin = $page.url.searchParams.get('start');
	$: endMin = $page.url.searchParams.get('start');

	function handleOneWeekClick() {
		const now = new Date();
		const aWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
		changeSearchParams({
			params: [
				{ param: 'start', value: formatDate(aWeekAgo) },
				{ param: 'end', value: formatDate(now) }
			]
		});
	}
	function handleOneMonthClick() {
		const now = new Date();
		const aMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
		changeSearchParams({
			params: [
				{ param: 'start', value: formatDate(aMonthAgo) },
				{ param: 'end', value: formatDate(now) }
			]
		});
	}
	function handleThreeMonthClick() {
		const now = new Date();
		const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
		changeSearchParams({
			params: [
				{ param: 'start', value: formatDate(threeMonthsAgo) },
				{ param: 'end', value: formatDate(now) }
			]
		});
	}
</script>

<div class="flex space-x-8">
	<div class="flex flex-col">
		<MdGray text={inputTextTitle} />
		<div class="flex space-x-2 items-end">
			<InputText
				classes="w-60 mt-2"
				{placeholder}
				bind:value={keyword}
				onSubmit={() => {
					changeSearchParam({
						param: 'keyword',
						value: keyword
					});
				}}
			/>
			<Button
				text="검색"
				classes="h-10"
				on:click={() => {
					changeSearchParam({
						param: 'keyword',
						value: keyword
					});
				}}
			/>
		</div>
	</div>
	{#if stateOptions}
		<div class="flex flex-col">
			<MdGray text="처리상태" />
			<DropdownSelect
				classes="mt-2"
				options={stateOptions}
				onSelect={(selected) => {
					if (inquiryOptions) {
						changeSearchParam({ value: selected, param: 'csState' });
					} else {
						changeSearchParam({ value: selected, param: 'state' });
					}
				}}
			/>
		</div>
	{/if}
	{#if inquiryOptions}
		<div class="flex flex-col">
			<MdGray text="문의유형" />
			<DropdownSelect
				classes="mt-2"
				options={inquiryOptions}
				onSelect={(selected) => {
					changeSearchParam({ value: selected, param: 'category' });
				}}
			/>
		</div>
	{/if}
	<div class="flex flex-col">
		<MdGray text={dateLabel} />
		<div class="flex space-x-4 items-center mt-2">
			<InputDate
				max={startMax}
				onChange={(value) => {
					changeSearchParam({ param: 'start', value });
				}}
			/>
			<span class="text-2xl">~</span>
			<InputDate
				min={endMin}
				max={endMax}
				onChange={(value) => {
					changeSearchParam({ param: 'end', value });
				}}
			/>
			<OutlinedButton on:click={handleOneWeekClick}>1주일</OutlinedButton>
			<OutlinedButton on:click={handleOneMonthClick}>1개월</OutlinedButton>
			<OutlinedButton on:click={handleThreeMonthClick}>3개월</OutlinedButton>
		</div>
	</div>
</div>
