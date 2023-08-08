<script lang="ts">
	import type CsRequest from '$data/classes/CsRequest';
	import type { CsRequestContents } from '$data/classes/CsRequest';
	import { formatDate } from '$lib/utils/formatDate';
	import MdBlack from '../base/MdBlack.svelte';
	import MdLightGray from '../base/MdLightGray.svelte';
	import InpuiryDetailContentsButtonOptions from './InpuiryDetailContentsButtonOptions.svelte';
	import InpuiryDetailReply from './InpuiryDetailReply.svelte';
	import InquiryDetailContentsUpdate from './InquiryDetailContentsUpdate.svelte';
	import InpuiryDetailReplyCreate from './InpuiryDetailReplyCreate.svelte';

	export let contents: CsRequestContents, csRequest: CsRequest, isCompleted: boolean;
	let editContents = '',
		parentId: number,
		replyMode = false,
		contentsEditMode = false,
		replyEditMode = false;
</script>

<div class=" space-y-2 flex flex-col justify-start">
	<div class="pb-2 space-y-2 flex flex-col border-b">
		{#if contentsEditMode && parentId === contents.id}
			<InquiryDetailContentsUpdate
				bind:csRequest
				bind:contents
				bind:editContents
				bind:contentsEditMode
			/>
		{:else}
			<div class="flex space-x-2 items-center">
				<MdLightGray>{new Date(contents.dateCreated).toLocaleString()}</MdLightGray>
				<InpuiryDetailContentsButtonOptions
					bind:csRequest
					{contents}
					bind:contentsEditMode
					bind:replyMode
					bind:parentId
					{isCompleted}
					bind:editContents
				/>
			</div>
			<MdBlack>{contents.contents}</MdBlack>
		{/if}
	</div>

	{#if contents.replies}
		{#each contents.replies as reply}
			<InpuiryDetailReply
				bind:replyEditMode
				{reply}
				bind:csRequest
				{contents}
				{isCompleted}
				bind:parentId
			/>
		{/each}
		{#if parentId === contents.id && replyMode}
			<InpuiryDetailReplyCreate bind:replyMode bind:csRequest bind:parentId />
		{/if}
	{/if}
</div>
