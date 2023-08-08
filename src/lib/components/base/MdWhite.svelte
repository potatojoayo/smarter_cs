<script>
	export let bold = false;
	export let text = '';
	export let classes = '';
</script>

<span class="{classes} {bold ? 'font-bold' : ''} text-white text-sm">
	{text}
	<slot />
</span>
