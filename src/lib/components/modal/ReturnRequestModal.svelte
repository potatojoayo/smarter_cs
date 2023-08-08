<script lang="ts">
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import LgGray from '../base/LgGray.svelte';
	import MdBlack from '../base/MdBlack.svelte';
	import MdGray from '../base/MdGray.svelte';
	import InputText from '../input/InputText.svelte';
	import Table from '../table/Table.svelte';
	import Tbody from '../table/Tbody.svelte';
	import Td from '../table/Td.svelte';
	import Th from '../table/Th.svelte';
	import Thead from '../table/Thead.svelte';
	import Tr from '../table/Tr.svelte';
	import ModalDialog from './ModalDialog.svelte';
	import InputMoney from '../input/InputMoney.svelte';
	import InputNumber from '../input/InputNumber.svelte';
	import ReturnsService from '$data/services/ReturnsService';
	import { onMount } from 'svelte';
	import type ReturnRequest from '$data/classes/ReturnRequest';
	import formatMoney from '$lib/utils/formatMoney';
	import { formatPhone } from '$lib/utils/formatPhone';
	import { gql } from 'graphql-request';
	import TextButton from '../buttons/TextButton.svelte';
	import HttpClient from '$data/graphql/client';
	import DeliveryAddress from '$data/classes/DeliveryAddress';
	import InputPhone from '../input/InputPhone.svelte';
	import AddressSearch from 'svelte-daum-postcode';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	export let open = false,
		returnId: number,
		returnState: string;
	let changingAddress = false;
	let searchingAddress = false;
	let returnRequest: ReturnRequest;
	$: returnPrice = returnRequest?.returnDetails.reduce(
		(pre, next) => pre + (next.priceProduct + next.priceWork) * next.returnQuantity,
		0
	);
	$: returnDetails = returnRequest?.returnDetails.map((r) => {
		return {
			id: r.id,
			returnQuantity: r.returnQuantity
		};
	});
	$: totalQuantity = returnRequest?.returnDetails.reduce(
		(pre, next) => pre + next.returnQuantity,
		0
	);
	let deliveryCharge = 4000;
	let selected = 1;
	$: isDeliveryPriceExempt = selected === 1;
	let selfAddress: DeliveryAddress;
	let addresses: DeliveryAddress[];
	let selectedAddress: string;
	let returnReceiver: string;
	let returnPhone: string;
	let returnAddress: string;
	let returnDetailAddress: string;
	let returnZipCode: string;
	let loading = false;
	let memo = '';
	let userId: number = 0;

	onMount(async () => {
		returnRequest = await ReturnsService.getReturnRequest({ returnId: returnId });
		userId = returnRequest.userId;
		returnReceiver = returnRequest.receiver;
		returnPhone = returnRequest.phone;
		returnAddress = returnRequest.address;
		returnDetailAddress = returnRequest.detailAddress;
		returnZipCode = returnRequest.zipCode;
		console.log(returnRequest);
		selected = returnRequest.isDeliveryPriceExempt ? 1 : 2;
	});

	function handleComplete({
		detail: { data }
	}: {
		detail: {
			data: {
				address: string;
				zonecode: string;
			};
		};
	}) {
		selfAddress.address = data.address;
		selfAddress.zipCode = data.zonecode;
		searchingAddress = false;
	}

	function searchAddress() {
		searchingAddress = true;
	}

	async function changeState() {
		if (!confirm('반품완료 처리하시겠습니까?')) return;
		if (returnReceiver && returnPhone && returnZipCode && returnAddress && returnDetailAddress) {
			loading = true;
			const { success, message } = await ReturnsService.completeReturn({
				returnId: returnId,
				address: returnAddress,
				detailAddress: returnDetailAddress,
				deliveryPrice: deliveryCharge,
				isDeliveryPriceExempt: isDeliveryPriceExempt,
				memo: memo,
				phone: returnPhone,
				receiver: returnReceiver,
				returnDetails: returnDetails,
				returnReason: returnRequest.returnReason,
				zipCode: returnZipCode
			});
			alert(message);
			if (success) {
				await changeSearchParam({ param: '', value: '', invalidateAll: true, noScroll: true });
				open = false;
			}
		} else {
			alert('회수지 정보를 모두 입력해주세요.');
		}
	}

	async function changeAddress() {
		const Addresses = gql`
			query Addresses($userId: Int) {
				addresses(userId: $userId) {
					id
					name
					phone
					receiver
					zipCode
					address
					detailAddress
					isDefault
				}
			}
		`;

		const client = HttpClient.getInstance();
		const result = (await client.request(Addresses, { userId: userId })) as {
			addresses: {
				name: string;
				phone: string;
				receiver: string;
				zipCode: string;
				address: string;
				detailAddress: string;
				id: number;
				isDefault: boolean;
			}[];
		};
		addresses = result.addresses.map((a) => new DeliveryAddress(a));
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
	async function handleButtonClick() {
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
				returnReceiver = selectedAddress.receiver;
				returnAddress = selectedAddress.address;
				returnDetailAddress = selectedAddress.detailAddress;
				returnZipCode = selectedAddress.zipCode;
				returnPhone = selectedAddress.phone;
				changingAddress = false;
			}
		} else {
			if (returnReceiver && returnPhone && returnZipCode && returnAddress && returnDetailAddress) {
				loading = true;
				const { success, message } = await ReturnsService.updateReturn({
					address: returnAddress,
					deliveryPrice: deliveryCharge,
					detailAddress: returnDetailAddress,
					isDeliveryPriceExempt: isDeliveryPriceExempt,
					memo: memo,
					phone: returnPhone,
					receiver: returnReceiver,
					returnDetails: returnDetails,
					returnId: returnId,
					returnReason: returnRequest.returnReason,
					zipCode: returnZipCode
				});
				alert(message);
				if (success) {
					open = false;
				}
			} else {
				alert('회수지 정보를 모두 입력해주세요.');
			}
		}
	}
