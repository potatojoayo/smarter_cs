<script>
	export let isEnd = false,
		isFirst = false,
		isCurrent = false;
</script>

<button
	on:click
	class="text-center {isCurrent
		? 'bg-blue-500 text-white'
		: 'border-r border-t border-b bg-transparent text-gray-500 hover:bg-gray-100'} {isEnd
		? 'rounded-r'
		: ''} {isFirst ? 'rounded-l border-l' : ''} w-8 h-8"
>
	<slot />
</button>
