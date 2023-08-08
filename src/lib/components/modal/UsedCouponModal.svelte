<script lang="ts">
	import ModalButton from '$data/classes/ModalButton';
	import type OrderMaster from '$data/classes/OrderMaster';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import formatMoney from '$lib/utils/formatMoney';
	import LgBlack from '../base/LgBlack.svelte';
	import MdBlack from '../base/MdBlack.svelte';
	import ModalDialog from './ModalDialog.svelte';

	export let open = false,
		orderMaster: OrderMaster | undefined;
	console.log(orderMaster);

	let couponName = orderMaster?.couponName ?? '사용한 쿠폰이 존재 하지 않습니다.',
		couponNumber = orderMaster?.couponNumber ?? '',
		couponPrice = orderMaster?.couponPrice ?? 0;
</script>

{#if open}
	<ModalDialog
		title="사용쿠폰정보"
		bind:open
		buttons={[
			new ModalButton({
				title: '닫기',
				color: ButtonColor.red,
				onClick: () => {
					open = false;
				}
			})
		]}
	>
		<div class="w-96 h-48 space-y-4 flex flex-col justify-center items-start">
			<div class="flex flex-col justify-center items-start">
				<LgBlack>쿠폰이름</LgBlack>
				<MdBlack classes="mt-2" text={couponName} />
			</div>
			<div class="flex flex-col justify-center items-start">
				<LgBlack>쿠폰번호</LgBlack>
				<MdBlack classes="mt-2" text={couponNumber} />
			</div>
			<div class="flex flex-col justify-center items-start">
				<LgBlack>쿠폰금액</LgBlack>
				<MdBlack classes="mt-2" text={formatMoney({ money: couponPrice })} />
			</div>
		</div>
	</ModalDialog>
{/if}
