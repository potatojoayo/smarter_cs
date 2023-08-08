<script lang="ts">
	import type { FormEventHandler } from 'svelte/elements';

	export let placeholder = '';
	export let value = '';
	export let classes = '';
	export let onInput: FormEventHandler<HTMLInputElement> | undefined = undefined;
	export let onSubmit: null | (() => void) = null;
	export let disabled = false;
</script>

<form
	on:submit={(e) => {
		e.preventDefault();
		if (onSubmit) onSubmit();
	}}
	class="w-full"
>
	<input
		class="{classes} placeholder:text-gray-400 p-2 border rounded h-10 text-sm"
		{placeholder}
		{disabled}
		type="text"
		bind:value
		name="search"
		on:input={onInput}
	/>
</form>
