<script lang="ts">
	import type { FormEventHandler } from 'svelte/elements';

	import MdGray from '../base/MdGray.svelte';
	import { browser } from '$app/environment';
	import type { InputSelectItem } from '$data/types/InputSelectItem';

	type T = $$Generic;
	export let placeholder = '';
	export let classes = '';
	export let selected: T | undefined = undefined;
	export let getItems: (value: string) => Promise<InputSelectItem<T>[]>;
	export let onSelect: (item: T) => void = null;

	let items: InputSelectItem<T>[] = [];
	let open = false;
	let value = '';
	let timeoutId;

	const close = () => {
		open = false;
	};

	const handleInput: FormEventHandler<HTMLInputElement> = async (e) => {
		value = e.currentTarget.value;
		clearTimeout(timeoutId);
		if (value)
			timeoutId = setTimeout(() => {
				open = true;
				getItems(value).then((i) => {
					items = i;
				});
			}, 500);
		else {
			items = [];
		}
	};

	$: {
		if (browser) {
			if (open) {
				window.addEventListener('click', close);
			} else {
				window.removeEventListener('click', close);
			}
		}
	}
</script>

<div class="relative">
	<input
		class="{classes} h-10 border rounded py-1 px-2 items-center flex justify-between space-x-4 whitespace-nowrap"
		{placeholder}
		bind:value
		on:input={handleInput}
	/>
	{#if items && items.length > 0 && open}
		<div
			class="w-full max-h-[170px] border rounded py-1 px-2 items-left cursor-pointer flex flex-col overflow-scroll absolute whitespace-nowrap bg-white z-20 mt-1"
		>
			{#each items as item}
				<button
					class="h-auto p-2 cursor-pointer text-left hover:bg-gray-100 rounded"
					on:click={() => {
						selected = item.data;
						open = false;
						value = '';
						if (onSelect) {
							onSelect(selected);
						}
					}}
				>
					<MdGray text={item.label} />
				</button>
			{/each}
		</div>
	{/if}
</div>