</script>

{#if open && returnRequest}
	<ModalDialog
		classes="min-w-[1280px]"
		title={changingAddress ? '상품 회수지 변경' : '반품'}
		bind:open
		buttons={returnState === '반품완료'
			? [
					new ModalButton({
						title: '닫기',
						color: ButtonColor.blue,
						onClick: () => {
							open = false;
						}
					})
			  ]
			: searchingAddress
			? [
					new ModalButton({
						title: '취소',
						color: ButtonColor.red,
						onClick: () => {
							searchingAddress = false;
						}
					})
			  ]
			: changingAddress
			? [
					new ModalButton({
						title: '닫기',
						color: ButtonColor.red,
						onClick: () => {
							changingAddress = false;
						}
					}),
					new ModalButton({
						title: '저장',
						color: ButtonColor.blue,
						onClick: handleButtonClick
					})
			  ]
			: [
					new ModalButton({
						title: '닫기',
						color: ButtonColor.red,
						onClick: () => {
							open = false;
						}
					}),
					new ModalButton({
						title: '저장',
						color: ButtonColor.blue,
						onClick: handleButtonClick
					}),
					new ModalButton({
						title: '반품완료',
						color: ButtonColor.blue,
						onClick: changeState
					})
			  ]}
	>
		{#if searchingAddress}
			<AddressSearch on:complete={handleComplete} />
		{:else if changingAddress}
			<Table classes="w-full">
				<Thead>
					<Th classes="w-10">선택</Th>
					<Th classes="w-28">배송지</Th>
					<Th classes="w-28">수령인</Th>
					<Th classes="w-48">연락처</Th>
					<Th classes="w-20">우편번호</Th>
					<Th classes="w-80">주소</Th>
					<Th classes="w-72">상세주소</Th>
				</Thead>
				<Tbody>
					{#each addresses as address}
						<Tr>
							<Td>
								<div class="flex items-center">
									<input
										type="radio"
										class="h-4 w-4"
										name="address"
										value={address}
										bind:group={selectedAddress}
									/>
								</div>
							</Td>
							<Td>
								{address.name}
							</Td>
							<Td>
								{address.receiver}
							</Td>
							<Td>
								{formatPhone(address.phone)}
							</Td>
							<Td>
								{address.zipCode}
							</Td>
							<Td>
								{address.address}
							</Td>
							<Td>
								{address.detailAddress}
							</Td>
						</Tr>
					{/each}
					<Tr>
						<Td>
							<div class="flex items-center">
								<input
									type="radio"
									class="h-4 w-4"
									name="address"
									value={selfAddress}
									bind:group={selectedAddress}
								/>
							</div>
						</Td>
						<Td>
							{selfAddress.name}
						</Td>
						<Td>
							<InputText bind:value={selfAddress.receiver} classes="w-20" />
						</Td>
						<Td>
							<InputPhone bind:phone={selfAddress.phone} classes="w-40" />
						</Td>
						<Td>
							{selfAddress.zipCode}
						</Td>
						<Td>
							{selfAddress.address}
						</Td>
						<Td>
							<div class="flex justify-between">
								<InputText bind:value={selfAddress.detailAddress} />
								<TextButton text="주소검색" on:click={searchAddress} />
							</div>
						</Td>
					</Tr>
				</Tbody>
			</Table>
		{:else}
			<div class="flex flex-col justify-between space-y-4">
				<div>
					<Table classes="w-full">
						<Thead>
							<Th><MdBlack text={'상품명'} /></Th>
							<Th><MdBlack text={'체육관가'} /></Th>
							<Th><MdBlack text={'작업비'} /></Th>
							<Th><MdBlack text={'색상'} /></Th>
							<Th><MdBlack text={'사이즈'} /></Th>
							<Th><MdBlack text={'수량'} /></Th>
							<Th><MdBlack text={'합계금액'} /></Th>
						</Thead>
						<Tbody>
							{#if returnRequest}
								{#each returnRequest.returnDetails as returnDetail}
									<Tr>
										<Td><MdGray text={returnDetail.productMasterName} /></Td>
										<Td><MdGray>{formatMoney({ money: returnDetail.priceProduct })}</MdGray></Td>
										<Td><MdGray>{formatMoney({ money: returnDetail.priceWork })}</MdGray></Td>
										<Td><MdGray text={returnDetail.color} /></Td>
										<Td><MdGray text={returnDetail.size} /></Td>
										{#if returnState === '반품요청'}
											<Td
												><InputNumber bind:value={returnDetail.returnQuantity} classes="w-14" /></Td
											>
										{:else}
											<Td><MdGray>{returnDetail.returnQuantity}</MdGray></Td>
										{/if}
										<Td
											><MdGray
												text={formatMoney({
													money:
														(returnDetail.priceProduct + returnDetail.priceWork) *
														returnDetail.returnQuantity
												})}
											/></Td
										>
									</Tr>
								{/each}
							{/if}
							<Tr>
								<Td />
								<Td />
								<Td />
								<Td />
								<Td><LgGray text={'합계'} /></Td>
								<Td><MdGray>{totalQuantity}</MdGray></Td>
								<Td
									><MdGray>
										{formatMoney({
											money: returnPrice
										})}
									</MdGray>
								</Td>
							</Tr>
						</Tbody>
					</Table>
				</div>
				<div class="space-y-4">
					<MdBlack text={'반품사유'} bold={true} />
					{#if returnState === '반품요청'}
						<InputText classes="w-full" bind:value={returnRequest.returnReason} />
					{:else}
						<InputText classes="w-full" disabled={true} value={returnRequest.returnReason} />
					{/if}
				</div>
				<div class="space-y-4">
					<MdBlack text={'상품 회수지'} bold={true} />
					<Table classes="w-full">
						<Thead>
							<Th>수령인</Th>
							<Th>연락처</Th>
							<Th classes="w-80">주소</Th>
							<Th classes="w-16" />
						</Thead>
						<Tbody>
							<Tr>
								<Td>{returnReceiver}</Td>
								<Td>{formatPhone(returnPhone)}</Td>
								<Td>{`${returnAddress} ${returnDetailAddress} (우:${returnZipCode})`}</Td>
								{#if returnState === '반품요청'}
									<Td><TextButton text="변경" on:click={changeAddress} /></Td>
								{:else}
									<Td />
								{/if}
							</Tr>
						</Tbody>
					</Table>
				</div>
				<MdBlack text={'환불정보'} bold={true} />
				<div class="w-full space-y-4">
					<div class=" w-full py-1 flex border-b">
						<div class="w-72"><td>상품금액</td></div>
						<div>
							<MdGray>
								{formatMoney({
									money: returnPrice
								})}</MdGray
							>
						</div>
					</div>
					<div class=" w-full py-1 flex border-b">
						<div class="w-72"><td>배송비</td></div>
						<div>
							{#if returnState === '반품완료'}
								<MdGray>
									{formatMoney({
										money: deliveryCharge
									})}</MdGray
								>
							{:else}
								<InputMoney classes="w-20 h-7" bind:value={deliveryCharge} /><MdGray text={' 원'} />
							{/if}
						</div>
					</div>
					<div class=" w-full py-1 flex border-b">
						<div class="w-72"><td>배송비 부담</td></div>
						<div class=" space-x-4 flex justify-start items-center">
							{#if returnState === '반품완료'}
								<label class="flex items-center space-x-2">
									<input type="radio" name="delivery" bind:group={selected} value={1} disabled />
									<MdGray text={'스마터부담'} />
								</label>
								<label class="flex items-center space-x-2">
									<input type="radio" name="delivery" bind:group={selected} value={2} disabled />
									<MdGray text={'고객부담'} />
								</label>
							{:else}
								<label class="flex items-center space-x-2">
									<input type="radio" name="delivery" bind:group={selected} value={1} />
									<MdGray text={'스마터부담'} />
								</label>
								<label class="flex items-center space-x-2">
									<input type="radio" name="delivery" bind:group={selected} value={2} />
									<MdGray text={'고객부담'} />
								</label>
							{/if}
						</div>
					</div>
					<div class=" w-full py-1 flex border-b">
						<div class="w-72"><td>환불금액</td></div>
						<div>
							<MdGray
								>{selected === 1
									? formatMoney({
											money: returnPrice
									  })
									: formatMoney({
											money: returnPrice - deliveryCharge
									  })}</MdGray
							>
						</div>
					</div>
					<div class=" w-full py-1 flex border-b">
						<div class="w-72"><td>현재 보유 스마터머니</td></div>
						<div>
							<MdGray>{formatMoney({ money: returnRequest.currentUserSmarterMoney })}</MdGray>
						</div>
					</div>
					<div class=" w-full py-1 flex border-b">
						<div class="w-72"><td>환불 스마터 머니</td></div>
						<div>
							<MdGray
								>{selected === 1
									? formatMoney({
											money: returnPrice + returnRequest.currentUserSmarterMoney
									  })
									: formatMoney({
											money: returnPrice + deliveryCharge + returnRequest.currentUserSmarterMoney
									  })}</MdGray
							>
						</div>
					</div>
				</div>
				<div class="space-y-4">
					<MdBlack text={'메모'} bold={true} />
					{#if returnState === '반품요청'}
						<InputText classes="w-full" bind:value={memo} />
					{:else}
						<InputText classes="w-full" bind:value={memo} disabled={true} />
					{/if}
				</div>
			</div>
		{/if}
	</ModalDialog>
{/if}
