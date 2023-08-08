<script>
	export let placeholder = '',
		value,
		classes = '';
</script>

<form on:submit>
	<input
		class="{classes} placeholder:text-gray-400 p-2 border rounded"
		{placeholder}
		type="password"
		bind:value
		name="password"
	/>
</form>
