<script lang="ts">
	export let state = '결제전';

	let color = 'bg-blue-200 text-blue-600';
	$: {
		switch (state) {
			case '결제전':
				color = 'bg-yellow-200 text-yellow-600';
				break;
			case '결제완료':
				color = 'bg-green-200 text-green-600';
				break;
			case '작업':
				color = 'bg-orange-200 text-oragne-600';
				break;
			case '주문취소':
				color = 'bg-red-200 text-red-600';
				break;
			case '배송':
				color = 'bg-purple-200 text-purple-600';
				break;
		}
	}
</script>

<div class="px-2 py-1 w-fit rounded text-sm {color}">
	{state}
</div>
