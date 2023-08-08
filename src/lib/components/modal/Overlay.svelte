<script>
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';

	export let open;

	$: {
		if (browser) {
			if (open) {
				window.document.body.classList.add('stop-scroll');
			}
		}
	}

	onDestroy(() => {
		window.document.body.classList.remove('stop-scroll');
	});
</script>

<button
	class="w-[200%] h-[200%] fixed left-0 -top-8 bg-black bg-opacity-40 z-20 cursor-default"
	on:click={() => {
		open = false;
	}}
>
	{''}
</button>
