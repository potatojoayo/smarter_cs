<script lang="ts">
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import type OrderDetail from '$data/classes/OrderDetail';

	export let name: string,
		editable = false,
		onDelete: (name) => void,
		orderDetail: OrderDetail;

	let editing = false,
		editedValue = name;

	function handleEditButtonClick() {
		editing = true;
	}

	function handleEditCancelButtonClick() {
		editing = false;
	}

	async function handleEditSaveButtonClick() {
		if (!confirm('학생 이름을 변경하시겠습니까?')) return;
		const { success, message } = await orderDetail.changeStudentName({
			changedName: name,
			changingName: editedValue
		});
		alert(message);
		if (success) {
			name = editedValue;
			editing = false;
		}
	}
</script>

<div class="px-2 py-1 rounded bg-yellow-200 flex space-x-2 items-center h-9">
	{#if editing}
		<InputText bind:value={editedValue} classes="w-20 h-8 bg-gray-100" />
		<TextButton red on:click={handleEditCancelButtonClick}>취소</TextButton>
		<TextButton on:click={handleEditSaveButtonClick}>저장</TextButton>
	{:else}
		<MdBlack>
			{name}
		</MdBlack>
		{#if editable}
			<button class="fa-solid fa-pen" on:click={handleEditButtonClick} />
			<button class="fa-solid fa-circle-x" on:click={() => onDelete(name)} />
		{/if}
	{/if}
</div>
