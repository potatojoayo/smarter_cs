<script lang="ts">
	export let state = '미결제';
</script>

<div
	class="px-2 py-1 w-fit rounded text-sm {state === '미결제'
		? 'bg-red-200 text-red-600'
		: 'bg-green-200 text-green-700'}"
>
	{state}
</div>
