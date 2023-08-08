<script lang="ts">
	import type CsRequest from '$data/classes/CsRequest';
	import TextButton from '../buttons/TextButton.svelte';
	import TextArea from '../input/TextArea.svelte';

	export let replyMode: Boolean, csRequest: CsRequest, parentId: number;
	let newReply = '';

	async function createCsRequestReply() {
		if (!newReply) {
			return alert('댓글내용을 작성해주세요.');
		}
		if (!confirm('댓글을 추가하시겠습니까?')) {
			return;
		}
		const { success, reply } = await csRequest.createReply(parentId, newReply);
		if (success) {
			alert(`댓글이 저장되었습니다.`);
			const parent = csRequest.requestContents.find((content) => content.id === parentId);
			if (parent) {
				parent.replies = [...(parent.replies ?? []), reply];
			}
			csRequest.requestContents = csRequest.requestContents;
			newReply = '';
			replyMode = false;
		} else {
			alert('저장이 실패하였습니다.');
		}
	}
</script>

<div class=" w-full flex">
	<div class="w-24" />
	<div class="w-full mb-2 space-y-2 flex flex-col">
		<TextArea bind:value={newReply} placeholder="댓글을 남겨주세요" classes="w-full p-4" />
		<div class="space-x-6 flex justify-end">
			<TextButton
				red
				text="취소"
				on:click={() => {
					newReply = '';
					replyMode = false;
				}}
			/>
			<TextButton text="등록" on:click={() => createCsRequestReply()} />
		</div>
	</div>
</div>
