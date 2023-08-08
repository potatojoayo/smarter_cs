<script lang="ts">
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import { onMount } from 'svelte';
	import Table from '../table/Table.svelte';
	import Tbody from '../table/Tbody.svelte';
	import Td from '../table/Td.svelte';
	import Th from '../table/Th.svelte';
	import Thead from '../table/Thead.svelte';
	import Tr from '../table/Tr.svelte';
	import OrderDetailState from '$lib/components/OrderDetailState.svelte';
	import ModalDialog from './ModalDialog.svelte';
	import OrderService from '$data/services/OrderService';
	import type Directions from '$data/classes/Directions';
	export let open = false,
		detailWorkId = 0;
	let detailWorks: Directions[] = [],
		memoBySubcontractor = '',
		memoByAdmin = '',
		memoByPreWorker = '';

	onMount(() => {
		if (detailWorkId) {
			OrderService.workById({ workId: detailWorkId }).then((res) => {
				detailWorks = res.details;
				detailWorks[0].state;
				memoBySubcontractor = res.memoBySubcontractor;
				memoByAdmin = res.memoByAdmin;
				memoByPreWorker = res.memoByPreWorker;
			});
		}
	});

	function getRowSpan(work: Directions) {
		return detailWorks.filter((d) => d.draftId === work.draftId).length;
	}
</script>

<ModalDialog
	title="작업지시서 상세"
	bind:open
	buttons={[
		new ModalButton({
			title: '확인',
			color: ButtonColor.blue,
			onClick: () => {
				open = false;
			}
		})
	]}
>
	<div class="min-w-[1200px] flex flex-col space-x-2">
		<div class="flex flex-col flex-1">
			<Table>
				<Thead>
					<Tr classes="pointer-events-none">
						<Th classes="w-40 pl-2">상품</Th>
						<Th classes="w-40 pl-2">로고시안</Th>
						<Th classes="w-16 pl-2">폰트</Th>
						<Th classes="w-20 pl-2">실색깔</Th>
						<Th classes="w-20 pl-2">프린팅</Th>
						<Th classes="w-24 pl-2">색상</Th>
						<Th classes="w-24 pl-2">사이즈</Th>
						<Th classes="w-24 pl-2">수량</Th>
						<Th classes="w-40 pl-2">이름</Th>
						<Th classes="w-28 pl-2">주문상태</Th>
					</Tr>
				</Thead>
				<Tbody>
					{#each detailWorks as work, index}
						<Tr
							classes={index === 0 || detailWorks[index - 1].draftId !== work.draftId
								? 'border-t pointer-events-none'
								: 'pointer-events-none'}
						>
							{#if index === 0 || detailWorks[index - 1].productName !== work.productName}
								<Td rowspan={getRowSpan(work)} classes="border text-center pr-0">
									<img src={work.productMasterThumbnail} alt="" />
									<div class="mt-2">
										{work.productName}
									</div>
								</Td>
								<Td rowspan={getRowSpan(work)} classes="border pr-0">
									<img src={work.draftImage} class="w-28 mx-auto mb-2" alt="" />
								</Td>
								<Td rowspan={getRowSpan(work)} classes="border whitespace-nowrap">
									{work.draftFont ?? '-'}
								</Td>
								<Td rowspan={getRowSpan(work)} classes="border whitespace-nowrap">
									{work.draftThreadColor ?? '-'}
								</Td>
								<Td rowspan={getRowSpan(work)} classes="border whitespace-nowrap"
									>{work.draftPrinting ?? '-'}</Td
								>
							{/if}
							<Td classes="whitespace-nowrap  pl-2">{work.productColor}</Td>
							<Td classes="pl-2">{work.productSize}</Td>
							<Td classes="pl-2">{work.quantity}</Td>
							<Td classes="pl-2">{work.studentNames}</Td>
							<Td classes="pl-2">
								<OrderDetailState state={work.state} />
							</Td>
						</Tr>
					{/each}
				</Tbody>
			</Table>
		</div>

		<div class="mt-5">작업실 메모</div>
		<textarea class="mt-5 border rounded" bind:value={memoBySubcontractor} disabled />

		<div class="mt-5">전처리작업실 메모</div>
		<textarea class="mt-5 border rounded" bind:value={memoByPreWorker} disabled />

		<div class="mt-5">관리자 메모</div>
		<textarea class="mt-5 mb-5 border rounded" bind:value={memoByAdmin} disabled />
	</div>
</ModalDialog>
