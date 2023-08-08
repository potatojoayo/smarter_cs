<script lang="ts">
	import ModalDialog from '$lib/components/modal/ModalDialog.svelte';
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import AddressSearch from 'svelte-daum-postcode';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import InputPhone from '$lib/components/input/InputPhone.svelte';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	import DeliveryAddress from '$data/classes/DeliveryAddress';

	export let open = false,
		deliveryAddress: DeliveryAddress = new DeliveryAddress({
			id: 0,
			name: '',
			receiver: '',
			address: '',
			detailAddress: '',
			isDefault: false,
			phone: '',
			zipCode: ''
		}),
		deliveryAddresses: DeliveryAddress[] = [];

	let changeAddress = false;

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
		deliveryAddress.address = data.address;
		deliveryAddress.zipCode = data.zonecode;
		changeAddress = false;
	}

	async function handleChange() {
		changeAddress = true;
	}

	async function handleConfirm() {
		const { success, addresses } = await deliveryAddress.save();
		if (success) {
			alert('배송지가 수정되었습니다.');
			deliveryAddresses = addresses;
			open = false;
		} else {
			alert('배송지가 수정이 실패하였습니다.');
		}
	}

	async function handleDelete() {
		if (deliveryAddress.isDefault) {
			return alert('기본배송지는 삭제할 수 없습니다.');
		}
		if (!confirm('배송지를 삭제하시겠습니까?')) return;
		const success = await deliveryAddress.delete();
		if (success) {
			alert('배송지가 삭제되었습니다.');
			await changeSearchParam({
				param: 'deliveryAddressPage',
				value: '1',
				invalidateAll: true,
				noScroll: true
			});
			open = false;
		} else {
			alert('배송지 삭제가 실패하였습니다.');
		}
	}
</script>

{#if open}
	<ModalDialog
		title="배송지 수정"
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
						title: '삭제',
						color: ButtonColor.red,
						onClick: handleDelete
					}),
					new ModalButton({
						title: '취소',
						color: ButtonColor.red,
						onClick: () => {
							open = false;
						}
					}),
					new ModalButton({
						title: '수정',
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
							<InputText bind:value={deliveryAddress.name} classes="w-full mt-2" />
						</div>
						<div class="flex flex-col">
							<MdBlack classes="mt">기본배송지</MdBlack>
							<input
								type="checkbox"
								checked={deliveryAddress.isDefault}
								class="mt-2 w-10 h-10"
								disabled={deliveryAddress.isDefault}
								on:change={() => {
									deliveryAddress.isDefault = !deliveryAddress.isDefault;
								}}
							/>
						</div>
					</div>
					<div class="flex space-x-4">
						<div class="flex flex-col">
							<MdBlack classes="mt-4">받는사람</MdBlack>
							<InputText bind:value={deliveryAddress.receiver} classes="w-full mt-2" />
						</div>
						<div class="flex flex-col">
							<MdBlack classes="mt-4">연락처</MdBlack>
							<InputPhone bind:phone={deliveryAddress.phone} classes="w-full mt-2" />
						</div>
					</div>
					<MdBlack classes="mt-4">우편번호</MdBlack>
					<div class="mt-2 space-x-4 flex">
						<InputText disabled value={deliveryAddress.zipCode} />
						<Button text="검색" on:click={handleChange} />
					</div>
					<MdBlack classes="mt-4">주소</MdBlack>
					<InputText disabled value={deliveryAddress.address} classes="w-full mt-2" />
					<MdBlack classes="mt-4">상세주소</MdBlack>
					<InputText bind:value={deliveryAddress.detailAddress} classes="w-full mt-2" />
					<MdBlack classes="mt-4">메모</MdBlack>
					<TextArea bind:value={deliveryAddress.deliveryMemo} classes="w-full mt-2" />
				</div>
			{/if}
		</div>
	</ModalDialog>
{/if}
