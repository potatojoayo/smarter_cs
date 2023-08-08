<script>
	export let classes = '',
		colspan = '1',
		rowspan = '1';
</script>

<td class="{classes} py-2 text-left pr-8 text-sm" {colspan} {rowspan}>
	<slot />
</td>
