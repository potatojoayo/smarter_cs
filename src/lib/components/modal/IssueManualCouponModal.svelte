<script lang="ts">
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import MdBlack from '../base/MdBlack.svelte';
	import DropdownSelect from '../input/DropdownSelect.svelte';
	import InputMoney from '../input/InputMoney.svelte';
	import ModalDialog from './ModalDialog.svelte';
	import { CouponIssueTargetType } from '$data/enums/CouponIssueTargetType';
	import { CouponIssueCondition } from '$data/enums/CouponIssueCondition';
	import SearchUser from '../input/SearchUser.svelte';
	import type Customer from '$data/classes/Customer';
	import Table from '../table/Table.svelte';
	import Thead from '../table/Thead.svelte';
	import Th from '../table/Th.svelte';
	import Tbody from '../table/Tbody.svelte';
	import Tr from '../table/Tr.svelte';
	import Td from '../table/Td.svelte';
	import { formatPhone } from '$lib/utils/formatPhone';
	import Button from '../buttons/Button.svelte';
	import CustomerService from '$data/services/CustomerService';
	import Pagination from '../pagination/Pagination.svelte';
	import formatMoney from '$lib/utils/formatMoney';
	import TextButton from '../buttons/TextButton.svelte';
	import InputNumber from '../input/InputNumber.svelte';
	import { onMount } from 'svelte';
	import CouponService from '$data/services/CouponService';
	import CouponMaster from '$data/classes/CouponMaster';
	import type { ParentAddressZipCode, AddressZipCode } from '$data/classes/AddressZipCode';
	import InputText from '../input/InputText.svelte';
	import { reload } from '$lib/utils/reload';

	export let open = false,
		couponName: string;

	let couponMessage: string,
		searchType = CouponIssueTargetType.condition,
		condition = CouponIssueCondition.all,
		priceThreshold: number | undefined,
		issueNumber: number,
		selectedCustomers: Customer[] = [],
		totalCount = 0,
		current = 1,
		couponMaster: CouponMaster,
		addressZipCodes: ParentAddressZipCode[],
		selectedParentAddressZipCode: ParentAddressZipCode | undefined,
		selectedChildAddressZipCode: AddressZipCode | undefined,
		expireDay = 30;

	onMount(async () => {
		couponMaster = new CouponMaster(await CouponService.getCouponMaster({ name: couponName }));
		addressZipCodes = await CouponService.addressZipCodes();
	});

	function resetCondition() {
		selectedCustomers = [];
		priceThreshold = undefined;
		condition = CouponIssueCondition.all;
		totalCount = 0;
		current = 1;
	}

	async function getCustomersByCondition() {
		let variables: {
			page: number;
			totalPurchasedAmount?: number;
			prevMonthPurchasedAmount?: number;
			addressZipCodeId?: number;
		} = { page: current };

		switch (condition) {
			case CouponIssueCondition.total:
				variables = {
					...variables,
					totalPurchasedAmount: priceThreshold
				};
				break;
			case CouponIssueCondition.prevMonth:
				variables = {
					...variables,
					prevMonthPurchasedAmount: priceThreshold
				};
				break;
		}
		if (selectedChildAddressZipCode) {
			variables = { ...variables, addressZipCodeId: selectedChildAddressZipCode.id };
		} else if (selectedParentAddressZipCode) {
			variables = {
				...variables,
				addressZipCodeId: selectedParentAddressZipCode.id
			};
		}
		const result = await CustomerService.getCustomersWithTotalCount(variables);
		selectedCustomers = result.customers;
		totalCount = result.totalCount;
	}

	function handleCheckClick() {
		current = 1;
		getCustomersByCondition();
	}

	function goToPage(page: number) {
		current = page;
		if (searchType === CouponIssueTargetType.condition) {
			getCustomersByCondition();
		}
	}

	function handleSelectCondition(selected: string) {
		const c = Object.values(CouponIssueCondition).find((v) => v === selected);
		if (c) condition = c;
		priceThreshold = undefined;
	}

	function handleDeleteButtonClick(gymId: number) {
		selectedCustomers = selectedCustomers.filter((s) => s.gymId !== gymId);
		totalCount = selectedCustomers.length;
	}

	function handleSelectCustomer(customer: Customer) {
		if (selectedCustomers.find((c) => c.gymId === customer.gymId))
			return alert('이미 추가된 체육관입니다.');
		selectedCustomers.push(customer);
		selectedCustomers = selectedCustomers;
		totalCount = selectedCustomers.length;
	}

	async function handleClickIssueButton() {
		if (!confirm('쿠폰을 발행하시겠습니까? 되돌릴 수 없습니다.')) return;
		if (!couponMaster) {
			return alert('쿠폰 발행에 실패했습니다. 개발팀에게 문의해주세요.');
		}
		if (!couponMessage || !issueNumber || !expireDay) {
			return alert('쿠폰 메세지와 발행수, 사용기한을 모두 입력해주세요.');
		}
		const { success, message } = await CouponService.issueManualCoupon({
			couponMasterId: couponMaster.id,
			gymIds: selectedCustomers.map((c) => c.gymId),
			issueNumber,
			expireDay,
			couponMessage,
			addressZipCodeId: selectedChildAddressZipCode
				? selectedChildAddressZipCode.id
				: selectedParentAddressZipCode
				? selectedParentAddressZipCode.id
				: undefined,
			condition,
			thresholdAmount: priceThreshold,
			searchType: searchType
		});
		alert(message);
		if (success) {
			reload();
			open = false;
		}
	}
