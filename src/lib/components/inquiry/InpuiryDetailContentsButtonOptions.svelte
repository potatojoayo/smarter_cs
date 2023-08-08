<script lang="ts">
	import TextButton from '../buttons/TextButton.svelte';
	import type CsRequest from '$data/classes/CsRequest';
	import type { CsRequestContents } from '$data/classes/CsRequest';
	import MdBlack from '$lib/components/base/MdBlack.svelte';

	export let csRequest: CsRequest,
		contents: CsRequestContents,
		replyMode: boolean,
		contentsEditMode,
		isCompleted: boolean,
		editContents: string,
		parentId;

	async function deleteCsRequestContents(id: number) {
		if (!confirm('문의내용을 삭제하시겠습니까?')) {
			return;
		}
		const { success, csRequestContents } = await csRequest.deleteContents({ id });
		if (success) {
			csRequest.requestContents = csRequest.requestContents.filter((c) => c.id !== id);
			csRequest.requestContents = csRequest.requestContents;
			alert(`성공적으로 문의내용이 삭제되었습니다.`);
		} else {
			alert('삭제가 실패하였습니다.');
		}
	}
</script>

{#if !isCompleted}
	<TextButton
		on:click={() => {
			parentId = contents.id;
			replyMode = true;
		}}
	>
		<i class="fa-regular fa-comment text-gray-800" />
		<MdBlack>댓글쓰기</MdBlack>
	</TextButton>
	<div>|</div>
	<TextButton
		disabled={isCompleted}
		on:click={() => {
			editContents = contents.contents;
			parentId = contents.id;
			contentsEditMode = true;
		}}
	>
		<MdBlack>수정</MdBlack>
	</TextButton>
	<div>|</div>
	<TextButton
		classes="space-x-1"
		disabled={isCompleted}
		on:click={() => {
			if (contents.id) deleteCsRequestContents(contents.id);
		}}
	>
		<MdBlack>삭제</MdBlack>
		<i class="fa-regular fa-x text-xs text-gray-800" />
	</TextButton>
{/if}
