<script>
	export let bold = false;
	export let text = '';
	export let classes = '';

</script>

<span class="{classes} text-xl font-regular text-gray-600" class:font-bold={bold}>
    {text}
</span>
