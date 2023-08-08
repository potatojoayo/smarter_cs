<script lang="ts">
	import InputText from '../input/InputText.svelte';
	import TextButton from '../buttons/TextButton.svelte';
	import type CsRequest from '$data/classes/CsRequest';
	import type { CsRequestContents } from '$data/classes/CsRequest';

	export let csRequest: CsRequest,
		contents: CsRequestContents,
		editContents: string,
		contentsEditMode;

	async function updateCsRequestContents(contentId: number) {
		if (!editContents) {
			return alert('문의내용을 작성해주세요.');
		}
		if (!confirm('문의내용을 수정하시겠습니까?')) {
			return;
		}

		const { success, csRequestContents } = await csRequest.updateContents({
			contents: editContents,
			contentId
		});

		if (success) {
			const index = csRequest.requestContents.findIndex((c) => c.id === contentId);
			csRequest.requestContents[index] = csRequestContents;
			csRequest.requestContents = csRequest.requestContents;
			editContents = '';
			contentsEditMode = false;
			alert(`성공적으로 문의내용이 수정되었습니다.`);
		} else {
			alert('내용 수정에 실패하였습니다.');
		}
	}
</script>

<div class="my-4 flex space-x-4">
	<InputText classes="w-full" bind:value={editContents} />
	<TextButton
		red
		text="취소"
		on:click={() => {
			editContents = contents.contents;
			contentsEditMode = false;
		}}
	/>
	<TextButton text="저장" on:click={() => updateCsRequestContents(contents.id)} />
</div>
