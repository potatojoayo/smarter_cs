<script lang="ts">
	import MdGray from '../base/MdGray.svelte';
	import { browser } from '$app/environment';
	import MdWhite from '$lib/components/base/MdWhite.svelte';

	export let options: string[] = [],
		noDefault = false,
		classes = '',
		selected: string | undefined = undefined,
		disabled = false,
		onSelect: ((value: string) => void) | null = null,
		getOptions: (() => Promise<string[]>) | null = null;
	let firstOpen = false,
		open = false;

	if (!selected) {
		if (noDefault) selected = undefined;
		else selected = options[0];
	}

	const close = () => {
		open = false;
	};

	$: {
		if (browser) {
			if (open && !firstOpen) {
				if (getOptions) getOptions().then((os) => (options = os));
				window.addEventListener('click', close);
			} else {
				window.removeEventListener('click', close);
			}
		}
	}
</script>

<div class="relative">
	<button
		class="{classes} {disabled
			? 'cursor-default bg-gray-50'
			: 'cursor-pointer'} h-10 border rounded py-1 px-2 items-center flex justify-between space-x-4 whitespace-nowrap text-left"
		on:click={() => {
			if (disabled) {
				return;
			}
			if (!open) {
				open = true;
				firstOpen = true;
				setTimeout(() => {
					firstOpen = false;
				}, 100);
			} else {
				open = false;
			}
		}}
	>
		<MdGray>{selected ?? '선택'}</MdGray>
		{#if !disabled}
			<i class="fa-solid fa-chevron-down text-gray-500" />
		{/if}
	</button>
	{#if open}
		<div
			class="min-w-full w-auto max-h-[170px] border rounded py-1 px-2 items-left cursor-pointer flex flex-col overflow-scroll absolute whitespace-nowrap bg-white z-20 mt-1"
		>
			{#each options as option}
				<button
					class="h-auto py-2 px-3 cursor-pointer text-left rounded {option === selected
						? 'bg-blue-500'
						: 'hover:bg-gray-100'}"
					on:click={() => {
						selected = option;
						open = false;
						if (onSelect) {
							onSelect(selected);
						}
					}}
				>
					{#if selected === option}
						<MdWhite text={option} />
					{:else}
						<MdGray text={option} />
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
