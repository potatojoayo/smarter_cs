<script lang="ts">
	import ModalDialog from '$lib/components/modal/ModalDialog.svelte';
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import AddressSearch from 'svelte-daum-postcode';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import DeliveryAddress from '$data/classes/DeliveryAddress';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import InputPhone from '$lib/components/input/InputPhone.svelte';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';

	export let open = false,
		gymId;

	let changeAddress = false,
		address,
		detailAddress,
		name,
		zipCode,
		deliveryMemo,
		receiver,
		phone,
		isDefault = false;

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
		changeAddress = false;
	}

	async function handleChange() {
		changeAddress = true;
	}

	async function handleConfirm() {
		if (!name) {
			alert('배송지명을 입력해주세요.');
			return;
		}
		if (!receiver) {
			alert('받는사람을 입력해주세요.');
			return;
		}
		if (!phone) {
			alert('연락처를 입력해주세요.');
			return;
		} else if (phone.length !== 11) {
			alert('연락처를 정확히 입력해주세요.');
			return;
		}
		if (!zipCode) {
			alert('우편번호를 입력해주세요.');
			return;
		}
		if (!address) {
			alert('주소를 입력해주세요.');
			return;
		}
		if (!detailAddress) {
			alert('상세주소를 입력해주세요.');
			return;
		}
		const success = await DeliveryAddress.create({
			gymId,
			address,
			deliveryMemo,
			detailAddress,
			isDefault,
			name,
			phone,
			receiver,
			zipCode
		});
		if (success) {
			await alert('배송지가 추가되었습니다.');
			await changeSearchParam({
				param: 'deliveryAddressPage',
				value: '1',
				invalidateAll: true,
				noScroll: true
			});
			open = false;
		} else {
			alert('배송지 추가에 실패하였습니다.');
		}
	}
</script>

{#if open}
	<ModalDialog
		title="배송지 추가"
		bind:open
		buttons={changeAddress
			? [
					new ModalButton({
						title: '취소',
						color: ButtonColor.red,
						onClick: () => {
							changeAddress = false;
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
						title: '추가',
						color: ButtonColor.blue,
						onClick: handleConfirm
					})
			  ]}
	>
		<div class="w-[560px]">
			{#if changeAddress}
				<AddressSearch on:complete={handleComplete} />
			{:else}
				<div class="flex flex-col w-full items-start">
					<div class="flex space-x-4 items-start">
						<div class="flex flex-col">
							<MdBlack>배송지명</MdBlack>
							<InputText bind:value={name} classes="w-full mt-2" />
						</div>
						<div class="flex flex-col">
							<MdBlack classes="mt">기본배송지</MdBlack>
							<input
								type="checkbox"
								checked={isDefault}
								class="mt-2 w-10 h-10"
								on:change={() => {
									isDefault = !isDefault;
								}}
							/>
						</div>
					</div>
					<div class="flex space-x-4">
						<div class="flex flex-col">
							<MdBlack classes="mt-4">받는사람</MdBlack>
							<InputText bind:value={receiver} classes="w-full mt-2" />
						</div>
						<div class="flex flex-col">
							<MdBlack classes="mt-4">연락처</MdBlack>
							<InputPhone bind:phone classes="w-full mt-2" />
						</div>
					</div>
					<MdBlack classes="mt-4">우편번호</MdBlack>
					<div class="mt-2 space-x-4 flex">
						<InputText disabled value={zipCode} />
						<Button text="검색" on:click={handleChange} />
					</div>
					<MdBlack classes="mt-4">주소</MdBlack>
					<InputText disabled value={address} classes="w-full mt-2" />
					<MdBlack classes="mt-4">상세주소</MdBlack>
					<InputText bind:value={detailAddress} classes="w-full mt-2" />
					<MdBlack classes="mt-4">메모</MdBlack>
					<TextArea bind:value={deliveryMemo} classes="w-full mt-2" />
				</div>
			{/if}
		</div>
	</ModalDialog>
{/if}
