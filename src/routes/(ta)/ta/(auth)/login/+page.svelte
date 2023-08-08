<script lang="ts">
	import logo from '$lib/assets/logo.png';
	import InputText from '$lib/components/input/InputText.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import InputPassword from '$lib/components/input/InputPassword.svelte';
	import UserService from '$data/services/UserService';

	let id;
	let password;

	async function handleLogin() {
		await UserService.getTaToken({
			id,
			password
		});
	}
</script>

<div class="flex flex-col items-center p-20">
	<img src={logo} alt="logo" class="w-20" />
	<div class="text-xl text-gray-800 mt-4">스마터 플러스</div>
	<div class="text-4xl text-gray-800">특판주문</div>
	<div class="mt-8 p-8 border bg-white rounded-lg">
		<div>아이디</div>
		<div class="w-80 mt-2">
			<InputText placeholder="" classes="w-full" bind:value={id} />
		</div>
		<div class="mt-4">비밀번호</div>
		<div class="w-80 mt-2">
			<InputPassword
				placeholder=""
				classes="w-full"
				bind:value={password}
				on:submit={handleLogin}
			/>
		</div>
		<div class="mt-4">
			{''}
		</div>
		<Button text="로그인" fill on:click={handleLogin} />
	</div>
</div>
