<script lang="ts">
	import DataColumn from '$lib/components/DataColumn.svelte';
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import InputMoney from '$lib/components/input/InputMoney.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import { formatDate } from '$lib/utils/formatDate';
	import formatMoney from '$lib/utils/formatMoney';
	import { formatPhone } from '$lib/utils/formatPhone';
	import type { PageData } from './$types';

	export let data: PageData;

	$: {
		data.taOrderMaster.totalPriceSpecial = data.taOrderMaster.taOrderDetails.reduce(
			(pre, next) => pre + next.priceSpecial * next.quantity,
			0
		);
		data.taOrderMaster.priceToBePaid =
			data.taOrderMaster.totalPriceSpecial -
			data.taOrderMaster.pricePaid +
			data.taOrderMaster.priceDelivery;
	}
	async function handleSave() {
		if (!confirm('저장하시겠습니까?')) return;

		const { success, message } = await data.taOrderMaster.update();

		alert(message);

		if (success) {
			window.history.back();
		}
	}
</script>

<div class="flex flex-col border rounded bg-white">
	<div class="p-4 border-b w-full">
		<LgBlack>주문정보</LgBlack>
	</div>
	<div class="flex flex-col px-8 pb-8 pt-4">
		<div class="flex justify-between space-x-8">
			<div class="flex flex-col flex-1">
				<DataColumn title="주문번호">
					<MdBlack>
						{data.taOrderMaster.orderNumber}
					</MdBlack>
				</DataColumn>
				<DataColumn title="주문날짜"
					><MdBlack>
						{formatDate(data.taOrderMaster.dateOrdered)}
					</MdBlack>
				</DataColumn>
				<DataColumn title="체육관"
					><MdBlack>
						{data.taOrderMaster.gymName}
					</MdBlack>
				</DataColumn>
				<DataColumn title="TA상사"
					><MdBlack>
						{data.taOrderMaster.taName}
					</MdBlack>
				</DataColumn>
				<DataColumn title="주문자"
					><MdBlack>
						{data.taOrderMaster.ordererName}
					</MdBlack>
				</DataColumn>
				<DataColumn title="전화번호"
					><MdBlack>
						{formatPhone(data.taOrderMaster.phone)}
					</MdBlack>
				</DataColumn>
			</div>
			<div class="flex flex-col flex-1">
				<DataColumn title="배송지 주소">
					<MdBlack>
						{data.taOrderMaster.address}
					</MdBlack>
				</DataColumn>
				<DataColumn title="상세 주소">
					<MdBlack>
						{data.taOrderMaster.detailAddress}
					</MdBlack>
				</DataColumn>
				<DataColumn title="우편번호">
					<MdBlack>
						{data.taOrderMaster.zipCode}
					</MdBlack>
				</DataColumn>
				<DataColumn title="받는사람">
					<MdBlack>
						{data.taOrderMaster.receiver}
					</MdBlack>
				</DataColumn>
				<DataColumn title="방문수령">
					<MdBlack>
						{data.taOrderMaster.isPickUp ? 'O' : 'X'}
					</MdBlack>
				</DataColumn>
			</div>
		</div>
		<div class="my-4">
			<LgBlack>주문상품 목록</LgBlack>
		</div>
		<div class="flex flex-col">
			<Table>
				<Thead>
					<Th classes="w-40">상품이미지</Th>
					<Th>상품명</Th>
					<Th classes="w-24">색상</Th>
					<Th classes="w-24">사이즈</Th>
					<Th classes="w-32">체육관가</Th>
					<Th classes="w-32">작업비</Th>
					<Th classes="w-32">특판가</Th>
					<Th classes="w-24">주문수량</Th>
					<Th classes="w-40">체육관가(+작업비) 합계</Th>
					<Th classes="w-32">특판가 합계</Th>
				</Thead>
				<Tbody>
					{#each data.taOrderMaster.taOrderDetails as detail (detail.id)}
						<Tr>
							<Td>
								<img src={detail.productImage} alt="detail image {detail.id}" />
							</Td>
							<Td>
								{detail.productName}
							</Td>
							<Td>
								{detail.color}
							</Td>
							<Td>
								{detail.size}
							</Td>
							<Td>
								{formatMoney({ money: detail.priceGym })}
							</Td>
							<Td>
								{formatMoney({ money: detail.priceWork })}
							</Td>
							<Td>
								<div class="flex items-center space-x-2">
									<InputMoney bind:value={detail.priceSpecial} classes="w-full" />
									<MdBlack>원</MdBlack>
								</div>
							</Td>
							<Td>
								{detail.quantity}
							</Td>
							<Td>
								{formatMoney({ money: (detail.priceGym + detail.priceWork) * detail.quantity })}
							</Td>
							<Td>
								{formatMoney({ money: detail.priceSpecial * detail.quantity })}
							</Td>
						</Tr>
					{/each}
					<Tr>
						<Td colspan="6" />
						<Td>
							<LgBlack>합계</LgBlack>
						</Td>
						<Td
							>{data.taOrderMaster.taOrderDetails.reduce((pre, next) => pre + next.quantity, 0)}</Td
						>
						<Td
							>{formatMoney({
								money: data.taOrderMaster.taOrderDetails.reduce(
									(pre, next) => pre + (next.priceGym + next.priceWork) * next.quantity,
									0
								)
							})}</Td
						>
						<Td
							>{formatMoney({
								money: data.taOrderMaster.totalPriceSpecial
							})}</Td
						>
					</Tr>
					<Tr>
						<Td colspan="8" />
						<Td>
							<LgBlack>배송비</LgBlack>
						</Td>
						<Td classes="flex items-center space-x-2">
							<LgBlack>+</LgBlack>
							<InputMoney bind:value={data.taOrderMaster.priceDelivery} classes="w-24" />
							<LgBlack>원</LgBlack>
						</Td>
					</Tr>
					<Tr>
						<Td colspan="8" />
						<Td>
							<LgBlack>입금액</LgBlack>
						</Td>
						<Td classes="flex items-center space-x-2">
							<LgBlack>-</LgBlack>
							<InputMoney bind:value={data.taOrderMaster.pricePaid} classes="w-24" />
							<LgBlack>원</LgBlack>
						</Td>
					</Tr>
					<Tr>
						<Td colspan="8" />
						<Td>
							<LgBlack>입금요청금액</LgBlack>
						</Td>
						<Td>
							{formatMoney({ money: data.taOrderMaster.priceToBePaid })}
						</Td>
					</Tr>
				</Tbody>
			</Table>
			<Button classes="ml-auto mt-8" text="저장" on:click={handleSave} />
		</div>
	</div>
</div>
