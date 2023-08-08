<script lang="ts">
	import ModalDialog from '$lib/components/modal/ModalDialog.svelte';
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import formatMoney from '$lib/utils/formatMoney';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import { formatPhone } from '$lib/utils/formatPhone';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import DeliveryAddress from '$data/classes/DeliveryAddress';
	import DropdownSelect from '$lib/components/input/DropdownSelect.svelte';
	import type ChangeRequest from '$data/classes/ChangeRequest';
	import ChangeService from '$data/services/ChangeService';
	import DataColumn from '$lib/components/DataColumn.svelte';
	import InputMoney from '$lib/components/input/InputMoney.svelte';
	import ChangeRequestChangingAddress from '$lib/components/modal/ChangeRequestChangingAddress.svelte';
	import AddressService from '$data/services/AddressService';
	import Button from '../buttons/Button.svelte';
	import type DeliveryAgency from '$data/classes/DeliveryAgency';
	import { onMount } from 'svelte';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	import ChangeState from '../ChangeState.svelte';

	export let open = false,
		changeRequestId: number,
		page: number,
		editable = false;

	let changeRequest: ChangeRequest,
		currentSmarterMoney: number,
		userId: number,
		changingPickUpAddress = false,
		changingDeliveryAddress = false,
		selectedAddress: DeliveryAddress,
		changingAddress = false,
		searchingAddress = false,
		addresses: DeliveryAddress[],
		selfAddress: DeliveryAddress,
		loading = false,
		deliveryAgencies: DeliveryAgency[] = [],
		selectedDeliveryAgency: DeliveryAgency,
		trackingNumber: string | undefined;

	onMount(() => {
		if (changeRequestId) {
			ChangeService.getChangeRequest({ id: changeRequestId }).then((result) => {
				changeRequest = result.changeRequest;
				currentSmarterMoney = result.smarterMoney;
				userId = result.userId;
				deliveryAgencies = result.deliveryAgencies;
				selectedDeliveryAgency = changeRequest.delivery?.deliveryAgency ?? deliveryAgencies[0];
				trackingNumber = changeRequest.delivery?.trackingNumber;
			});
		}
	});

	$: {
		if (changeRequest) {
			if (changeRequest.isChangedPriceExempt) {
				if (changeRequest.isDeliveryPriceExempt) {
					changeRequest.priceToPay = 0;
				} else {
					changeRequest.priceToPay = changeRequest.deliveryPrice;
				}
			} else {
				if (changeRequest.isDeliveryPriceExempt) {
					changeRequest.priceToPay = changeRequest.totalChangingPrice;
				} else {
					changeRequest.priceToPay =
						changeRequest.totalChangingPrice +
						(changeRequest.deliveryPrice ? changeRequest.deliveryPrice : 0);
				}
			}
		}
	}

	async function changeAddress(pickUp: boolean) {
		changingPickUpAddress = pickUp;
		changingDeliveryAddress = !pickUp;
		addresses = await AddressService.getAddressesOfUser(userId);
		selfAddress = new DeliveryAddress({
			address: '',
			detailAddress: '',
			id: 0,
			isDefault: false,
			name: '직접입력',
			phone: '',
			receiver: '',
			zipCode: ''
		});
		changingAddress = true;
	}

	async function handleSaveButtonClick() {
		if (changingAddress) {
			if (!selectedAddress) {
				alert('주소를 선택해주세요.');
			} else if (
				!selectedAddress.receiver ||
				!selectedAddress.phone ||
				!selectedAddress.zipCode ||
				!selectedAddress.address ||
				!selectedAddress.detailAddress
			) {
				alert('주소 정보를 모두 입력해주세요.');
			} else {
				if (changingPickUpAddress) {
					changeRequest.pickUpReceiver = selectedAddress.receiver;
					changeRequest.pickUpAddress = selectedAddress.address;
					changeRequest.pickUpDetailAddress = selectedAddress.detailAddress;
					changeRequest.pickUpZipCode = selectedAddress.zipCode;
					changeRequest.pickUpPhone = selectedAddress.phone;
					changingPickUpAddress = false;
				} else if (changingDeliveryAddress) {
					changeRequest.deliveryReceiver = selectedAddress.receiver;
					changeRequest.deliveryAddress = selectedAddress.address;
					changeRequest.deliveryDetailAddress = selectedAddress.detailAddress;
					changeRequest.deliveryZipCode = selectedAddress.zipCode;
					changeRequest.deliveryPhone = selectedAddress.phone;
					changingDeliveryAddress = false;
				}
				changingAddress = false;
			}
		} else {
			if (!confirm('저장하시겠습니까?')) return;
			if (
				await changeRequest.update({ deliveryAgencyId: selectedDeliveryAgency?.id, trackingNumber })
			) {
				alert('저장되었습니다.');
				open = false;
			} else {
				alert('저장에 실패하였습니다.');
			}
		}
	}

	async function handleCompleteButtonClick() {
		if (!selectedDeliveryAgency || !trackingNumber) {
			return alert('배송사와 운송장번호를 모두 입력해주세요.');
		}
		if (!confirm('교환을 완료하시겠습니까?')) return;
		if (
			await changeRequest.complete({ deliveryAgencyId: selectedDeliveryAgency?.id, trackingNumber })
		) {
			alert('교환이 완료되었습니다.');
			changeSearchParam({
				param: 'page',
				value: page.toString()
			});
			open = false;
		} else {
			alert('실패하였습니다.');
		}
	}
