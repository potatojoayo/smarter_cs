<script lang="ts">
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import type DeliveryAddress from '$data/classes/DeliveryAddress';
	import { formatPhone } from '$lib/utils/formatPhone.js';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import { deleteSearchParams } from '$lib/utils/deleteSearchParams';
	import EditDeliveryAddressModal from '$lib/components/modal/EditDeliveryAddressModal.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import CreateDeliveryAddressModal from '$lib/components/modal/CreateDeliveryAddressModal.svelte';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';

	export let deliveryAddresses: DeliveryAddress[],
		totalCount = 0,
		editable = false,
		back = false,
		gymId: number | undefined = undefined;

	let editDeliveryAddressModalOpen = false,
		createDeliveryAddressModalOpen = false,
		deliveryAddress: DeliveryAddress;

	function openEditDeliveryAddressModal(selectedDeliveryAddress: DeliveryAddress) {
		editDeliveryAddressModalOpen = true;
		deliveryAddress = selectedDeliveryAddress;
	}

	function openCreateDeliveryAddressModal() {
		createDeliveryAddressModalOpen = true;
	}

	async function setDefault(address: DeliveryAddress) {
		if (!confirm('기본배송지로 변경하시겠습니까?')) return;

		address.isDefault = true;
		const { success, addresses } = await address.save();
		if (success) {
			alert('변경되었습니다.');
			deliveryAddresses = addresses ?? [];
		} else {
			alert('변경에 실패하였습니다.');
		}
	}
</script>

<div class="flex flex-col p-8 border rounded bg-white">
	<div class="flex justify-between">
		{#if back}
			<button
				on:click={() => {
					changeSearchParam({
						param: 'mode',
						value: 'Default'
					});
				}}
				class="flex space-x-2 items-center w-fit"
			>
				<i class="fa-regular fa-arrow-left text-gray-700 text-2xl" />
				<LgBlack>배송지 목록</LgBlack>
			</button>
		{:else}
			<LgBlack>배송지 목록</LgBlack>
		{/if}
		{#if editable}
			<Button text="배송지 추가" on:click={openCreateDeliveryAddressModal} />
		{/if}
	</div>

	<Table classes="mt-4 w-full">
		<Thead>
			<Th classes="w-32">배송지명</Th>
			<Th classes="w-28">기본배송지</Th>
			<Th classes="w-28">받는사람</Th>
			<Th classes="w-40">연락처</Th>
			<Th>주소</Th>
			<Th classes="w-40">배송메모</Th>
			{#if editable}
				<Th classes="w-20" />
			{/if}
		</Thead>
		<Tbody>
			{#each deliveryAddresses as address}
				<Tr>
					<Td>
						{address.name}
					</Td>
					<Td>
						<input
							type="radio"
							name="isDefault"
							checked={address.isDefault}
							disabled={!editable}
							on:change={() => setDefault(address)}
							class="w-4 h-4"
						/>
					</Td>
					<Td>
						{address.receiver}
					</Td>
					<Td>
						{formatPhone(address.phone)}
					</Td>
					<Td>
						{address.address}
						{address.detailAddress}
						(우:{address.zipCode}
						)
					</Td>
					<Td>
						{address.deliveryMemo ?? ''}
					</Td>
					{#if editable}
						<Td>
							<TextButton text="수정" on:click={() => openEditDeliveryAddressModal(address)} />
						</Td>
					{/if}
				</Tr>
			{/each}
		</Tbody>
	</Table>
	<div class="mt-8 flex justify-center items-center">
		<Pagination param="deliveryAddressPage" rowCount={10} {totalCount} />
	</div>
</div>

{#if editDeliveryAddressModalOpen}
	<EditDeliveryAddressModal
		bind:open={editDeliveryAddressModalOpen}
		bind:deliveryAddress
		bind:deliveryAddresses
	/>
{/if}

{#if createDeliveryAddressModalOpen}
	<CreateDeliveryAddressModal bind:open={createDeliveryAddressModalOpen} {gymId} />
{/if}