</script>

{#if open && addressZipCodes}
	<ModalDialog
		bind:open
		title={couponName + ' 쿠폰 발급'}
		buttons={[
			new ModalButton({
				title: '취소',
				onClick: () => {
					open = false;
				},
				color: ButtonColor.red
			}),
			new ModalButton({
				title: '발급하기',
				color: ButtonColor.blue,
				onClick: handleClickIssueButton
			})
		]}
	>
		<div class="flex flex-col min-w-[800px] space-y-4 pb-4">
			<MdBlack>발급대상 검색</MdBlack>
			<div class="flex space-x-4">
				<input
					type="radio"
					name="filter"
					id="filter"
					value={CouponIssueTargetType.condition}
					bind:group={searchType}
					on:change={resetCondition}
				/>
				<label for="filter">
					<MdBlack>조건검색</MdBlack>
				</label>
				<input
					type="radio"
					name="search"
					id="search"
					value={CouponIssueTargetType.search}
					bind:group={searchType}
					on:change={resetCondition}
				/>
				<label for="search">
					<MdBlack>직접검색</MdBlack>
				</label>
			</div>
			{#if searchType === CouponIssueTargetType.condition}
				<div class="flex space-x-4">
					<div class="flex flex-col space-y-2">
						<MdBlack text="시도" />
						<DropdownSelect
							classes="min-w-[160px]"
							onSelect={(selected) => {
								condition = CouponIssueCondition.all;
								selectedParentAddressZipCode = addressZipCodes.find((a) => a.siDo === selected);
								selectedChildAddressZipCode = undefined;
							}}
							noDefault
							options={addressZipCodes.map((a) => a.siDo)}
						/>
					</div>
					<div class="flex flex-col space-y-2">
						<MdBlack text="시군구" />
						<DropdownSelect
							classes="min-w-[160px]"
							selected={selectedChildAddressZipCode ? selectedChildAddressZipCode.siGunGu : '전체'}
							onSelect={(selected) => {
								condition = CouponIssueCondition.all;
								if (selected == '전체') {
									selectedChildAddressZipCode = undefined;
								}
								if (!selectedParentAddressZipCode) return;
								selectedChildAddressZipCode = selectedParentAddressZipCode.children.find(
									(a) => a.siGunGu === selected
								);
							}}
							options={selectedParentAddressZipCode
								? ['전체'].concat(selectedParentAddressZipCode.children.map((a) => a.siGunGu))
								: []}
						/>
					</div>
					<div class="flex flex-col space-y-2">
						<MdBlack text="구매금액 조건" />
						<div class="flex items-center space-x-4">
							<DropdownSelect
								classes="min-w-[160px]"
								onSelect={handleSelectCondition}
								selected={condition}
								options={Object.values(CouponIssueCondition)}
							/>
							{#if condition !== '전체'}
								<InputMoney bind:value={priceThreshold} classes="w-24" />
								<span>원</span>
							{/if}
							<Button text="조회" on:click={handleCheckClick} />
						</div>
					</div>
				</div>
			{:else}
				<div class="flex flex-col space-y-2">
					<MdBlack>체육관 검색</MdBlack>
					<SearchUser onSelectCustomer={handleSelectCustomer} />
				</div>
			{/if}
			<div class="flex space-x-4 w-full">
				<div class="flex flex-col space-y-2">
					<MdBlack>발급매수</MdBlack>
					<div class="flex space-x-2 items-center">
						<InputNumber bind:value={issueNumber} classes="w-16" />
						<MdBlack>장</MdBlack>
					</div>
				</div>
				<div class="flex flex-col space-y-2">
					<MdBlack>총 발급매수</MdBlack>
					<div class="flex space-x-2 items-center">
						<InputNumber value={issueNumber * totalCount} classes="w-16" disabled />
						<MdBlack>장</MdBlack>
					</div>
				</div>
				<div class="flex flex-col space-y-2">
					<MdBlack>총 발급액</MdBlack>
					<div class="flex space-x-2 items-center">
						<InputMoney
							value={issueNumber * totalCount * (couponMaster ? couponMaster.price : 0)}
							classes="w-32"
							disabled
						/>
						<MdBlack>원</MdBlack>
					</div>
				</div>
				<div class="flex flex-col space-y-2">
					<MdBlack>사용기한 (발급일로부터)</MdBlack>
					<div class="flex space-x-2 items-center">
						<InputNumber bind:value={expireDay} classes="w-32" />
						<MdBlack>일</MdBlack>
					</div>
				</div>
				<div class="flex flex-col space-y-2 w-full">
					<MdBlack>쿠폰 발급 메세지</MdBlack>
					<div class="flex space-x-2 items-center">
						<InputText bind:value={couponMessage} classes="w-full" />
					</div>
				</div>
			</div>
			<div class="ml-auto">
				<MdBlack>total: {totalCount}</MdBlack>
			</div>
			<Table>
				<Thead>
					<Th classes="w-8">no</Th>
					<Th classes="w-40">체육관명</Th>
					<Th classes="w-24">관장명</Th>
					<Th classes="w-40">전화번호</Th>
					<Th classes="w-80">주소</Th>
					<Th classes="w-32">전월 구매금액</Th>
					<Th classes="w-32">총 누적 구매금액</Th>
					{#if searchType === CouponIssueTargetType.search}
						<Th classes="w-20" />
					{/if}
				</Thead>
				<Tbody>
					{#each selectedCustomers as customer, index (customer.gymId)}
						<Tr>
							<Td>{(current - 1) * 5 + index + 1}</Td>
							<Td>
								{customer.gymName}
							</Td>
							<Td>
								{customer.userName}
							</Td>
							<Td>
								{formatPhone(customer.phone)}
							</Td>
							<Td>
								{customer.address}
								{customer.detailAddress}
								(우:{customer.zipCode})
							</Td>
							<Td>
								{formatMoney({ money: customer.prevMonthPurchasedAmount })}
							</Td>
							<Td>
								{formatMoney({ money: customer.totalPurchasedAmount })}
							</Td>
							{#if searchType === CouponIssueTargetType.search}
								<Td>
									<TextButton red on:click={() => handleDeleteButtonClick(customer.gymId)}
										>삭제</TextButton
									>
								</Td>
							{/if}
						</Tr>
					{/each}
				</Tbody>
			</Table>
			{#if searchType === CouponIssueTargetType.condition}
				<div class="mx-auto pt-4">
					<Pagination rowCount={5} {totalCount} {current} {goToPage} noParam />
				</div>
			{/if}
		</div>
	</ModalDialog>
{/if}
