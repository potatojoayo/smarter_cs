<script lang="ts">
	export let state = '판매중';
	let color = 'bg-green-200 text-green-700';
	$: {
		switch (state) {
			case '품절':
				color = 'bg-red-200 text-red-600';
				break;
			case '숨김':
				color = 'bg-gray-200 text-gray-600';
		}
	}
</script>

<div class="px-2 py-1 w-fit rounded text-sm {color}">
	{state}
</div>
