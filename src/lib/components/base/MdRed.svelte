<script>
	export let bold = false;
	export let text = '';
</script>

<span class="{bold ? 'font-bold' : ''} text-red-500 text-sm">
	{text}
	<slot />
</span>
