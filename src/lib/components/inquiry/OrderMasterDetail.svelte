<script lang="ts">
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import type OrderMaster from '$data/classes/OrderMaster';
	import DataColumn from '$lib/components/DataColumn.svelte';
	import { formatDate } from '$lib/utils/formatDate.js';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import { formatPhone } from '$lib/utils/formatPhone.js';
	import formatMoney from '$lib/utils/formatMoney';
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import { deleteSearchParams } from '$lib/utils/deleteSearchParams';
	import DraftDetailModal from '$lib/components/modal/DraftDetailModal.svelte';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	import type CsRequest from '$data/classes/CsRequest';
	import InputNumber from '$lib/components/input/InputNumber.svelte';
	import type OrderDetail from '$data/classes/OrderDetail';
	import { gql } from 'graphql-request';
	import HttpClient from '$data/graphql/client';
	import Button from '$lib/components/buttons/Button.svelte';
	import CreateReturnRequestModal from '$lib/components/modal/CreateReturnRequestModal.svelte';
	import type Customer from '$data/classes/Customer';
	import CreateChangeRequestModal from '$lib/components/modal/CreateChangeRequestModal.svelte';
	import MdGray from '../base/MdGray.svelte';
	import OrderDetailState from '$lib/components/OrderDetailState.svelte';
	import DeliveryModal from '../modal/DeliveryModal.svelte';
	import { UNEDITABLE_STATES } from '$data/consts/UNEDITABLE_STATES';
	import OrderService from '$data/services/OrderService';
	import type { ChangeEventHandler } from 'svelte/elements';
	import DirectionModal from '../modal/DirectionModal.svelte';
	import UsedCouponModal from '$lib/components/modal/UsedCouponModal.svelte';
	import OrderMasterDetailModal from '$lib/components/modal/OrderMasterDetailModal.svelte';
	import StudentNames from '$lib/components/inquiry/StudentNames.svelte';

	export let orderMaster: OrderMaster,
		editable = false,
		back = false,
		csRequest: CsRequest | undefined = undefined,
		isDifferent = false,
		changeModalOpen = false,
		additionalOrderModalOpen = false,
		directionModalOpen = false,
		customer: Customer | undefined = undefined,
		select = false;

	let draftId: number,
		quantities: number[],
		draftDialogOpen = false,
		deliveryModalOpen = false,
		returnModalOpen = false,
		selectedOrderDetail: OrderDetail,
		selectedAdditionalOrderNumber: string,
		detailWorkId: number,
		usedCouponModalOpen = false;

	$: {
		quantities = orderMaster.details?.map((d) => d.quantity) ?? [];
	}

	function handleBackButtonClick() {
		deleteSearchParams({
			deleteParams: ['orderMasterId']
		});
	}

	function openDraftModal(selectedDraftId: number) {
		draftId = selectedDraftId;
		draftDialogOpen = true;
	}

	function openDirectionModal(workId: number) {
		detailWorkId = workId;
		directionModalOpen = true;
	}

	function changeSelectedOrderMaster() {
		changeSearchParam({
			param: 'mode',
			value: 'Order',
			invalidateAll: true,
			deleteParams: ['orderMasterId']
		});
	}

	async function cancelOrder() {
		if (!confirm('주문을 취소하시겠습니까?')) return;
		const { success, message } = await csRequest!.cancelOrder();
		alert(message);
		if (success) {
			await changeSearchParam({
				param: '',
				value: '',
				invalidateAll: true
			});
		}
	}

	async function selectOrderMaster() {
		if (!confirm('문의에 대한 주문을 변경하시겠습니까?')) return;
		if (await csRequest!.update({ orderMasterId: orderMaster.id })) {
			alert(`주문이 변경되었습니다.`);
			await changeSearchParam({
				param: 'mode',
				value: 'Default',
				deleteParams: ['orderMasterId'],
				invalidateAll: true
			});
		} else {
			alert('주문 변경이 실패하였습니다.');
		}
	}

	async function reduceQuantity({
		orderDetail,
		newQuantity
	}: {
		orderDetail: OrderDetail;
		newQuantity: number;
	}) {
		if (!confirm(`${orderDetail.productName}의 주문수량을 변경하시겠습니까?`)) return;

		const ChangeOrderDetailQuantity = gql`
			mutation ChangeOrderDetailQuantity(
				$csRequestId: Int
				$orderDetailId: Int
				$newQuantity: Int
			) {
				changeOrderDetailQuantity(
					csRequestId: $csRequestId
					orderDetailId: $orderDetailId
					newQuantity: $newQuantity
				) {
					success
					message
				}
			}
		`;
		const client = HttpClient.getInstance();
		const result = (await client.request(ChangeOrderDetailQuantity, {
			csRequestId: csRequest!.id,
			orderDetailId: orderDetail.id,
			newQuantity: newQuantity
		})) as {
			changeOrderDetailQuantity: {
				success: boolean;
				message: string;
			};
		};
		const { message, success } = result.changeOrderDetailQuantity;
		alert(message);
		if (success) {
			await changeSearchParam({ param: '', value: '', invalidateAll: true, noScroll: true });
		}
	}

	function additionalOrder() {
		changeSearchParam({ param: 'mode', value: 'AdditionalOrder', noScroll: true });
	}

	async function partialCancel() {
		if (!confirm('선택하신 주문들을 취소하시겠습니까?')) return;
		if (!orderMaster || !orderMaster.details) return alert('주문이 없습니다.');
		const orderDetailIds = orderMaster.details.filter((d) => d.checked).map((d) => d.id);
		if (orderDetailIds.length === 0) return alert('취소하실 주문을 선택해주세요.');
		const { success, message } = await csRequest!.partialCancelOrders({
			orderDetailIds
		});
		alert(message);
		if (success) {
			await changeSearchParam({ param: '', value: '', invalidateAll: true, noScroll: true });
		}
	}

	function changeOrders() {
		if (!orderMaster || !orderMaster.details) return alert('주문이 없습니다.');
		if (orderMaster.details.filter((d) => d.checked).length === 0)
			return alert('교환하실 주문을 선택해주세요.');
		changeModalOpen = true;
	}

	function returnOrders() {
		if (!orderMaster || !orderMaster.details) return alert('주문이 없습니다.');
		if (orderMaster.details.filter((d) => d.checked).length === 0)
			return alert('반품하실 주문을 선택해주세요.');
		returnModalOpen = true;
	}

	function handleShippedStateClick(orderDetail: OrderDetail) {
		const isShipped = ['배송중', '배송완료'].includes(orderDetail.state);
		if (!isShipped) return;
		deliveryModalOpen = true;
		selectedOrderDetail = orderDetail;
	}

	async function wrongDelivery() {
		if (!orderMaster || !orderMaster.details) return alert('주문이 없습니다.');
		if (orderMaster.details.filter((d) => d.checked).length === 0)
			return alert('오배송 처리하실 주문을 선택해주세요.');
		if (!confirm('선택하신 주문을 오배송처리 하시겠습니까?')) return;
		const { success, message } = await OrderService.wrongDelivery({
			orderMasterId: orderMaster.id,
			orderDetailIds: orderMaster.details.filter((d) => d.checked).map((d) => d.id)
		});
		alert(message);
		if (success) {
			changeSearchParam({ param: '', value: '', invalidateAll: true });
		}
	}

	const handleCheckAllChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
		const checked = e.currentTarget.checked;
		if (!orderMaster.details) return;
		orderMaster.details.forEach((d) => {
			if (!UNEDITABLE_STATES.includes(d.state)) {
				d.checked = checked;
			}
		});
		orderMaster = orderMaster;
	};

	function handleAdditionalOrderNumberClick(orderNumber: string) {
		selectedAdditionalOrderNumber = orderNumber;
		additionalOrderModalOpen = true;
	}

	function onClickCouponModal(orderMaster: OrderMaster) {
		orderMaster = orderMaster;
		usedCouponModalOpen = true;
	}
