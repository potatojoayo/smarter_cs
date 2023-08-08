<script lang="ts">
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import type CsRequest from '$data/classes/CsRequest';
	import { formatDate } from '$lib/utils/formatDate.js';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import CsState from '$lib/components/CsState.svelte';
	import Table from '../table/Table.svelte';
	import Thead from '../table/Thead.svelte';
	import Th from '../table/Th.svelte';
	import Tbody from '../table/Tbody.svelte';
	import Tr from '../table/Tr.svelte';
	import Td from '../table/Td.svelte';
	import InquiryDetailContents from './InquiryDetailContents.svelte';
	import MlBlack from '$lib/components/base/MlBlack.svelte';

	export let csRequest: CsRequest;

	let newContents = '',
		isCompleted: boolean;

	$: isCompleted = csRequest.csState === '처리완료';

	async function onCompleteCsRequest() {
		if (!confirm('문의를 처리완료 하시겠습니까?')) {
			return;
		}
		if (await csRequest.update({ csState: '처리완료' })) {
			csRequest.csState = '처리완료';
			alert(`성공적으로 처리완료 되었습니다.`);
			window.history.back();
		} else {
			alert('저장이 실패하였습니다.');
		}
	}

	async function createCsRequestContents() {
		if (!newContents) {
			return alert('문의내용을 작성해주세요.');
		}
		if (!confirm('문의내용을 추가하시겠습니까?')) {
			return;
		}
		const { success, csRequestContents } = await csRequest.createContents({
			contents: newContents
		});
		if (success) {
			csRequest.requestContents = csRequestContents;
			newContents = '';
			alert(`성공적으로 문의내용이 추가되었습니다.`);
		} else {
			alert('추가에 실패하였습니다.');
		}
	}
</script>

<div class="flex flex-col p-8 border rounded bg-white">
	<LgBlack>문의사항</LgBlack>
	<Table classes="full mt-4">
		<Thead>
			<Th classes="w-28">문의번호</Th>
			<Th classes="w-28">접수일자</Th>
			<Th classes="w-20">CS구분</Th>
			<Th classes="w-20">사유</Th>
			<Th classes="w-28">주문번호</Th>
			<Th classes="w-24">주문상태</Th>
			<Th classes="w-32">처리상태</Th>
		</Thead>
		<Tbody>
			<Tr>
				<Td>{csRequest.requestNumber}</Td>
				<Td>{formatDate(csRequest.dateRequested)}</Td>
				<Td>{csRequest.category}</Td>
				<Td>{csRequest.reason ?? '-'}</Td>
				<Td>{csRequest.orderNumber ?? '-'}</Td>
				<Td>{csRequest.orderState ?? '-'}</Td>
				<Td>
					<div class="flex justify-between items-center">
						<CsState state={csRequest.csState} />
						{#if csRequest.csState === '미처리'}
							<TextButton text="처리완료" on:click={onCompleteCsRequest} disabled={isCompleted} />
						{/if}
					</div>
				</Td>
			</Tr>
		</Tbody>
	</Table>

	<div class="felx mt-6">
		<MlBlack text="문의내용" />
		<div class="mt-2 space-y-4 flex flex-col w-full border-t">
			{#each csRequest.requestContents as contents}
				<InquiryDetailContents bind:csRequest bind:contents {isCompleted} />
			{/each}
			{#if !isCompleted}
				<MlBlack>추가문의</MlBlack>
				<div class="flex space-x-4">
					<div class="w-full">
						<TextArea bind:value={newContents} classes="w-full" />
					</div>
				</div>
				<div class="flex justify-end space-x-4">
					<TextButton
						text="취소"
						red
						on:click={() => {
							newContents = '';
						}}
					/>
					<TextButton text="등록" on:click={createCsRequestContents} />
				</div>
			{/if}
		</div>
	</div>
</div>
