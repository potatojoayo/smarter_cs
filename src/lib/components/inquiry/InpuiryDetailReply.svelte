<script lang="ts">
	import type { CsRequestContents } from '$data/classes/CsRequest';
	import type CsRequest from '$data/classes/CsRequest';
	import { formatDate } from '$lib/utils/formatDate';
	import MdBlack from '../base/MdBlack.svelte';
	import MdLightGray from '../base/MdLightGray.svelte';
	import TextButton from '../buttons/TextButton.svelte';
	import InputText from '../input/InputText.svelte';

	export let csRequest: CsRequest,
		contents: CsRequestContents,
		replyEditMode: boolean,
		reply: CsRequestContents,
		isCompleted: boolean,
		parentId: number;
	let editReplyContents: string, replyId: number;

	async function updateCsRequestReply(replyId: number, parentId: number) {
		if (!editReplyContents) {
			return alert('댓글내용을 작성해주세요.');
		}
		if (!confirm('댓글을 수정하시겠습니까?')) {
			return;
		}

		const { success, reply } = await csRequest.updateReply({
			replyId,
			contents: editReplyContents
		});
		if (success) {
			const parent = csRequest.requestContents.find((content) => content.id === parentId);
			if (parent) {
				parent.replies = [...(parent.replies?.filter((c) => c.id !== replyId) ?? []), reply];
			}
			csRequest.requestContents = csRequest.requestContents;
			editReplyContents = '';
			replyEditMode = false;
			alert(`성공적으로 댓글내용이 수정되었습니다.`);
		} else {
			alert('댓글 수정에 실패하였습니다.');
		}
	}

	async function deleteCsRequestReply(id: number, parentId: number) {
		if (!confirm('댓글을 삭제하시겠습니까?')) {
			return;
		}
		const success = await csRequest.deleteReply(id);
		if (success) {
			const parent = csRequest.requestContents.find((content) => content.id === parentId);
			if (parent) {
				parent.replies = [...(parent.replies?.filter((c) => c.id !== id) ?? [])];
			}
			csRequest.requestContents = csRequest.requestContents;
			alert(`성공적으로 댓글이 삭제되었습니다.`);
		} else {
			alert('삭제가 실패하였습니다.');
		}
	}
</script>

<div class=" flex justify-start">
	<div class="w-24 pr-2 text-right text-gray-600 flex justify-end items-center">ㄴ</div>
	{#if replyEditMode && reply.id === replyId}
		<div class="w-full my-4 flex space-x-4">
			<InputText classes="w-full" bind:value={editReplyContents} />
			<TextButton
				red
				text="취소"
				on:click={() => {
					editReplyContents = reply.contents;
					replyEditMode = false;
				}}
			/>
			<TextButton text="저장" on:click={() => updateCsRequestReply(reply.id, contents.id)} />
		</div>
	{:else}
		<div class="w-full pb-2 px-4 flex flex-col bg-gray-100 mt-1">
			{#if !isCompleted}
				<div class="flex space-x-2 justify-start items-center">
					<MdLightGray text={new Date(reply.dateCreated).toLocaleString()} />
					<TextButton
						disabled={isCompleted}
						on:click={() => {
							replyEditMode = true;
							editReplyContents = reply.contents;
							replyId = reply.id;
						}}
					>
						<MdBlack>수정</MdBlack>
					</TextButton>
					<TextButton
						red
						disabled={isCompleted}
						on:click={() => {
							if (reply.id) deleteCsRequestReply(reply.id, parentId);
						}}
					>
						<MdBlack>삭제</MdBlack>
						<i class="fa-regular fa-x text-xs text-gray-800" />
					</TextButton>
				</div>
			{/if}
			<MdBlack classes=" whitespace-pre-line" text={reply.contents} />
		</div>
	{/if}
</div>
