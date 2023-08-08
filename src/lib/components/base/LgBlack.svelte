<script>
	export let bold = false;
	export let text = '',
		classes = '';
</script>

<span class="{classes} text-xl font-regular text-gray-800" class:font-bold={bold}>
	{text}
	<slot />
</span>
