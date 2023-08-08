<script lang="ts">
	import ModalDialog from '$lib/components/modal/ModalDialog.svelte';
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import Customer from '$data/classes/Customer';

	export let open = false,
		customer: Customer;

	let refundAccountBank = customer.refundAccountBank,
		refundAccountNo = customer.refundAccountNo,
		refundAccountOwner = customer.refundAccountOwner;

	async function handleUpdate() {
		if (!confirm('수정하시겠습니까?')) return;
		if (!refundAccountOwner || !refundAccountBank || !refundAccountNo) {
			return alert('계좌 정보를 모두 입력해주세요.');
		}
		if (
			await customer.updateUserInfo({
				refundAccountBank,
				refundAccountNo,
				refundAccountOwner
			})
		) {
			alert('수정되었습니다.');
			customer.refundAccountBank = refundAccountBank;
			customer.refundAccountOwner = refundAccountOwner;
			customer.refundAccountNo = refundAccountNo;
			open = false;
		} else {
			alert('수정에 실패하였습니다.');
		}
	}
</script>

{#if open}
	<ModalDialog
		classes="w-[400px]"
		title="환불계좌 수정"
		bind:open
		buttons={[
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
				onClick: handleUpdate
			})
		]}
	>
		<MdBlack>은행</MdBlack>
		<InputText bind:value={refundAccountBank} classes="mt-2" />
		<MdBlack classes="mt-4">계좌번호</MdBlack>
		<InputText bind:value={refundAccountNo} classes="mt-2" />
		<MdBlack classes="mt-4">예금주</MdBlack>
		<InputText bind:value={refundAccountOwner} classes="mt-2" />
	</ModalDialog>
{/if}
