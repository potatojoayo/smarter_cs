<script lang="ts">
	import type Customer from '$data/classes/Customer';
	import CustomerService from '$data/services/CustomerService';
	import type { InputSelectItem } from '$data/types/InputSelectItem';
	import { changeSearchParams } from '$lib/utils/changeSearchParams';
	import { formatPhone } from '$lib/utils/formatPhone';
	import InputSelect from './InputSelect.svelte';

	let classes = '';

	export { classes as class };

	export let onSelectCustomer = (c: Customer) => {
		changeSearchParams({
			params: [
				{
					param: 'gymId',
					value: c.gymId.toString()
				}
			]
		});
	};

	async function getItems(value: string) {
		const customers = await CustomerService.getCustomers({ keyword: value });
		const items: InputSelectItem<Customer>[] = [];
		customers.forEach((c) => {
			items.push({
				data: c,
				label: `${c.gymName} / ${c.userName} / ${formatPhone(c.phone)}`
			});
		});
		return items;
	}
</script>

<InputSelect
	placeholder="체육관명, 관장명, 전화번호"
	classes="w-full {classes}"
	{getItems}
	onSelect={onSelectCustomer}
/>
