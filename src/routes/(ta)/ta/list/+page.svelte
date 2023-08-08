<script lang="ts">
	import { goto } from '$app/navigation';
	import TaOrderMaster from '$data/classes/TaOrderMaster';
	import TaOrderState from '$lib/components/TaOrderState.svelte';
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import MdGray from '$lib/components/base/MdGray.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import DropdownSelect from '$lib/components/input/DropdownSelect.svelte';
	import InputDate from '$lib/components/input/InputDate.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	import { formatDate } from '$lib/utils/formatDate';
	import formatMoney from '$lib/utils/formatMoney';
	import type { PageData } from './$types';

	export let data: PageData;

	let keyword = '',
		taOrderMasters: TaOrderMaster[] = [],
		totalCount: number = 0;

	$: {
		taOrderMasters = data.myTaOrderMasters.taOrderMasters.map((t) => new TaOrderMaster(t));
		totalCount = data.myTaOrderMasters.totalCount;
	}
</script>

<div class="flex flex-col border rounded bg-white">
	<div class="p-4 border-b w-full">
		<LgBlack>주문관리</LgBlack>
	</div>
	<div class="flex flex-col px-8 pb-8 pt-4">
		<div class="flex space-x-8">
			<div class="flex flex-col w-fit">
				<MdGray text="회원검색" />
				<div class="flex space-x-2 items-end">
					<InputText
						placeholder="체육관명, 관장이름, 휴대폰번호"
						classes="w-60 mt-2"
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

			<div class="flex flex-col">
				<MdGray text="결제상태" />
				<DropdownSelect
					classes="mt-2"
					options={['전체', '미결제', '결제완료']}
					onSelect={(selected) => {
						changeSearchParam({ value: selected, param: 'state' });
					}}
				/>
			</div>

			<div class="flex flex-col">
				<MdGray text="접수일" />
				<div class="flex space-x-4 items-center">
					<InputDate
						classes="mt-2"
						onChange={(value) => {
							changeSearchParam({ param: 'start', value });
						}}
					/>
					<span class="text-2xl">~</span>
					<InputDate
						classes="mt-2"
						onChange={(value) => {
							changeSearchParam({ param: 'end', value });
						}}
					/>
				</div>
			</div>
		</div>
		<Table classes="my-8">
			<Thead>
				<Th classes="w-40">주문번호</Th>
				<Th classes="w-32">주문일자</Th>
				<Th classes="w-28">결제상태</Th>
				<Th>체육관명</Th>
				<Th classes="w-32">체육관가 합계</Th>
				<Th classes="w-32">특판가 합계</Th>
				<Th classes="w-32">배송비</Th>
				<Th classes="w-32">입금액</Th>
				<Th classes="w-32">입금요청금액</Th>
			</Thead>
			{#each taOrderMasters as order (order.id)}
				<Tr
					onClick={() => {
						goto(order.id.toString());
					}}
				>
					<Td>
						{order.orderNumber}
					</Td>
					<Td>
						{formatDate(order.dateOrdered)}
					</Td>
					<Td>
						<TaOrderState state={order.state} />
					</Td>
					<Td>
						{order.gymName}
					</Td>
					<Td>
						{formatMoney({ money: order.totalPriceGym })}
					</Td>
					<Td>
						{formatMoney({ money: order.totalPriceSpecial })}
					</Td>
					<Td>
						{formatMoney({ money: order.priceDelivery })}
					</Td>
					<Td>
						{formatMoney({ money: order.pricePaid })}
					</Td>
					<Td>
						{formatMoney({ money: order.priceToBePaid })}
					</Td>
				</Tr>
			{/each}
		</Table>
		<Pagination {totalCount} />
	</div>
</div>