</script>

<div class="flex flex-col p-8 border rounded bg-white">
	<div class="flex justify-between">
		{#if back}
			<button on:click={handleBackButtonClick} class="flex space-x-2 items-center">
				<i class="fa-regular fa-arrow-left text-gray-700 text-2xl" />
				<LgBlack>주문상세</LgBlack>
			</button>
		{:else}
			<LgBlack>주문상세</LgBlack>
		{/if}
		<div class="flex space-x-8">
			{#if isDifferent}
				<TextButton classes="font-bold text-base" on:click={selectOrderMaster} text="주문선택" />
			{:else if select}
				<TextButton
					classes="font-bold text-base"
					on:click={changeSelectedOrderMaster}
					text="다른 주문 선택"
				/>
			{/if}
			{#if editable && csRequest.orderState !== '주문취소'}
				<TextButton classes="font-bold text-base" red on:click={cancelOrder} text="주문취소" />
				{#if !orderMaster.isChild}
					<TextButton classes="font-bold text-base" on:click={additionalOrder} text="추가주문" />
				{/if}
			{/if}
		</div>
	</div>

	<div class="mt-4 flex justify-between space-x-16">
		<div class="flex flex-col flex-1">
			<DataColumn title="주문번호">
				<MdBlack>
					{orderMaster.orderNumber}
					{orderMaster.isChild ? '(추가주문)' : ''}
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
			<DataColumn title="쿠폰">
				<MdBlack>
					{#if orderMaster.couponPrice}
						<TextButton
							text={formatMoney({ money: orderMaster.couponPrice })}
							on:click={() => onClickCouponModal(orderMaster)}
						/>
					{:else}
						-
					{/if}
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
		<div class="flex justify-between">
			<LgBlack>주문상품</LgBlack>
			{#if editable}
				<div class="flex space-x-2">
					<Button text="오배송" red on:click={wrongDelivery} />
					<Button text="부분취소" red on:click={partialCancel} />
					<Button text="교환" on:click={changeOrders} />
					<Button text="반품" on:click={returnOrders} />
				</div>
			{/if}
		</div>
	</div>
	<div>
		<Table classes="w-full">
			<Thead classes="sticky top-16">
				{#if editable}
					<Th classes="w-10">
						<input type="checkbox" name="all" class="w-4 h-4" on:change={handleCheckAllChange} />
					</Th>
				{/if}
				<Th>상품명</Th>
				<Th classes="w-20 pl-2">색상</Th>
				<Th classes="w-20">사이즈</Th>
				<Th classes="w-28">개당단가</Th>
				<Th classes="w-32">작업비</Th>
				<Th classes="w-20">주문수량</Th>
				<Th classes="w-32">총금액</Th>
				<Th classes="w-28">주문상태</Th>
				<Th classes="w-20" />
				<Th classes="w-20" />
				{#if editable}
					<Th classes="w-20" />
				{/if}
			</Thead>
			<Tbody>
				{#if orderMaster.details}
					{#each orderMaster.details as detail, index (detail.id)}
						<Tr
							onClick={editable
								? () => {
										if (!UNEDITABLE_STATES.includes(detail.state)) {
											detail.checked = !detail.checked;
										}
								  }
								: null}
						>
							{#if editable}
								<Td rowspan={detail.hasStudentNames() ? '2' : '1'}>
									<div>
										<input
											type="checkbox"
											class="w-4 h-4"
											bind:checked={detail.checked}
											disabled={UNEDITABLE_STATES.includes(detail.state)}
										/>
									</div>
								</Td>
							{/if}
							<Td
								rowspan={detail.hasStudentNames() ? '2' : '1'}
								classes={detail.hasStudentNames() ? 'border-r' : ''}
							>
								{detail.productName}
							</Td>
							<Td classes="pl-2">
								{detail.color}
							</Td>
							<Td>
								{detail.size}
							</Td>
							<Td>
								{formatMoney({ money: detail.priceProduct })}
							</Td>
							<Td>
								{formatMoney({ money: detail.priceWork })}
							</Td>
							<Td>
								{#if editable && !UNEDITABLE_STATES.includes(detail.state) && !detail.hasStudentNames()}
									<div class="flex space-x-2 items-center">
										<button
											class="z-20"
											class:invisible={quantities[index] <= 1}
											on:click|stopPropagation={(e) => {
												quantities[index] -= 1;
											}}
										>
											<i class="fa-regular fa-chevron-left" />
										</button>
										<InputNumber
											bind:value={quantities[index]}
											classes="w-12 text-center"
											onInput={(value) => {
												if (quantities[index] > detail.quantity) {
													quantities[index] = detail.quantity;
												} else {
													quantities[index] = value;
												}
											}}
										/>
										<button
											class:invisible={quantities[index] === detail.quantity}
											on:click={(e) => {
												e.stopPropagation();
												quantities[index] += 1;
											}}
										>
											<i class="fa-regular fa-chevron-right" />
										</button>
									</div>
								{:else}
									{detail.quantity}
								{/if}
							</Td>
							<Td>
								{formatMoney({ money: detail.priceTotal })}
							</Td>
							<Td>
								<OrderDetailState
									state={detail.state}
									on:click={() => handleShippedStateClick(detail)}
								/>
							</Td>
							<Td>
								{#if detail.draftId}
									<TextButton
										text="로고시안"
										on:click={() => {
											if (detail.draftId) {
												openDraftModal(detail.draftId);
											}
										}}
									/>
								{/if}
							</Td>
							<Td>
								{#if detail.workId}
									<TextButton
										text="작업지시서"
										on:click={() => {
											if (detail.workId) {
												openDirectionModal(detail.workId);
											}
										}}
									/>
								{/if}
							</Td>
							{#if editable}
								<Td>
									<TextButton
										on:click={() =>
											reduceQuantity({ orderDetail: detail, newQuantity: quantities[index] })}
										classes="{quantities[index] !== detail.quantity && quantities[index] > 0
											? ''
											: 'hidden'} "
										text="저장"
									/>
								</Td>
							{/if}
						</Tr>
						{#if detail.hasStudentNames()}
							<Tr>
								<Td colspan={editable ? '10' : '9'} classes="pl-2">
									<StudentNames
										bind:orderDetail={detail}
										editable={editable &&
											['간편주문', '무통장입금', '결제완료'].includes(detail.state)}
									/>
								</Td>
							</Tr>
						{/if}
					{/each}
				{/if}
			</Tbody>
		</Table>
	</div>
</div>

{#each orderMaster.additionalOrders as additionalOrder}
	<div class="flex flex-col p-8 border rounded bg-white">
		<div class="flex space-x-4 items-end">
			<LgBlack classes="whitespace-nowrap">추가주문</LgBlack>
			<TextButton on:click={() => handleAdditionalOrderNumberClick(additionalOrder.orderNumber)}
				>{additionalOrder.orderNumber}</TextButton
			>
			<MdGray>{formatDate(additionalOrder.dateCreated)}</MdGray>
		</div>
		<div class="flex flex-col my-4">
			<DataColumn title="주문금액 합계"
				>{formatMoney({ money: additionalOrder.priceTotal })}</DataColumn
			>
			<DataColumn title="결제할 금액"
				>{formatMoney({ money: additionalOrder.priceToPay })}</DataColumn
			>
			<DataColumn title="결제방법">{additionalOrder.paymentMethod}</DataColumn>
			<DataColumn title="결제금액">{formatMoney({ money: additionalOrder.paidAmount })}</DataColumn>
			<DataColumn title="결제 확인일">{formatDate(additionalOrder.datePaid)}</DataColumn>
		</div>

		<div class="my-4">
			<LgBlack>주문상품</LgBlack>
		</div>

		<Table classes="w-full mt-8">
			<Thead classes="sticky top-16 ">
				<Th>상품명</Th>
				<Th classes="w-28 pl-2">색상</Th>
				<Th classes="w-20">사이즈</Th>
				<Th classes="w-32">개당단가</Th>
				<Th classes="w-32">작업비</Th>
				<Th classes="w-32">주문수량</Th>
				<Th classes="w-32">총금액</Th>
				<Th classes="w-32">주문상태</Th>
				<Th classes="w-20" />
				<Th classes="w-20" />
			</Thead>
			<Tbody>
				{#each additionalOrder.details as detail}
					<Tr>
						<Td
							rowspan={detail.hasStudentNames() ? '2' : '1'}
							classes={detail.hasStudentNames() ? 'border-r' : ''}
						>
							{detail.productName}
						</Td>
						<Td classes="pl-2">
							{detail.color}
						</Td>
						<Td>
							{detail.size}
						</Td>
						<Td>
							{formatMoney({ money: detail.priceProduct })}
						</Td>
						<Td>
							{formatMoney({ money: detail.priceWork })}
						</Td>
						<Td>
							{detail.quantity}
						</Td>
						<Td>
							{formatMoney({ money: detail.priceTotal })}
						</Td>
						<Td>
							<OrderDetailState
								state={detail.state}
								on:click={() => handleShippedStateClick(detail)}
							/>
						</Td>
						<Td>
							{#if detail.draftId}
								<TextButton
									text="로고시안"
									on:click={() => {
										if (detail.draftId) {
											openDraftModal(detail.draftId);
										}
									}}
								/>
							{/if}
						</Td>
						<Td>
							{#if detail.workId}
								<TextButton
									text="작업지시서"
									on:click={() => {
										if (detail.workId) {
											openDirectionModal(detail.workId);
										}
									}}
								/>
							{/if}
						</Td>
					</Tr>
					{#if detail.hasStudentNames()}
						<Tr>
							<Td colspan="9" classes="pl-2">
								<StudentNames orderDetail={detail} />
							</Td>
						</Tr>
					{/if}
				{/each}
			</Tbody>
		</Table>
	</div>
{/each}

{#if draftDialogOpen}
	<DraftDetailModal bind:open={draftDialogOpen} {draftId} editable />
{/if}

{#if returnModalOpen && orderMaster.details}
	<CreateReturnRequestModal
		bind:open={returnModalOpen}
		orderDetails={orderMaster.details.filter((d) => d.checked)}
		{csRequest}
		{customer}
	/>
{/if}
{#if changeModalOpen && orderMaster.details}
	<CreateChangeRequestModal
		bind:open={changeModalOpen}
		orderDetails={orderMaster.details.filter((d) => d.checked)}
		{csRequest}
		{customer}
	/>
{/if}
{#if deliveryModalOpen}
	<DeliveryModal bind:open={deliveryModalOpen} orderDetail={selectedOrderDetail} />
{/if}

{#if additionalOrderModalOpen}
	<OrderMasterDetailModal
		bind:open={additionalOrderModalOpen}
		orderNumber={selectedAdditionalOrderNumber}
	/>
{/if}
{#if directionModalOpen}
	<DirectionModal bind:open={directionModalOpen} {detailWorkId} />
{/if}
{#if usedCouponModalOpen}
	<UsedCouponModal bind:open={usedCouponModalOpen} {orderMaster} />
{/if}
