<script lang="ts">
	import { ButtonColor } from '$data/enums/ButtonColor';
	import Button from '$lib/components/buttons/Button.svelte';
	import type ModalButton from '$data/classes/ModalButton';
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import Overlay from '$lib/components/modal/Overlay.svelte';
	import { onDestroy, onMount } from 'svelte';

	export let open = false,
		title = '',
		buttons: ModalButton[] = [],
		classes = '',
		loading = false;

	onMount(() => {
		if (!window.onkeydown)
			window.onkeydown = async (e) => {
				if (e.key === 'Escape' && !loading) {
					open = false;
				}
			};
	});
	onDestroy(() => {
		window.onkeydown = null;
	});
</script>

<Overlay bind:open />
<div
	class="{classes} flex rounded-lg border shadow bg-white fixed left-1/2 top-[45%] -translate-y-1/2 -translate-x-1/2 z-30"
>
	<div class="flex flex-col">
		<div class="p-4 border-b h-16 flex items-center">
			<LgBlack>
				{title}
			</LgBlack>
		</div>
		<div class="flex">
			<div class="flex flex-col">
				<div class="flex flex-col py-4 px-8 overflow-y-scroll max-h-[680px]">
					<slot />
				</div>
				<div class="flex justify-end p-8 space-x-2 border-t h-16 items-center">
					{#each buttons as button}
						<Button
							text={button.title}
							red={button.color === ButtonColor.red}
							bind:loading
							on:click={button.onClick}
						/>
					{/each}
				</div>
			</div>
			{#if $$slots.side}
				<div class="flex flex-col border-l">
					<slot name="side" />
				</div>
			{/if}
		</div>
	</div>
</div>
