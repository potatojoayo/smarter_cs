<script>
	export let date = new Date();
</script>

<span>
	{date.toLocaleDateString() +
		` ${date.getHours().toString().padStart(2, '0')}:${date
			.getMinutes()
			.toString()
			.padStart(2, '0')}`}
</span>
