<script lang="ts">
	import extractNumber from '$lib/utils/extractNumber';
	import extractNumberString from '$lib/utils/extractNumberString';

	export let value: number = 0,
		classes = '',
		disabled = false,
		onInput: ((value: number) => void) | null = null;
</script>

<input
	class="{classes} placeholder:text-gray-400 p-2 border rounded h-10 text-sm text-right"
	{disabled}
	type="text"
	value={value ? extractNumberString(value.toString()) : '0'}
	on:input={(e) => {
		e.preventDefault();
		const regExp = /[^0-9]/g;
		if (regExp.test(e.currentTarget.value)) {
			e.currentTarget.value = e.currentTarget.value.replace(regExp, '');
		}
		value = extractNumber(e.currentTarget.value);
		if (onInput) onInput(value);
	}}
/>
