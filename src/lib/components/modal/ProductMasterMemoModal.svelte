<script lang="ts">
	import ModalButton from '$data/classes/ModalButton';
	import type ProductMaster from '$data/classes/ProductMaster';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import TextArea from '../input/TextArea.svelte';

	import ModalDialog from './ModalDialog.svelte';

	export let productMaster: ProductMaster,
		open = false;
</script>

<ModalDialog
	bind:open
	title="{productMaster.name} 메모"
	buttons={[
		new ModalButton({
			title: '닫기',
			color: ButtonColor.blue,
			onClick: () => {
				open = false;
			}
		})
	]}
>
	<TextArea value={productMaster.memo} disabled classes="w-full min-w-[400px]" />
</ModalDialog>
