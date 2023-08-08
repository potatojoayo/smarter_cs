<script lang="ts">
	import type Customer from '$data/classes/Customer';
	import type DeliveryAddress from '$data/classes/DeliveryAddress';
	import TaOrder from '$lib/components/ta/TaOrder.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let customer: Customer | undefined, deliveryAddresses: DeliveryAddress[] | undefined;
	const { parentCategories } = data;

	$: {
		customer = data.customer;
		deliveryAddresses = data.deliveryAddresses;
	}
</script>

<TaOrder {parentCategories} {customer} {deliveryAddresses} />
