<script lang="ts">
	import ModalDialog from '$lib/components/modal/ModalDialog.svelte';
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import InputPassword from '$lib/components/input/InputPassword.svelte';
	import type Customer from '$data/classes/Customer';

	export let open = false;
	export let customer: Customer;

	let password;
	let confirmPassword;

	async function onChange() {
		if (!confirm('비밀번호를 변경하시겠습니까?')) return;
		if (!password || !confirmPassword) {
			alert('비밀번호와 확인 비밀번호를 모두 입력해주세요.');
			return false;
		}
		if (password !== confirmPassword) {
			return alert('비밀번호가 일치하지않습니다.');
		}
		const success = await customer.setPassword({
			password,
			confirmPassword
		});
		if (success) {
			alert('비밀번호가 변경되었습니다.');
		} else {
			alert('비밀번호 변경에 실패하였습니다.');
		}
		password = confirmPassword = undefined;
		open = false;
	}
</script>

{#if open}
	<ModalDialog
		title="비밀번호 변경"
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
				title: '변경',
				color: ButtonColor.blue,
				onClick: onChange
			})
		]}
	>
		<MdBlack>변경할 비밀번호</MdBlack>
		<InputPassword classes="mt-2 w-80" bind:value={password} />
		<MdBlack classes="mt-4">비밀번호 확인</MdBlack>
		<InputPassword classes="mt-2 w-80" bind:value={confirmPassword} />
	</ModalDialog>
{/if}
