<script lang="ts">
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import InputNumber from '$lib/components/input/InputNumber.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import type Draft from '$data/classes/Draft';
	import InputText from '$lib/components/input/InputText.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';

	export let draft: Draft, editable: boolean;
	let selectedSizeIndex = 0,
		isEditingName = false;

	function handleSizeNumber(index: number) {
		selectedSizeIndex = index;
	}
	function handleEditName() {
		isEditingName = true;
	}

	function finishEditName() {
		isEditingName = false;
	}
</script>

<div class="flex flex-col flex-1 h-full justify-start">
	<div class="flex justify-between items-center space-x-2">
		{#each draft.sizes as size, index}
			{#if index === selectedSizeIndex && isEditingName}
				<div class="flex space-x-2">
					<InputText
						bind:value={draft.sizes[selectedSizeIndex].name}
						classes="h-10 text-gray-800 w-full"
					/>
					<TextButton on:click={finishEditName}>확인</TextButton>
				</div>
			{:else}
				<button
					on:click={() => handleSizeNumber(index)}
					class="{draft.sizes[selectedSizeIndex].name === size.name
						? 'bg-blue-500 text-white border-blue-500'
						: 'hover:bg-gray-100 '} rounded p-2 border text-sm flex space-x-2 items-center h-10 flex-1 justify-center"
				>
					<div>
						{size.name}
					</div>
					{#if index === selectedSizeIndex}
						<button class="fa fa-pen" on:click={handleEditName} />
					{/if}
				</button>
			{/if}
		{/each}
	</div>
	<div class="h-4" />
	<div class="flex space-x-4">
		<Table classes="w-full">
			<Thead>
				<Th classes="w-32">위치</Th>
				<Th classes="w-28">가로 (cm)</Th>
				<Th classes="w-28">세로 (cm)</Th>
			</Thead>
			<Tbody>
				<Tr>
					<Td>등</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].backWidth}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].backHeight}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
				</Tr>
				<Tr>
					<Td>왼가슴</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].leftChestWidth}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].leftChestHeight}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
				</Tr>
			</Tbody>
			<Tr>
				<Td>오른가슴</Td>
				<Td>
					<InputNumber
						bind:value={draft.sizes[selectedSizeIndex].rightChestWidth}
						disabled={!editable}
						classes="w-20"
					/>
				</Td>
				<Td>
					<InputNumber
						bind:value={draft.sizes[selectedSizeIndex].rightChestHeight}
						disabled={!editable}
						classes="w-20"
					/>
				</Td>
			</Tr>
			<Tr>
				<Td>왼어깨</Td>
				<Td>
					<InputNumber
						bind:value={draft.sizes[selectedSizeIndex].leftShoulderWidth}
						disabled={!editable}
						classes="w-20"
					/>
				</Td>
				<Td>
					<InputNumber
						bind:value={draft.sizes[selectedSizeIndex].leftShoulderHeight}
						disabled={!editable}
						classes="w-20"
					/>
				</Td>
			</Tr>
			<Tr>
				<Td>오른어깨</Td>
				<Td>
					<InputNumber
						bind:value={draft.sizes[selectedSizeIndex].rightShoulderWidth}
						disabled={!editable}
						classes="w-20"
					/>
				</Td>
				<Td>
					<InputNumber
						bind:value={draft.sizes[selectedSizeIndex].rightShoulderHeight}
						disabled={!editable}
						classes="w-20"
					/>
				</Td>
			</Tr>
		</Table>

		<Table classes="w-full">
			<Thead>
				<Th classes="w-32">위치</Th>
				<Th classes="w-28">가로 (cm)</Th>
				<Th classes="w-28">세로 (cm)</Th>
			</Thead>

			<Tbody>
				<Tr>
					<Td>엉덩이</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].heapWidth}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].heapHeight}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
				</Tr>
				<Tr>
					<Td>왼바지(중)</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].leftPantMiddleWidth}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].leftPantMiddleHeight}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
				</Tr>
				<Tr>
					<Td>오른바지(중)</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].rightPantMiddleWidth}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].rightPantMiddleHeight}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
				</Tr>
				<Tr>
					<Td>왼바지(하)</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].leftPantLowWidth}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].leftPantLowHeight}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
				</Tr>
				<Tr>
					<Td>오른바지(하)</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].rightPantLowWidth}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].rightPantLowHeight}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
				</Tr>
				<Tr>
					<Td>태극기</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].flagWidth}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
					<Td>
						<InputNumber
							bind:value={draft.sizes[selectedSizeIndex].flagHeight}
							disabled={!editable}
							classes="w-20"
						/>
					</Td>
				</Tr>
			</Tbody>
		</Table>
	</div>
	<div class="mt-4">
		<MdBlack>메모</MdBlack>
		<div class="mt-2">
			<TextArea classes="w-full" bind:value={draft.memo} disabled={!editable} />
		</div>
	</div>
</div>
