<script lang="ts">
	import ModalDialog from '$lib/components/modal/ModalDialog.svelte';
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import formatMoney from '$lib/utils/formatMoney';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import type Customer from '$data/classes/Customer';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	import InputMoney from '$lib/components/input/InputMoney.svelte';

	export let open = false,
		customer: Customer;

	let amount: number,
		description: string,
		balanceAfterWithdraw = customer.smarterMoney;

	async function handleWithdraw() {
		if (!confirm('차감하시겠습니까?')) return;
		if (!amount) {
			return alert('차감금액을 입력해주세요.');
		}
		if (
			await customer.subtractSmarterMoney({
				amount,
				description
			})
		) {
			alert('차감 처리 되었습니다.');
			await changeSearchParam({
				param: 'smarterMoneyPage',
				value: '1',
				noScroll: true,
				invalidateAll: true
			});
			open = false;
		} else {
			return alert('차감에 실패했습니다.');
		}
	}
</script>

{#if open}
	<ModalDialog
		title="스마터머니 차감"
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
				title: '차감',
				color: ButtonColor.blue,
				onClick: handleWithdraw
			})
		]}
	>
		<MdBlack>차감금액</MdBlack>
		<div class="flex items-center space-x-2 mt-2 w-fit">
			<InputMoney
				bind:value={amount}
				onInput={(value) => {
					balanceAfterWithdraw = customer.smarterMoney - value;
				}}
			/>
			<MdBlack>원</MdBlack>
		</div>
		<MdBlack classes="mt-4">내용</MdBlack>
		<TextArea bind:value={description} classes="w-96 mt-2" />
		<MdBlack classes="mt-4">차감후 잔액</MdBlack>
		<LgBlack classes="mt-2">{formatMoney({ money: balanceAfterWithdraw })}</LgBlack>
	</ModalDialog>
{/if}
