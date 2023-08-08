<script>
	import Logo from '$lib/assets/logo.png';
	import LgLightGray from '$lib/components/base/LgLightGray.svelte';
	import { page } from '$app/stores';
	import LgBlue from '$lib/components/base/LgBlue.svelte';
	import { goto } from '$app/navigation';
	import UserService from '$data/services/UserService';

	let appBarItems = [
		{
			name: '특판주문',
			link: '/ta/order'
		},
		{
			name: '주문관리',
			link: '/ta/list'
		}
	];

	async function handleLogoutClick() {
		await goto('/ta/login');
		await UserService.deleteTokenCookies();
	}
</script>

<header
	class="container-lg flex justify-between px-4 h-16 border-b fixed w-full bg-white items-center z-10"
>
	<div class="flex space-x-8 items-center">
		<a href="/ta/order">
			<img src={Logo} alt="logo" class="w-9 h-9" />
		</a>
		{#each appBarItems as item}
			<div
				class={$page.url.pathname.includes('/' + item.link.split('/')[2])
					? 'border-b-2 border-b-blue-400'
					: ''}
			>
				<a href={item.link}>
					{#if $page.url.pathname.includes('/' + item.link.split('/')[2])}
						<LgBlue text={item.name} />
					{:else}
						<LgLightGray text={item.name} classes="hover:text-blue-500" />
					{/if}
				</a>
			</div>
		{/each}
	</div>
	<button on:click={handleLogoutClick}>
		<LgLightGray text="로그아웃" classes="hover:text-red-500" />
	</button>
</header>
