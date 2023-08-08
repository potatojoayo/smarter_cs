<script lang="ts">
	import SidebarMenu from '$data/classes/SidebarMenu';
	import SidebarMenuItem from '$data/classes/SidebarMenuItem';
	import LgGray from '$lib/components/base/LgGray.svelte';
	import LgWhite from '$lib/components/base/LgWhite.svelte';
	import { page } from '$app/stores';

	export let menus: SidebarMenu[] = [];
	let selectedMenu: SidebarMenu;
	let selectedSubMenu: SidebarMenuItem;
	export let doubleColumn = false;

	$: {
		menus.forEach((m) => {
			if ($page.url.pathname.includes(m.link)) {
				selectedMenu = m;
				m.subMenus.forEach((s) => {
					if ($page.url.pathname.includes(s.link)) {
						selectedSubMenu = s;
					}
				});
			}
		});
	}
</script>

<div class="flex fixed bg-white">
	<div class="h-screen w-[192px] p-4 border-r flex flex-col items-start">
		{#each menus as menu}
			<a
				href={doubleColumn ? menu.subMenus[0].link : menu.link}
				class="px-4 py-2 rounded w-full text-left mt-2 {selectedMenu === menu
					? 'bg-blue-500'
					: 'hover:bg-gray-100'}"
			>
				{#if selectedMenu === menu}
					<LgWhite text={menu.name} />
				{:else}
					<LgGray text={menu.name} />
				{/if}
			</a>
		{/each}
	</div>
	{#if doubleColumn}
		<div class="h-screen w-[192px] p-4 border-r flex flex-col items-start">
			{#each selectedMenu.subMenus as subMenu}
				<a
					href={subMenu.link}
					class="pl-4 py-2 rounded w-full text-left mt-2 {selectedSubMenu === subMenu
						? 'bg-blue-500'
						: 'hover:bg-gray-100'}"
				>
					{#if selectedSubMenu === subMenu}
						<LgWhite text={subMenu.name} />
					{:else}
						<LgGray text={subMenu.name} />
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</div>