</script>

{#if open && changeRequest}
	<ModalDialog
		classes="min-w-[1600px]"
		bind:loading
		title={changingAddress
			? changingPickUpAddress
				? '상품 회수지 변경'
				: '상품 배송지 변경'
			: '교환'}
		bind:open
		buttons={searchingAddress
			? [
					new ModalButton({
						title: '취소',
						color: ButtonColor.red,
						onClick: () => {
							searchingAddress = false;
						}
					})
			  ]
			: editable
			? [
					new ModalButton({
						title: '취소',
						color: ButtonColor.red,
						onClick: () => {
							if (changingAddress) {
								changingAddress = false;
							} else {
								open = false;
							}
						}
					}),
					new ModalButton({
						title: changingAddress
							? changingPickUpAddress
								? '회수지 변경'
								: '배송지 변경'
							: '저장',
						color: ButtonColor.blue,
						onClick: handleSaveButtonClick
					})
			  ]
			: [
					new ModalButton({
						title: '닫기',
						color: ButtonColor.red,
						onClick: () => {
							if (changingAddress) {
								changingAddress = false;
							} else {
								open = false;
							}
						}
					})
			  ]}
	>
		{#if changingAddress}
			<ChangeRequestChangingAddress bind:selfAddress {addresses} bind:selectedAddress />
		{:else}
			<MdBlack bold>상태</MdBlack>
			<div class="mt-2">
				<ChangeState state={changeRequest.state} />
			</div>
			<MdBlack bold classes="mt-4">교환 상품목록</MdBlack>
			<Table classes="w-full mt-2">
				<Thead>
					<Th>상품명</Th>
					<Th classes="w-24">색상</Th>
					<Th classes="w-24">사이즈</Th>
					<Th classes="w-32">가격</Th>
					<Th classes="w-32">작업비</Th>
					<Th classes="w-20">수량</Th>
					<Th classes="w-52">교환옵션</Th>
					<Th classes="w-40">교환추가금액</Th>
					<Th classes="w-40">변동금액</Th>
				</Thead>
				<Tbody>
					{#if changeRequest.changeRequestDetails}
						{#each changeRequest.changeRequestDetails as detail}
							<Tr>
								<Td classes="whitespace-nowrap">
									{detail.productName}
								</Td>
								<Td>
									{detail.changedProduct.color}
								</Td>
								<Td>
									{detail.changedProduct.size}
								</Td>
								<Td>
									{formatMoney({ money: detail.priceChangedProduct })}
								</Td>
								<Td>
									{formatMoney({ money: detail.priceWork })}
								</Td>
								<Td>
									{detail.changingQuantity}
								</Td>
								<Td>
									<DropdownSelect
										options={detail.options.map((p) => `${p.color} / ${p.size}`)}
										selected={`${detail.changingProduct.color} / ${detail.changingProduct.size}`}
										disabled={!editable}
										onSelect={(option) => {
											const [color, size] = option.split(' / ');
											let changingProduct = detail.options.find(
												(o) => o.color === color && o.size === size
											);
											if (changingProduct) detail.changingProduct = changingProduct;
											changeRequest.totalChangingPrice -= detail.totalChangingPrice;
											detail.changingPrice =
												detail.changingProduct.priceAdditional -
												detail.changedProduct.priceAdditional;
											detail.totalChangingPrice = detail.changingPrice * detail.changingQuantity;
											changeRequest.totalChangingPrice += detail.totalChangingPrice;
										}}
									/>
								</Td>
								<Td>
									{formatMoney({
										money: detail.changingPrice
									})}
								</Td>

								<Td>
									{formatMoney({
										money: detail.totalChangingPrice
									})}
								</Td>
							</Tr>
						{/each}
					{/if}
				</Tbody>
			</Table>
			<div class="mt-4">
				<MdBlack bold>교환사유</MdBlack>
				<InputText
					classes="mt-2"
					bind:value={changeRequest.changeReason}
					fill
					disabled={!editable}
				/>
			</div>
			<div class="mt-4">
				<MdBlack bold>상품 회수지</MdBlack>
				<Table classes="mt-2 w-full">
					<Thead>
						<Th classes="w-24">수령인</Th>
						<Th classes="w-40">연락처</Th>
						<Th>주소</Th>
						<Th classes="w-10" />
					</Thead>
					<Tr>
						<Td>{changeRequest.pickUpReceiver}</Td>
						<Td>{formatPhone(changeRequest.pickUpPhone)}</Td>
						<Td
							>{changeRequest.pickUpAddress}
							{changeRequest.pickUpDetailAddress} (우:{changeRequest.pickUpZipCode})</Td
						>
						<Td>
							<TextButton text="변경" on:click={() => changeAddress(true)} disabled={!editable} />
						</Td>
					</Tr>
				</Table>
			</div>
			<div class="mt-4">
				<MdBlack>교환상품 배송지</MdBlack>
				<Table classes="mt-2 w-full">
					<Thead>
						<Th classes="w-24">수령인</Th>
						<Th classes="w-40">연락처</Th>
						<Th>주소</Th>
						<Th classes="w-10" />
					</Thead>
					<Tr>
						<Td>{changeRequest.deliveryReceiver}</Td>
						<Td>{formatPhone(changeRequest.deliveryPhone)}</Td>
						<Td
							>{changeRequest.deliveryAddress}
							{changeRequest.deliveryDetailAddress} (우:{changeRequest.deliveryZipCode})</Td
						>
						<Td>
							<TextButton text="변경" on:click={() => changeAddress(false)} disabled={!editable} />
						</Td>
					</Tr>
				</Table>
			</div>
			<div class="mt-4">
				<MdBlack bold>환불정보</MdBlack>
				<DataColumn title="변동금액 합계">
					<MdBlack>
						{formatMoney({ money: changeRequest.totalChangingPrice })}
					</MdBlack>
				</DataColumn>
				<DataColumn title="변동금액 부담">
					<div class="flex space-x-16">
						<div class="flex items-center space-x-4">
							<input
								type="radio"
								name="isChangedPriceExempt"
								disabled={!editable}
								id="isChangedPriceExempt"
								bind:group={changeRequest.isChangedPriceExempt}
								value={true}
							/>
							<MdBlack>
								<label for="isChangedPriceExempt">스마터 부담</label>
							</MdBlack>
						</div>
						<div class="flex items-center space-x-4">
							<input
								type="radio"
								name="isChangedPriceExempt"
								id="isChangedPriceNotExempt"
								disabled={!editable}
								value={false}
								bind:group={changeRequest.isChangedPriceExempt}
							/>
							<MdBlack>
								<label for="isChangedPriceNotExempt">고객 부담</label>
							</MdBlack>
						</div>
					</div>
				</DataColumn>
				<DataColumn title="배송비">
					<div class="flex space-x-2 items-center">
						<InputMoney bind:value={changeRequest.deliveryPrice} disabled={!editable} /><MdBlack
							>원</MdBlack
						>
					</div>
				</DataColumn>
				<DataColumn title="배송비 부담">
					<div class="flex space-x-16">
						<div class="flex items-center space-x-4">
							<input
								type="radio"
								name="isDeliveryPriceExempt"
								id="isDeliveryPriceExempt"
								disabled={!editable}
								bind:group={changeRequest.isDeliveryPriceExempt}
								value={true}
							/>
							<MdBlack>
								<label for="isDeliveryPriceExempt">스마터 부담</label>
							</MdBlack>
						</div>
						<div class="flex items-center space-x-4">
							<input
								type="radio"
								name="isDeliveryPriceNotExempt"
								id="isDeliveryPriceNotExempt"
								disabled={!editable}
								value={false}
								bind:group={changeRequest.isDeliveryPriceExempt}
							/>
							<MdBlack>
								<label for="isDeliveryPriceNotExempt">고객 부담</label>
							</MdBlack>
						</div>
					</div>
				</DataColumn>
				<DataColumn title="결제금액">
					<MdBlack>
						{formatMoney({ money: changeRequest.priceToPay })}
					</MdBlack>
				</DataColumn>

				<DataColumn title="현재 보유 스마터머니">
					<MdBlack>
						{formatMoney({
							money: editable ? currentSmarterMoney : changeRequest.currentSmarterMoney
						})}
					</MdBlack>
				</DataColumn>
				<DataColumn title="결제 후 스마터머니">
					<MdBlack>
						{formatMoney({
							money: editable
								? currentSmarterMoney - (changeRequest.priceToPay ? changeRequest.priceToPay : 0)
								: changeRequest.afterSmarterMoney
						})}
					</MdBlack>
				</DataColumn>
			</div>
			<div class="mt-4 flex flex-col">
				<MdBlack bold>메모</MdBlack>
				<TextArea classes="mt-2" bind:value={changeRequest.memo} disabled={!editable} />
			</div>
		{/if}
		<div class="flex flex-col w-fit h-[calc(100%-64px)] p-4" slot="side">
			<MdBlack>배송사</MdBlack>
			<DropdownSelect
				classes="mt-2 w-32 text-start"
				disabled={!editable}
				options={deliveryAgencies.map((d) => d.name)}
				selected={selectedDeliveryAgency ? selectedDeliveryAgency.name : undefined}
				onSelect={(name) => {
					const deliveryAgency = deliveryAgencies.find((d) => d.name === name);
					if (deliveryAgency) selectedDeliveryAgency = deliveryAgency;
				}}
			/>
			<MdBlack classes="mt-4">운송장번호</MdBlack>
			<InputText bind:value={trackingNumber} classes="mt-2" disabled={!editable} />
			{#if editable}
				<Button
					classes="mt-4 w-full"
					text="상품 발송 및 교환완료"
					on:click={handleCompleteButtonClick}
				/>
			{/if}
		</div>
	</ModalDialog>
{/if}
