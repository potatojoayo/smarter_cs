<script lang="ts">
	import ModalDialog from '$lib/components/modal/ModalDialog.svelte';
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import Table from '$lib/components/table/Table.svelte';
	import OrderDetail from '$data/classes/OrderDetail';
	import Thead from '$lib/components/table/Thead.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import formatMoney from '$lib/utils/formatMoney';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import CsRequest from '$data/classes/CsRequest';
	import type Customer from '$data/classes/Customer';
	import { formatPhone } from '$lib/utils/formatPhone';
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import InputNumber from '$lib/components/input/InputNumber.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import { gql } from 'graphql-request';
	import HttpClient from '$data/graphql/client';
	import DeliveryAddress from '$data/classes/DeliveryAddress';
	import InputPhone from '$lib/components/input/InputPhone.svelte';
	import AddressSearch from 'svelte-daum-postcode';
	import OrderService from '$data/services/OrderService';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';

	export let open = false,
		orderDetails: OrderDetail[],
		csRequest: CsRequest,
		customer: Customer;

	let reason = csRequest.reason,
		returnReceiver = customer.userName,
		returnPhone = customer.phone,
		returnAddress = customer.address,
		returnDetailAddress = customer.detailAddress,
		returnZipCode = customer.zipCode,
		memo,
		changingAddress = false,
		searchingAddress = false,
		addresses: DeliveryAddress[],
		selectedAddress,
		selfAddress,
		loading = false;

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
		const result = (await client.request(Addresses, { userId: customer.userId })) as {
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
		if (!confirm('반품요청을 하시겠습니까?')) return;
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
				const { success, message } = await OrderService.returnOrders({
					csRequestId: csRequest.id,
					orderDetails: orderDetails.map((o) => {
						return { id: o.id, quantity: o.quantity };
					}),
					returnReason: reason,
					receiver: returnReceiver,
					phone: returnPhone,
					zipCode: returnZipCode,
					address: returnAddress,
					detailAddress: returnDetailAddress,
					memo: memo
				});
				loading = false;
				alert(message);
				if (success) {
					await changeSearchParam({ param: '', value: '', invalidateAll: true, noScroll: true });
					open = false;
				}
			} else {
				alert('회수지 정보를 모두 입력해주세요.');
			}
		}
	}
</script>

{#if open}
	<ModalDialog
		classes="min-w-[800px]"
		bind:loading
		title={changingAddress ? '상품 회수지 변경' : '반품'}
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
			: [
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
						title: changingAddress ? '회수지 변경' : '반품요청',
						color: ButtonColor.blue,
						onClick: handleButtonClick
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
			<MdBlack>반품 상품목록</MdBlack>
			<Table classes="w-full mt-2">
				<Thead>
					<Th>상품명</Th>
					<Th classes="w-24">색상</Th>
					<Th classes="w-24">사이즈</Th>
					<Th classes="w-32">가격</Th>
					<Th classes="w-32">작업비</Th>
					<Th classes="w-20">수량</Th>
					<Th classes="w-40">합계금액</Th>
				</Thead>
				<Tbody>
					{#each orderDetails as detail}
						<Tr>
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
								{formatMoney({ money: detail.priceProduct })}
							</Td>
							<Td>
								{formatMoney({ money: detail.priceWork })}
							</Td>
							<Td>
								<InputNumber
									bind:value={detail.quantity}
									classes="w-10 text-center"
									onInput={(value) => {
										detail.priceTotal = value * (detail.priceProduct + detail.priceWork);
									}}
								/>
							</Td>
							<Td classes="whitespace-nowrap">
								{formatMoney({ money: detail.priceTotal })}
							</Td>
						</Tr>
					{/each}
					<Tr>
						<Td colspan="5">
							<div class="flex justify-end">
								<LgBlack>합계</LgBlack>
							</div>
						</Td>
						<Td>
							<LgBlack>
								{orderDetails.reduce((prev, next) => prev + next.quantity, 0)}
							</LgBlack>
						</Td>
						<Td>
							<LgBlack>
								{formatMoney({
									money: orderDetails.reduce((prev, next) => prev + next.priceTotal, 0)
								})}
							</LgBlack>
						</Td>
					</Tr>
				</Tbody>
			</Table>
			<div class="mt-4">
				<MdBlack>반품사유</MdBlack>
				<InputText classes="mt-2 w-full" bind:value={reason} />
			</div>
			<div class="mt-4">
				<MdBlack>상품 회수지</MdBlack>
				<Table classes="mt-2 w-full">
					<Thead>
						<Th classes="w-24">수령인</Th>
						<Th classes="w-40">연락처</Th>
						<Th>주소</Th>
						<Th classes="w-10" />
					</Thead>
					<Tr>
						<Td>{returnReceiver}</Td>
						<Td>{formatPhone(returnPhone)}</Td>
						<Td>{returnAddress} {returnDetailAddress} (우:{returnZipCode})</Td>
						<Td>
							<TextButton text="변경" on:click={changeAddress} />
						</Td>
					</Tr>
				</Table>
			</div>
			<div class="mt-4 flex flex-col">
				<MdBlack>메모</MdBlack>
				<TextArea classes="mt-2" bind:value={memo} />
			</div>
		{/if}
	</ModalDialog>
{/if}
