<script lang="ts">
	import RequestCategory from '$data/enums/RequestCategory';
	import RequestReason from '$data/enums/RequestReason';
	import DropdownSelect from '$lib/components/input/DropdownSelect.svelte';
	import DataColumn from '$lib/components/DataColumn.svelte';
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import InputSelect from '$lib/components/input/InputSelect.svelte';
	import CustomerService from '$data/services/CustomerService';
	import type Customer from '$data/classes/Customer';
	import type { InputSelectItem } from '$data/types/InputSelectItem';
	import { formatPhone } from '$lib/utils/formatPhone';
	import { formatBusinessRegistrationNumber } from '$lib/utils/formatBusinessRegistrationNumber';
	import formatMoney from '$lib/utils/formatMoney';
	import { changeSearchParams } from '$lib/utils/changeSearchParams';
	import { getInquiryType, InquiryType } from '$data/enums/InqueryType';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	import type OrderMaster from '$data/classes/OrderMaster';
	import Button from '$lib/components/buttons/Button.svelte';
	import CsRequest from '$data/classes/CsRequest';
	import InputText from '$lib/components/input/InputText.svelte';
	import { goto } from '$app/navigation';
	import TextButton from '../buttons/TextButton.svelte';
	import MdBlue from '../base/MdBlue.svelte';

	export let customer: Customer | undefined = undefined;
	export let category = '';
	export let orderMaster: OrderMaster | undefined = undefined;

	let reason: string;
	let etcReason = '';
	let contents = '';
	let memo = '';

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

	function onSelectCustomer(c: Customer) {
		changeSearchParams({
			params: [
				{
					param: 'gymId',
					value: c.gymId.toString()
				},
				{
					param: 'csRequestPage',
					value: '1'
				},
				{
					param: 'category',
					value: '일반문의'
				}
			],
			deleteParams: ['orderMasterPage', 'orderMasterId']
		});
	}

	function onSelectCategory(category: string) {
		if (getInquiryType({ category }) === InquiryType.order) {
			changeSearchParams({
				params: [
					{
						param: 'category',
						value: category
					},
					{
						param: 'orderMasterPage',
						value: '1'
					}
				],
				noScroll: true
			});
		} else {
			changeSearchParam({
				param: 'category',
				value: category,
				deleteParams: ['orderMasterId', 'orderMasterPage']
			});
		}
	}

	function onSelectReason(r: string) {
		reason = r;
	}

	async function onComplete() {
		if (!confirm('작성을 완료하시겠습니까?')) return;

		const result = await CsRequest.create({
			category,
			contents,
			gymId: customer!.gymId,
			memo,
			orderMasterId: orderMaster?.id,
			reason: reason === '기타' ? etcReason : reason
		});
		if (result.success) {
			alert('작성이 완료되었습니다.');
			await goto(`/inquiry/detail/${result.csRequestId}?category=${category}`, {
				replaceState: true
			});
		}
	}
</script>

<div
	class="h-[calc(100%-64px)] w-96 2xl:w-[480px] border-r bg-white flex flex-col fixed overflow-y-scroll"
>
	<div class="flex flex-col p-8 border-b">
		<LgBlack>고객정보</LgBlack>
		<div class="mt-2">{''}</div>
		<InputSelect
			placeholder="체육관명, 관장명, 전화번호"
			classes="w-full"
			{getItems}
			onSelect={onSelectCustomer}
		/>
		{#if customer}
			<div class="mt-2">{''}</div>
			<DataColumn title="아이디">
				{customer.identification}
			</DataColumn>
			<DataColumn title="체육관명">
				{customer.gymName}
			</DataColumn>
			<DataColumn title="관장명">
				{customer.userName}
			</DataColumn>
			<DataColumn title="연락처">
				{formatPhone(customer.phone)}
			</DataColumn>
			<DataColumn title="주소">
				{customer.address + ' ' + customer.detailAddress}
			</DataColumn>
			<DataColumn title="관할지사">
				{customer.agencyName ?? '-'}
			</DataColumn>
			<DataColumn title="스마터머니">
				{formatMoney({ money: customer.smarterMoney })}
			</DataColumn>
			<DataColumn title="사업자등록증">
				{formatBusinessRegistrationNumber(customer.businessRegistrationNumber)}
				{#if customer.businessRegistrationCertificate}
					<a href={`${customer.businessRegistrationCertificate}`} target="_blank" download
						><MdBlue text={'다운로드'} /></a
					>
				{/if}
			</DataColumn>
			<DataColumn title="메모">
				{customer.memo ?? ''}
			</DataColumn>
		{/if}
	</div>
	{#if customer}
		<div class="flex flex-col p-8">
			<LgBlack>문의사항</LgBlack>
			<div class="mt-4">{''}</div>
			<DataColumn title="구분">
				<DropdownSelect
					options={Object.values(RequestCategory).splice(1)}
					selected={category}
					onSelect={onSelectCategory}
				/>
			</DataColumn>
			{#if getInquiryType({ category }) === InquiryType.order}
				{#if category !== '오배송'}
					<DataColumn title="사유">
						<div class="flex flex-col w-full">
							<DropdownSelect
								options={Object.values(RequestReason)}
								noDefault
								onSelect={onSelectReason}
							/>

							{#if reason === '기타'}
								<div class="mt-2">
									<InputText
										bind:value={etcReason}
										classes="w-full"
										placeholder="사유를 입력해주세요."
									/>
								</div>
							{/if}
						</div>
					</DataColumn>
				{/if}
				<DataColumn title="주문번호" data={orderMaster ? orderMaster.orderNumber : '-'} />
				<DataColumn title="주문상태" data={orderMaster ? orderMaster.orderState : '-'} />
			{/if}

			<DataColumn title="문의내용">
				<TextArea classes="w-full" bind:value={contents} />
			</DataColumn>

			<DataColumn title="메모">
				<TextArea classes="w-full" bind:value={memo} />
			</DataColumn>
			<div class="my-4 flex justify-end">
				<Button text="등록하기" on:click={onComplete} />
			</div>
		</div>
	{/if}
</div>
