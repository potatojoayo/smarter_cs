<script lang="ts">
	import CouponMaster from '$data/classes/CouponMaster';
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	import MdBlack from '../base/MdBlack.svelte';
	import InputMoney from '../input/InputMoney.svelte';
	import InputText from '../input/InputText.svelte';
	import ModalDialog from './ModalDialog.svelte';
	export let open = false;
	let couponName: string;
	let couponPrice: number;
	let couponMessage: string;

	async function save() {
		if (!couponName || !couponPrice) {
			return alert('모든항목을 입력해주세요');
		}
		const success = await CouponMaster.createManualCoupon({
			name: couponName,
			price: couponPrice,
			message: couponMessage
		});
		if (success) {
			changeSearchParam({ param: 'page', value: '1', invalidateAll: true });
		}
		open = false;
	}
</script>

{#if open}
	<ModalDialog
		bind:open
		title={'수동발행 쿠폰 만들기'}
		buttons={[
			new ModalButton({
				title: '취소',
				onClick: () => {
					open = false;
				},
				color: ButtonColor.red
			}),
			new ModalButton({
				title: '생성',
				color: ButtonColor.blue,
				onClick: save
			})
		]}
	>
		<div class="w-96 space-y-4">
			<div class="flex flex-col">
				<MdBlack text="쿠폰이름" />
				<InputText bind:value={couponName} classes="w-40 mt-2 w-full" />
			</div>
			<div class="flex flex-col justify-start">
				<MdBlack text="1장당 금액" />
				<div>
					<InputMoney bind:value={couponPrice} classes="w-24 mt-2" />
					<MdBlack text="원" />
				</div>
			</div>
		</div></ModalDialog
	>
{/if}
