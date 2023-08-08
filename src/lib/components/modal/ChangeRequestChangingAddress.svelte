<script lang="ts">
	import AddressSearch from 'svelte-daum-postcode';
	import { formatPhone } from '$lib/utils/formatPhone';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import InputPhone from '$lib/components/input/InputPhone.svelte';
	import DeliveryAddress from '$data/classes/DeliveryAddress';

	export let addresses: DeliveryAddress[], selfAddress, selectedAddress;
	let searchingAddress = false;

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
</script>

{#if searchingAddress}
	<AddressSearch on:complete={handleComplete} />
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
{/if}
