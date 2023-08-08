<script>
	export let text = '',
		red = false,
		disabled = false,
		classes = '';
</script>

<button
	on:click|stopPropagation
	class="{classes} py-2 bg-transparent {disabled ? 'invisible' : ''} {red
		? 'text-red-400 hover:text-red-600'
		: 'text-blue-500 hover:text-blue-600'} text-center w-fit text-sm whitespace-nowrap"
>
	{text}
	<slot />
</button>
