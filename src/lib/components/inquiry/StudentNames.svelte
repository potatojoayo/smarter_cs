<script lang="ts">
	import type OrderDetail from '$data/classes/OrderDetail';
	import StudentNameItem from '$lib/components/inquiry/StudentNameItem.svelte';
	import { reload } from '$lib/utils/reload';

	export let orderDetail: OrderDetail,
		editable = false;

	let { studentNames } = orderDetail;

	async function onDelete(studentName: string) {
		if (!confirm('이름을 삭제하시겠습니까? 삭제 시 부분취소 처리됩니다.')) return;
		const { success, message } = await orderDetail.cancelStudent({ studentName });
		alert(message);
		if (success) {
			studentNames = studentNames!.filter((s) => s !== studentName);
			orderDetail.quantity -= 1;
			window.location.reload();
		}
	}
</script>

<div class="flex gap-2 p-2 flex-wrap">
	{#each studentNames as name}
		<StudentNameItem bind:name {editable} {onDelete} {orderDetail} />
	{/each}
</div>
