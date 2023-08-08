<script lang="ts">
	export let label = '',
		classes = '',
		image,
		file,
		box = false;

	let input: HTMLInputElement;

	function onChange() {
		if (!input || !input.files) {
			return;
		}
		file = input.files[0];
		if (file) {
			const reader = new FileReader();
			reader.addEventListener('load', function () {
				image = reader.result;
			});
			reader.readAsDataURL(file);
		}
	}
</script>

{#if box}
	<label for="upload" class="{classes}  cursor-pointer w-full h-full">
		<div class="w-full h-full border text-center flex items-center justify-center">
			<i class="fa fa-plus text-primary text-3xl mx-auto" />
		</div>
	</label>
{:else}
	<label for="upload" class="{classes}  text-blue-500 cursor-pointer w-fit">
		{label}
	</label>
{/if}
<input
	type="file"
	accept="image/png, image/gif, image/jpeg"
	id="upload"
	class="hidden"
	bind:this={input}
	on:change={onChange}
/>
