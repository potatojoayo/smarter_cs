<script lang="ts">
	import ModalDialog from '$lib/components/modal/ModalDialog.svelte';
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import { onMount } from 'svelte';
	import type OrderDetail from '$data/classes/OrderDetail';
	import MdBlack from '../base/MdBlack.svelte';
	import LgBlack from '../base/LgBlack.svelte';
	import type Delivery from '$data/classes/Delivery';
	export let open = false,
		orderDetail: OrderDetail;

	let delivery: Delivery;

	onMount(async () => {
		await orderDetail.getDelivery();

		if (orderDetail.delivery) delivery = orderDetail.delivery;
	});
</script>

{#if open && delivery}
	<ModalDialog
		title="배송정보"
		bind:open
		buttons={[
			new ModalButton({
				title: '확인',
				color: ButtonColor.blue,
				onClick: () => {
					open = false;
				}
			})
		]}
	>
		<MdBlack>배송사</MdBlack>
		<LgBlack>{delivery.deliveryAgency.name}</LgBlack>
		<MdBlack classes="mt-4">송장번호</MdBlack>
		<LgBlack>{delivery.trackingNumber}</LgBlack>
	</ModalDialog>
{/if}
