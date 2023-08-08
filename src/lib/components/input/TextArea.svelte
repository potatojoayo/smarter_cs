<script>
	export let placeholder = '';
	export let value = '';
	export let classes = '';
	export let readonly = false;
	export let disabled = false;
</script>

<textarea
	class="{classes} placeholder:text-gray-400 p-2 border rounded text-sm resize-none h-fit overflow-hidden"
	{placeholder}
	type="text"
	{disabled}
	oninput="this.style.height = '';this.style.height = this.scrollHeight + 'px'"
	bind:value
	{readonly}
/>
