<script>
	import MdWhite from '$lib/components/base/MdWhite.svelte';
	import { Moon } from 'svelte-loading-spinners';

	export let classes = '',
		text = '',
		red = false,
		fill = false,
		loading = false;
</script>

<button
	on:click
	class="px-3 py-2
	{classes}
	{fill ? 'w-full' : ''}
{red
		? 'bg-red-500 hover:bg-red-600'
		: 'bg-blue-500 hover:bg-blue-600'} rounded text-center w-fit flex justify-center items-center"
	disabled={loading}
>
	{#if loading}
		<Moon size="20" color={'#FFFFFF'} />
	{:else}
		<MdWhite classes="whitespace-nowrap" {text} bold />
	{/if}
</button>
