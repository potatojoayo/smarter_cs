<script>
	export let bold = false;
	export let text = '';
	export let classes = '';
</script>

<span class="{classes} {bold ? 'font-bold' : ''} text-gray-600 text-sm break-words w-full">
	{text}
	<slot />
</span>
