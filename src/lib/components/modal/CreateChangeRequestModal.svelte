<script lang="ts">
	import ModalDialog from '$lib/components/modal/ModalDialog.svelte';
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import Table from '$lib/components/table/Table.svelte';
	import type OrderDetail from '$data/classes/OrderDetail';
	import Thead from '$lib/components/table/Thead.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import formatMoney from '$lib/utils/formatMoney';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import type CsRequest from '$data/classes/CsRequest';
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
	import DropdownSelect from '$lib/components/input/DropdownSelect.svelte';

	export let open = false,
		orderDetails: OrderDetail[],
		csRequest: CsRequest,
		customer: Customer;

	let reason = csRequest.reason,
		pickUpReceiver = customer.userName,
		pickUpPhone = customer.phone,
		pickUpAddress = customer.address,
		pickUpDetailAddress = customer.detailAddress,
		pickUpZipCode = customer.zipCode,
		changingPickUpAddress = false,
		changingDeliveryAddress = false,
		deliveryReceiver = customer.userName,
		deliveryPhone = customer.phone,
		deliveryAddress = customer.address,
		deliveryDetailAddress = customer.detailAddress,
		deliveryZipCode = customer.zipCode,
		memo: string,
		changingAddress = false,
		searchingAddress = false,
		addresses: DeliveryAddress[],
		selectedAddress: DeliveryAddress | undefined,
		selfAddress: DeliveryAddress,
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
		if (searchingAddress) {
			selfAddress.address = data.address;
			selfAddress.zipCode = data.zonecode;
			searchingAddress = false;
		}
	}

	function searchAddress() {
		searchingAddress = true;
	}

	async function changeAddress(pickUp: boolean) {
		changingPickUpAddress = pickUp;
		changingDeliveryAddress = !pickUp;
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
					pickUpReceiver = selectedAddress.receiver;
					pickUpAddress = selectedAddress.address;
					pickUpDetailAddress = selectedAddress.detailAddress;
					pickUpZipCode = selectedAddress.zipCode;
					pickUpPhone = selectedAddress.phone;
					changingPickUpAddress = false;
				} else if (changingDeliveryAddress) {
					deliveryReceiver = selectedAddress.receiver;
					deliveryAddress = selectedAddress.address;
					deliveryDetailAddress = selectedAddress.detailAddress;
					deliveryZipCode = selectedAddress.zipCode;
					deliveryPhone = selectedAddress.phone;
					changingDeliveryAddress = false;
				}
				changingAddress = false;
			}
		} else {
			if (!confirm('교환요청을 진행하시겠습니까?')) return;
			for (let detail of orderDetails) {
				if (!detail.changingOption) {
					return alert('교환 옵션을 모두 선택해주세요.');
				}
			}
			if (
				pickUpReceiver &&
				pickUpPhone &&
				pickUpZipCode &&
				pickUpAddress &&
				pickUpDetailAddress &&
				deliveryAddress &&
				deliveryDetailAddress &&
				deliveryZipCode &&
				deliveryPhone
			) {
				loading = true;
				const { success, message } = await OrderService.changeOrders({
					csRequestId: csRequest.id,
					orderDetails: orderDetails.map((o) => {
						return {
							changingProductId: o.changingOption!.productId,
							changingQuantity: o.quantity,
							orderDetailId: o.id
						};
					}),
					changeReason: reason,
					pickUpReceiver,
					pickUpPhone,
					pickUpAddress,
					pickUpDetailAddress,
					pickUpZipCode,
					deliveryReceiver,
					deliveryPhone,
					deliveryAddress,
					deliveryDetailAddress,
					deliveryZipCode,
					memo
				});
				loading = false;
				alert(message);
				if (success) {
					await changeSearchParam({ param: '', value: '', invalidateAll: true, noScroll: true });
					open = false;
				}
			}
		}
	}

	async function onOpenOptions(orderDetail: OrderDetail) {
		const client = HttpClient.getInstance();
		const ProductList = gql`
			query ProductList($productName: String) {
				productList(productName: $productName) {
					productId
					color
					size
					priceProduct
				}
			}
		`;
		const { productList } = (await client.request(ProductList, {
			productName: orderDetail.productName
		})) as {
			productList: {
				productId: number;
				color: string;
				size: string;
				priceProduct: number;
			}[];
		};

		orderDetail.otherOptions = productList;
		return orderDetail.otherOptions.map((o) => `${o.color} / ${o.size}`);
	}
</script>

{#if open}
	<ModalDialog
		classes="min-w-[1280px]"
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
						title: changingAddress
							? changingPickUpAddress
								? '회수지 변경'
								: '배송지 변경'
							: '교환요청',
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
			<MdBlack>교환 상품목록</MdBlack>
			<Table classes="w-full mt-2">
				<Thead>
					<Th>상품명</Th>
					<Th classes="w-24">색상</Th>
					<Th classes="w-24">사이즈</Th>
					<Th classes="w-32">가격</Th>
					<Th classes="w-32">작업비</Th>
					<Th classes="w-20">수량</Th>
					<Th classes="w-40">교환옵션</Th>
					<Th classes="w-40">교환추가금액</Th>
					<Th classes="w-40">변동금액</Th>
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
							<Td>
								<DropdownSelect
									getOptions={async () => onOpenOptions(detail)}
									onSelect={(option) => {
										const [color, size] = option.split(' / ');

										detail.changingOption = detail.otherOptions?.find(
											(o) => o.color === color && o.size === size
										);
									}}
								/>
							</Td>
							<Td>
								{#if detail.changingOption}
									{formatMoney({ money: detail.changingOption.priceProduct - detail.priceProduct })}
								{:else}
									-
								{/if}
							</Td>
							<Td>
								{#if detail.changingOption}
									{formatMoney({
										money:
											(detail.changingOption.priceProduct - detail.priceProduct) * detail.quantity
									})}
								{:else}
									-
								{/if}
							</Td>
						</Tr>
					{/each}
					<Tr>
						<Td colspan="8">
							<div class="flex justify-end">
								<LgBlack>합계</LgBlack>
							</div>
						</Td>
						<Td>
							<LgBlack>
								{formatMoney({
									money: orderDetails.reduce(
										(prev, next) =>
											prev +
											(next.changingOption
												? (next.changingOption.priceProduct - next.priceProduct) * next.quantity
												: 0),
										0
									)
								})}
							</LgBlack>
						</Td>
					</Tr>
				</Tbody>
			</Table>
			<div class="mt-4">
				<MdBlack>교환사유</MdBlack>
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
						<Td>{pickUpReceiver}</Td>
						<Td>{formatPhone(pickUpPhone)}</Td>
						<Td>{pickUpAddress} {pickUpDetailAddress} (우:{pickUpZipCode})</Td>
						<Td>
							<TextButton text="변경" on:click={() => changeAddress(true)} />
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
						<Td>{deliveryReceiver}</Td>
						<Td>{formatPhone(deliveryPhone)}</Td>
						<Td>{deliveryAddress} {deliveryDetailAddress} (우:{deliveryZipCode})</Td>
						<Td>
							<TextButton text="변경" on:click={() => changeAddress(false)} />
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
