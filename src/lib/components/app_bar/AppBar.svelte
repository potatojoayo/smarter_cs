<script>
	import Logo from '$lib/assets/logo.png';
	import LgLightGray from '$lib/components/base/LgLightGray.svelte';
	import { page } from '$app/stores';
	import LgBlue from '$lib/components/base/LgBlue.svelte';
	import { goto } from '$app/navigation';
	import UserService from '$data/services/UserService';

	let appBarItems = [
		{
			name: 'CS리스트',
			link: '/inquiry/all'
		},
		{
			name: 'CS접수',
			link: '/new-inquiry'
		},
		{
			name: '쿠폰관리',
			link: '/coupon/new-member/issue'
		},
		{
			name: '주문취소',
			link: '/cancel-order/whole'
		},
		{
			name: '교환/반품',
			link: '/change-return/change-request'
		},
		{
			name: '상품관리',
			link: '/products'
		}
	];

	async function handleLogoutClick() {
		await goto('/login');
		await UserService.deleteTokenCookies();
	}
</script>

<header
	class="container-lg flex justify-between px-4 h-16 border-b fixed w-full bg-white items-center z-10"
>
	<div class="flex space-x-8 items-center">
		<a href="/inquiry/all">
			<img src={Logo} alt="logo" class="w-9 h-9" />
		</a>
		{#each appBarItems as item}
			<div
				class={$page.url.pathname.includes('/' + item.link.split('/')[1])
					? 'border-b-2 border-b-blue-400'
					: ''}
			>
				<a href={item.link}>
					{#if $page.url.pathname.includes('/' + item.link.split('/')[1])}
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
