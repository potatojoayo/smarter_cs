<script lang="ts">
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import MdGray from '$lib/components/base/MdGray.svelte';

	export let title: string;
	export let data = '';
</script>

<div class="grid grid-cols-3 py-2 items-center border-b min-h-[56px]">
	<dt class="whitespace-nowrap">
		<MdBlack>{title}</MdBlack>
	</dt>
	<dd class="col-span-2 flex justify-between items-center space-x-4">
		{#if data}
			<MdGray>
				{data}
			</MdGray>
		{/if}
		<MdGray classes="flex justify-between items-center"><slot /></MdGray>
	</dd>
</div>
