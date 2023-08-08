<script lang="ts">
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import LgBlue from '$lib/components/base/LgBlue.svelte';
	import LgGray from '$lib/components/base/LgGray.svelte';
	import MdGray from '$lib/components/base/MdGray.svelte';
	import InputMoney from '$lib/components/input/InputMoney.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import type CouponMaster from '$data/classes/CouponMaster.js';

	export let data;

	let referralCoupon: CouponMaster = data.referralCoupon;
	let price = referralCoupon.price;
	let countPerIssue = referralCoupon.countPerIssue as number;
	let expireDay = referralCoupon.expireDay as number;

	async function handleCharge() {
		referralCoupon = (await referralCoupon.changeReferralCoupon({
			price,
			countPerIssue,
			expireDay
		})) as CouponMaster;
	}
</script>

<div class="p-8">
	<div class="w-full p-8 rounded-lg border bg-white">
		<div class="w-[992px] flex justify-between py-8 px-8">
			<div class="flex-1">
				<LgBlack text="추천인 쿠폰 설정" />
				<div class="mt-4">
					<MdGray
						text="추천인 코드가 사용되었을 때 추천한 유저에게 자동으로 발급되는 쿠폰입니다. 설정한 1장당 금액과 발급 수 만큼 추천 받은 사람 회원가입 시 추천인에게 자동발급 됩니다."
					/>
				</div>
				<div class=" flex flex-col mt-6">
					<div class="mr-2">
						<LgBlack text="총 발급매수" />
					</div>
					<div class="flex mt-4">
						<div class="mr-2">
							<MdGray text={referralCoupon.totalIssuedCount.toString()} />
						</div>
						<div>
							<MdGray text="매" />
						</div>
					</div>
				</div>
			</div>
			<div class="flex-1 pl-20">
				<div class="flex flex-col justify-start items-start">
					<MdGray text="1장당금액" />
					<div class="mt-2 flex">
						<InputMoney classes="w-auto text-xl" bind:value={price} />
						<div class="ml-2"><LgGray text="원" /></div>
					</div>
				</div>
				<div class="mt-8">
					<MdGray text="추천인 가입 시 발급매수" />
					<div class="flex">
						<div><InputText bind:value={countPerIssue} classes="w-auto text-xl" /></div>
						<div class="ml-2"><LgGray text="장" /></div>
					</div>
					<div class="mt-8">
						<MdGray text="사용기한" />
						<div class="flex justify-start items-center">
							<div class="mr-2">
								<LgGray text="발급일 기준" />
							</div>
							<div class="mr-2">
								<InputText bind:value={expireDay} classes="w-20 text-xl" />
							</div>
							<div>
								<LgGray text="일 이내" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="pb-8 pr-8 flex justify-end items-end">
			<button on:click={handleCharge}><LgBlue text="저장" /></button>
		</div>
	</div>
</div>
