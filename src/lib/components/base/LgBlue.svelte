<script>
	export let bold = false;
	export let text = '';
</script>

<span class="text-xl font-regular text-blue-500" class:font-bold={bold}>
	{text}
	<slot />
</span>
