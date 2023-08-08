<script lang="ts">
	import SideBar from '$lib/components/side_bar/SideBar.svelte';
	import AppBar from '$lib/components/app_bar/AppBar.svelte';
	import SidebarMenu from '$data/classes/SidebarMenu';
	import SidebarMenuItem from '$data/classes/SidebarMenuItem';
	import { page } from '$app/stores';

	let menus = [
		new SidebarMenu({
			name: '전체',
			subMenus: [],
			link: '/inquiry/all'
		})
	];

	let doubleColumn = false;
	let sidebar = false;

	$: {
		if ($page.url.pathname.includes('/inquiry/detail')) {
			sidebar = false;
		} else if ($page.url.pathname.includes('/inquiry')) {
			sidebar = false;
		} else if ($page.url.pathname.includes('new-inquiry')) {
			sidebar = false;
		} else if ($page.url.pathname.includes('cancel-order')) {
			doubleColumn = false;
			sidebar = true;
			menus = [
				new SidebarMenu({
					name: '주문취소',
					subMenus: [],
					link: '/cancel-order/whole'
				}),
				new SidebarMenu({
					name: '무통장취소',
					subMenus: [],
					link: '/cancel-order/without-deposit'
				}),
				new SidebarMenu({
					name: '부분취소',
					subMenus: [],
					link: '/cancel-order/partial'
				})
			];
		} else if ($page.url.pathname.includes('change-return')) {
			doubleColumn = false;
			sidebar = true;
			menus = [
				new SidebarMenu({
					name: '교환요청',
					subMenus: [],
					link: '/change-return/change-request'
				}),

				new SidebarMenu({
					name: '반품요청',
					subMenus: [],
					link: '/change-return/return-request'
				})
			];
		} else if ($page.url.pathname.includes('coupon')) {
			doubleColumn = true;
			sidebar = true;
			menus = [
				new SidebarMenu({
					name: '신규가입 쿠폰',
					subMenus: [
						new SidebarMenuItem({
							name: '발급내역',
							link: '/coupon/new-member/issue'
						}),
						new SidebarMenuItem({
							name: '사용내역',
							link: '/coupon/new-member/usage'
						}),
						new SidebarMenuItem({
							name: '설정',
							link: '/coupon/new-member/setting'
						})
					],
					link: '/coupon/new-member'
				}),
				new SidebarMenu({
					name: '추천인 쿠폰',
					subMenus: [
						new SidebarMenuItem({
							name: '발급내역',
							link: '/coupon/recommendation/issue'
						}),
						new SidebarMenuItem({
							name: '사용내역',
							link: '/coupon/recommendation/usage'
						}),
						new SidebarMenuItem({
							name: '설정',
							link: '/coupon/recommendation/setting'
						})
					],
					link: '/coupon/recommendation'
				}),
				new SidebarMenu({
					name: '수동발행 쿠폰',
					subMenus: [
						new SidebarMenuItem({
							name: '쿠폰목록',
							link: '/coupon/manual/list'
						}),
						new SidebarMenuItem({
							name: '발행내역',
							link: '/coupon/manual/publish'
						}),
						new SidebarMenuItem({
							name: '발급내역',
							link: '/coupon/manual/issue'
						}),
						new SidebarMenuItem({
							name: '사용내역',
							link: '/coupon/manual/usage'
						})
					],
					link: '/coupon/manual'
				})
			];
		} else {
			sidebar = false;
		}
	}
</script>

<div class="flex flex-col">
	<AppBar />
	<div class="flex mt-16">
		{#if sidebar}
			<SideBar {menus} {doubleColumn} />
		{/if}
		<div class={sidebar ? (doubleColumn ? 'ml-[384px]' : 'ml-[192px]') : ''}>{''}</div>
		<div class="w-full">
			<slot />
		</div>
	</div>
</div>
