<script lang="ts">
	import ModalDialog from '$lib/components/modal/ModalDialog.svelte';
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import AddressSearch from 'svelte-daum-postcode';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import type Customer from '$data/classes/Customer';

	export let open = false,
		customer: Customer;

	let address: string, zipCode: string, detailAddress: string;

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
		address = data.address;
		zipCode = data.zonecode;
	}

	async function handleChange() {
		if (!detailAddress) {
			return alert('상세주소를 입력해주세요.');
		}
		if (
			await customer.updateUserInfo({
				address,
				detailAddress,
				zipCode
			})
		) {
			customer.address = address;
			customer.detailAddress = detailAddress;
			customer.zipCode = zipCode;
			alert('성공적으로 변경되었습니다.');
			open = false;
		}
	}
</script>

{#if open}
	<ModalDialog
		title="주소변경"
		bind:open
		buttons={address
			? [
					new ModalButton({
						title: '취소',
						color: ButtonColor.red,
						onClick: () => {
							open = false;
						}
					}),
					new ModalButton({
						title: '변경',
						color: ButtonColor.blue,
						onClick: handleChange
					})
			  ]
			: [
					new ModalButton({
						title: '취소',
						color: ButtonColor.red,
						onClick: () => {
							open = false;
						}
					})
			  ]}
	>
		<div class="w-[560px]">
			{#if !address}
				<AddressSearch on:complete={handleComplete} />
			{:else}
				<div class="flex flex-col w-full">
					<MdBlack>우편번호</MdBlack>
					<div class="mt-2 space-x-4 flex">
						<InputText disabled value={zipCode} />
						<Button
							text="재검색"
							on:click={() => {
								address = zipCode = detailAddress = undefined;
							}}
						/>
					</div>
					<MdBlack classes="mt-4">주소</MdBlack>
					<InputText disabled value={address} classes="w-full mt-2" />
					<MdBlack classes="mt-4">상세주소</MdBlack>
					<InputText bind:value={detailAddress} classes="w-full mt-2" />
				</div>
			{/if}
		</div>
	</ModalDialog>
{/if}
