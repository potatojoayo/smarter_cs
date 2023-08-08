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
	import InputText from '$lib/components/input/InputText.svelte';
	import { formatPhone } from '$lib/utils/formatPhone';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import DeliveryAddress from '$data/classes/DeliveryAddress';
	import InputPhone from '$lib/components/input/InputPhone.svelte';
	import AddressSearch from 'svelte-daum-postcode';
	import { onMount } from 'svelte';

	export let open = false,
		deliveryAddresses: DeliveryAddress[] = [],
		selectedDeliveryAddress: DeliveryAddress | undefined;

	let searchingAddress = false,
		deliveryAddress: DeliveryAddress | undefined;
	onMount(() => {
		if (!deliveryAddresses.find((d) => d.name === '직접입력')) {
			deliveryAddresses.push(
				new DeliveryAddress({
					id: 0,
					name: '직접입력',
					receiver: '',
					address: '',
					detailAddress: '',
					isDefault: false,
					phone: '',
					zipCode: ''
				})
			);
		}
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
		if (searchingAddress && deliveryAddress) {
			deliveryAddress.address = data.address;
			deliveryAddress.zipCode = data.zonecode;
			searchingAddress = false;
		}
	}

	function searchAddress() {
		deliveryAddress = deliveryAddresses[deliveryAddresses.length - 1];
		searchingAddress = true;
	}

	async function handleButtonClick() {
		if (!deliveryAddress) {
			alert('주소를 선택해주세요.');
		} else if (
			!deliveryAddress.receiver ||
			!deliveryAddress.phone ||
			!deliveryAddress.zipCode ||
			!deliveryAddress.address ||
			!deliveryAddress.detailAddress
		) {
			alert('주소 정보를 모두 입력해주세요.');
		} else {
			selectedDeliveryAddress = deliveryAddress;
			alert('배송지가 변경되었습니다.');
			open = false;
		}
	}
</script>

{#if open}
	<ModalDialog
		classes="max-h-[80%]"
		title={'배송지 변경'}
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
							open = false;
						}
					}),
					new ModalButton({
						title: '배송지 변경',
						color: ButtonColor.blue,
						onClick: handleButtonClick
					})
			  ]}
	>
		{#if searchingAddress}
			<div class="flex justify-center w-full">
				<AddressSearch on:complete={handleComplete} />
			</div>
		{:else}
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
					{#each deliveryAddresses as address, index}
						<Tr
							onClick={() => {
								deliveryAddress = address;
							}}
						>
							<Td>
								<div class="flex items-center">
									<input
										type="radio"
										class="h-4 w-4"
										name="address"
										value={address}
										bind:group={deliveryAddress}
									/>
								</div>
							</Td>
							<Td>
								{address.name}
							</Td>
							<Td>
								{#if index < deliveryAddresses.length - 1}
									{address.receiver}
								{:else}
									<InputText bind:value={address.receiver} classes="w-20" />
								{/if}
							</Td>
							<Td>
								{#if index < deliveryAddresses.length - 1}
									{formatPhone(address.phone)}
								{:else}
									<InputPhone bind:phone={address.phone} />
								{/if}
							</Td>
							<Td>
								{address.zipCode}
							</Td>
							<Td>
								{address.address}
							</Td>
							<Td>
								{#if index < deliveryAddresses.length - 1}
									{address.detailAddress}
								{:else}
									<div class="flex justify-between">
										<InputText bind:value={address.detailAddress} />
										<TextButton text="주소검색" on:click={searchAddress} />
									</div>
								{/if}
							</Td>
						</Tr>
					{/each}
				</Tbody>
			</Table>
		{/if}
	</ModalDialog>
{/if}
