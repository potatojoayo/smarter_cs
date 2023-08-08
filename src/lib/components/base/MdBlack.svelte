<script>
	export let bold = false;
	export let text = '';
	export let classes = '';
</script>

<span class="{classes} {bold ? 'font-bold' : ''} text-gray-800 text-sm">
	{text}
	<slot />
</span>
