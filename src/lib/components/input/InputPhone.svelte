<script lang="ts">
	import { formatPhone } from '$lib/utils/formatPhone';
	import extractNumberString from '$lib/utils/extractNumberString';

	export let placeholder = '';
	export let phone;
	export let classes = '';
	export let onInput = null;
	export let onSubmit = null;
	export let disabled = false;
	let value = formatPhone(phone);
</script>

<form
	on:submit={(e) => {
		e.preventDefault();
		if (onSubmit) onSubmit();
	}}
>
	<input
		class="{classes} placeholder:text-gray-400 p-2 border rounded h-10 text-sm"
		{placeholder}
		{value}
		{disabled}
		maxlength="17"
		on:input={(e) => {
			const regExp = /[^0-9]/g;
			if (regExp.test(e.currentTarget.value)) {
				e.currentTarget.value = e.currentTarget.value.replace(regExp, '');
			}
			value = formatPhone(extractNumberString(e.currentTarget.value));
			phone = extractNumberString(value);
			if (onInput) onInput();
		}}
	/>
</form>
