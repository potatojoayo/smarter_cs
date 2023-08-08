<script>
	import MdBlack from '$lib/components/base/MdBlack.svelte';

	export let classes = '',
		loading = false;
</script>

<button
	on:click
	class="px-3 py-2
	{classes}
	border rounded
 rounded text-center w-fit flex justify-center items-center
 hover:bg-gray-100
"
	disabled={loading}
>
	<MdBlack>
		<slot />
	</MdBlack>
</button>
