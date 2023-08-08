<script lang="ts">
	import ModalDialog from '$lib/components/modal/ModalDialog.svelte';
	import DataColumn from '$lib/components/DataColumn.svelte';
	import formatMoney from '$lib/utils/formatMoney';
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import { formatDate } from '$lib/utils/formatDate';
	import { formatPhone } from '$lib/utils/formatPhone';
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import OrderMaster from '$data/classes/OrderMaster';

	export let orderNumber: string;
	export let open = false;
	let orderMaster: OrderMaster;

	$: {
		if (open) {
			OrderMaster.fromOrderNumber(orderNumber).then((om) => (orderMaster = om));
		}
	}
</script>

{#if open && orderMaster}
	<ModalDialog
		title="주문 상세"
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
		<div class="flex justify-between space-x-4">
			<div class="flex flex-col flex-1">
				<DataColumn title="주문번호">
					<MdBlack>
						{orderMaster.orderNumber}
					</MdBlack>
				</DataColumn>
				<DataColumn title="주문날짜">
					<MdBlack>
						{formatDate(orderMaster.dateCreated)}
					</MdBlack>
				</DataColumn>
				<DataColumn title="체육관">
					<MdBlack>
						{orderMaster.gymName}
					</MdBlack>
				</DataColumn>
				<DataColumn title="체육사">
					<MdBlack>
						{orderMaster.agencyName ?? '-'}
					</MdBlack>
				</DataColumn>
				<DataColumn title="주문자">
					<MdBlack>
						{orderMaster.orderer}
					</MdBlack>
				</DataColumn>
				<DataColumn title="전화번호">
					<MdBlack>
						{formatPhone(orderMaster.phone)}
					</MdBlack>
				</DataColumn>
			</div>

			<div class="flex flex-col flex-1">
				<DataColumn title="주문금액 합계">
					<MdBlack>
						{formatMoney({ money: orderMaster.priceTotal })}
					</MdBlack>
				</DataColumn>
				<DataColumn title="배송비">
					<MdBlack>
						{formatMoney({ money: orderMaster.priceDelivery })}
					</MdBlack>
				</DataColumn>
				<DataColumn title="스마터머니">
					<MdBlack>
						{formatMoney({ money: orderMaster.smarterMoney })}
					</MdBlack>
				</DataColumn>
				<DataColumn title="결제할 금액">
					<MdBlack>
						{formatMoney({ money: orderMaster.priceToPay })}
					</MdBlack>
				</DataColumn>
				<DataColumn title="결제방법">
					<MdBlack>
						{orderMaster.paymentMethod ?? '미정'}
					</MdBlack>
				</DataColumn>
				<DataColumn title="결제금액">
					<MdBlack>
						{orderMaster.paidAmount ? formatMoney({ money: orderMaster.paidAmount }) : '0 원'}
					</MdBlack>
				</DataColumn>
				<DataColumn title="결제확인일">
					<MdBlack>
						{orderMaster.datePaid ? formatDate(orderMaster.datePaid) : '-'}
					</MdBlack>
				</DataColumn>
			</div>

			<div class="flex flex-col flex-1">
				<DataColumn title="받는사람">
					<MdBlack>
						{orderMaster.receiver}
					</MdBlack>
				</DataColumn>
				<DataColumn title="주소">
					<MdBlack>
						{`${orderMaster.address} ${orderMaster.detailAddress} (우: ${orderMaster.zipCode})`}
					</MdBlack>
				</DataColumn>
				<DataColumn title="배송요구사항">
					<MdBlack>
						{orderMaster.deliveryRequest ?? ''}
					</MdBlack>
				</DataColumn>
				<DataColumn title="방문수령">
					<MdBlack>
						{orderMaster.isPickUp ? 'O' : 'X'}
					</MdBlack>
				</DataColumn>
				<DataColumn title="메모">
					<MdBlack>
						{orderMaster.memo ?? ''}
					</MdBlack>
				</DataColumn>
			</div>
		</div>
		<div class="my-4">
			<LgBlack>주문상품</LgBlack>
		</div>
		<div>
			<Table classes="w-full">
				<Thead classes="sticky -top-4 ">
					<Th>상품명</Th>
					<Th classes="w-20">색상</Th>
					<Th classes="w-20">사이즈</Th>
					<Th classes="w-32">개당단가</Th>
					<Th classes="w-32">주문수량</Th>
					<Th classes="w-32">작업비합계</Th>
					<Th classes="w-32">총금액</Th>
					<Th classes="w-20">주문상태</Th>
				</Thead>
				<Tbody>
					{#each orderMaster.details as detail}
						<Tr>
							<Td classes="whitespace-nowrap w-full">
								{detail.productName}
							</Td>
							<Td classes="whitespace-nowrap">
								{detail.color}
							</Td>
							<Td>
								{detail.size}
							</Td>
							<Td>
								{formatMoney({ money: detail.priceProduct })}
							</Td>
							<Td>
								{detail.quantity}
							</Td>
							<Td>
								{formatMoney({ money: detail.priceWork })}
							</Td>
							<Td>
								{formatMoney({ money: detail.priceTotal })}
							</Td>
							<Td classes="whitespace-nowrap">
								{detail.state}
							</Td>
						</Tr>
					{/each}
				</Tbody>
			</Table>
		</div>
	</ModalDialog>
{/if}
