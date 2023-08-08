<script>
	import TaAppBar from '$lib/components/app_bar/TaAppBar.svelte';
</script>

<div class="flex flex-col">
	<TaAppBar />
	<div class="flex mt-16 justify-center">
		<div class="max-w-[1500px] w-full py-8">
			<slot />
		</div>
	</div>
</div>
