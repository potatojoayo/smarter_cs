<script lang="ts">
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import type Customer from '$data/classes/Customer';
	import DataColumn from '$lib/components/DataColumn.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import MdGray from '$lib/components/base/MdGray.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import InputPhone from '$lib/components/input/InputPhone.svelte';
	import formatMoney from '$lib/utils/formatMoney';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import ChangePasswordModal from '$lib/components/modal/ChangePasswordModal.svelte';
	import AddressSearchModal from '$lib/components/modal/AddressSearchModal.svelte';
	import DropdownSelect from '$lib/components/input/DropdownSelect.svelte';
	import { changeSearchParams } from '$lib/utils/changeSearchParams';
	import EditRefundAccountModal from '$lib/components/modal/EditRefundAccountModal.svelte';
	import { InquiryType } from '$data/enums/InqueryType';
	import { formatBusinessRegistrationNumber } from '$lib/utils/formatBusinessRegistrationNumber';
	import MdBlue from '../base/MdBlue.svelte';

	export let customer: Customer,
		agencies: string[],
		isCompleted: boolean,
		gymName = customer.gymName,
		userName = customer.userName,
		phone = customer.phone,
		memo = customer.memo,
		agencyName = customer.agencyName,
		changePasswordModalOpen = false,
		changeAddressModalOpen = false,
		changeRefundAccountModalOpen = false,
		inquiryType: InquiryType;

	function onClickChangePassword() {
		changePasswordModalOpen = true;
	}

	function onClickChangeAddress() {
		changeAddressModalOpen = true;
	}

	function onClickChangeRefundAccount() {
		changeRefundAccountModalOpen = true;
	}

	async function changeGymName() {
		if (!confirm('체육관명을 변경하시겠습니까?')) return;
		if (await customer.updateUserInfo({ gymName })) {
			alert('체육관명이 변경되었습니다.');
			customer.gymName = gymName;
		} else {
			alert('체육관명 변경이 실패하였습니다.');
		}
	}

	async function changeUserName() {
		if (!confirm('관장명을 변경하시겠습니까?')) return;
		if (await customer.updateUserInfo({ userName })) {
			alert('관장명이 변경되었습니다.');
			customer.userName = userName;
		} else {
			alert('체육관명 변경이 실패하였습니다.');
		}
	}

	async function changePhone() {
		if (!confirm('전화번호를 변경하시겠습니까?')) return;
		if (await customer.updateUserInfo({ phone })) {
			alert('전화번호가 변경되었습니다.');
			customer.phone = phone;
		} else {
			alert('전화번호 변경이 실패하였습니다.');
		}
	}

	async function changeAgency() {
		if (!confirm('관할지사를 변경하시겠습니까?')) return;
		if (await customer.updateUserInfo({ agencyName })) {
			alert('관할지사가 변경되었습니다.');
			customer.agencyName = agencyName;
		} else {
			alert('관할지사 변경이 실패하였습니다.');
		}
	}

	function getDeliveryAddresses() {
		changeSearchParams({
			params: [
				{
					param: 'mode',
					value: 'DeliveryAddress'
				},
				{
					param: 'deliveryAddressPage',
					value: '1'
				}
			],
			noScroll: true
		});
	}

	function getSmarterMoneyTransactions() {
		changeSearchParams({
			params: [
				{
					param: 'mode',
					value: 'SmarterMoney'
				},
				{
					param: 'smarterMoneyPage',
					value: '1'
				}
			],
			noScroll: true
		});
	}

	function getDrafts() {
		changeSearchParams({
			params: [
				{
					param: 'mode',
					value: 'Draft'
				},
				{
					param: 'draftPage',
					value: '1'
				}
			],
			noScroll: true
		});
	}

	async function saveMemo() {
		if (!confirm('메모를 변경하시겠습니까?')) return;
		if (await customer.updateUserInfo({ memo })) {
			alert('메모가 변경되었습니다.');
			customer.memo = memo;
		} else {
			alert('메모 변경이 실패하였습니다.');
		}
	}
</script>

<div
	class="h-[calc(100%-64px)] w-96 2xl:w-[400px] border-r bg-white flex flex-col fixed overflow-y-scroll"
>
	<div class="flex flex-col p-8">
		<LgBlack>고객정보</LgBlack>
		<div class="mt-2">{''}</div>

		<DataColumn title="아이디">
			<MdGray>
				{customer.identification}
			</MdGray>

			<TextButton text="비밀번호 변경" on:click={onClickChangePassword} disabled={isCompleted} />
		</DataColumn>
		<DataColumn title="체육관명">
			<InputText bind:value={gymName} disabled={isCompleted} classes="w-52" />

			{#if gymName !== customer.gymName}
				<TextButton text="저장" on:click={changeGymName} disabled={isCompleted} />
			{/if}
		</DataColumn>
		<DataColumn title="관장명">
			<InputText bind:value={userName} disabled={isCompleted} classes="w-52" />

			{#if userName !== customer.userName}
				<TextButton text="저장" on:click={changeUserName} disabled={isCompleted} />
			{/if}
		</DataColumn>
		<DataColumn title="전화번호">
			<InputPhone bind:phone disabled={isCompleted} classes="w-52" />

			{#if phone !== customer.phone}
				<TextButton text="저장" on:click={changePhone} disabled={isCompleted} />
			{/if}
		</DataColumn>
		<DataColumn title="주소">
			<TextButton disabled={isCompleted} on:click={onClickChangeAddress}>
				<div class="whitespace-normal text-left">
					{customer.address}
					{customer.detailAddress}
					(우: {customer.zipCode}
					)
				</div>
			</TextButton>
		</DataColumn>
		{#if inquiryType !== InquiryType.delivery}
			<DataColumn title="배송지">
				<div>
					{''}
				</div>
				<TextButton text="배송지 목록" on:click={getDeliveryAddresses} />
			</DataColumn>
		{/if}
		<DataColumn title="관할지사">
			<DropdownSelect
				options={agencies}
				noDefault
				bind:selected={agencyName}
				disabled={isCompleted}
			/>

			{#if agencyName !== customer.agencyName}
				<TextButton text="저장" on:click={changeAgency} disabled={isCompleted} />
			{/if}
		</DataColumn>

		{#if inquiryType !== InquiryType.smarterMoney}
			<DataColumn title="스마터머니">
				<MdGray>
					{formatMoney({ money: customer.smarterMoney })}
				</MdGray>
				<TextButton text="관리" on:click={getSmarterMoneyTransactions} />
			</DataColumn>
		{/if}
		<DataColumn title="사업자등록증">
			{formatBusinessRegistrationNumber(customer.businessRegistrationNumber)}
			{#if customer.businessRegistrationCertificate}
				<a href={`${customer.businessRegistrationCertificate}`} target="_blank" download
					><MdBlue text={'다운로드'} /></a
				>
			{/if}
		</DataColumn>

		{#if inquiryType !== InquiryType.draft}
			<DataColumn title="로고시안">
				<div>
					{''}
				</div>
				<TextButton text="로고시안 목록" on:click={getDrafts} />
			</DataColumn>
		{/if}
		<DataColumn title="환불계좌">
			<TextButton disabled={isCompleted} on:click={onClickChangeRefundAccount}>
				{customer.refundAccountBank ?? '-'}
				{customer.refundAccountNo ?? ''}
				{#if customer.refundAccountOwner}
					(예금주:
					{customer.refundAccountOwner}
					)
				{/if}
			</TextButton>
		</DataColumn>
		<DataColumn title="메모">
			<TextArea bind:value={memo} classes="w-full" disabled={isCompleted} />
			<TextButton
				text="저장"
				disabled={memo === customer.memo || isCompleted}
				on:click={saveMemo}
			/>
		</DataColumn>
	</div>
</div>

{#if changePasswordModalOpen}
	<ChangePasswordModal bind:open={changePasswordModalOpen} {customer} />
{/if}
{#if changeAddressModalOpen}
	<AddressSearchModal bind:open={changeAddressModalOpen} bind:customer />
{/if}

{#if changeRefundAccountModalOpen}
	<EditRefundAccountModal bind:open={changeRefundAccountModalOpen} bind:customer />
{/if}

<!-- <div class="flex flex-col p-8 border rounded bg-white">
	<LgBlack>고객정보</LgBlack>
	<div class="flex mt-4 space-x-8">
		<div class="flex flex-col flex-1">
			<DataColumn title="아이디">
				<MdGray>
					{customer.identification}
				</MdGray>

				<TextButton text="비밀번호 변경" on:click={onClickChangePassword} disabled={isCompleted} />
			</DataColumn>
			<DataColumn title="체육관명">
				<InputText bind:value={gymName} disabled={isCompleted} />

				{#if gymName !== customer.gymName}
					<TextButton text="저장" on:click={changeGymName} disabled={isCompleted} />
				{/if}
			</DataColumn>
			<DataColumn title="전화번호">
				<InputPhone bind:phone disabled={isCompleted} />

				{#if phone !== customer.phone}
					<TextButton text="저장" on:click={changePhone} disabled={isCompleted} />
				{/if}
			</DataColumn>
			<DataColumn title="주소">
				<TextButton disabled={isCompleted} on:click={onClickChangeAddress}>
					<div class="whitespace-normal text-left">
						{customer.address}
						{customer.detailAddress}
						(우: {customer.zipCode}
						)
					</div>
				</TextButton>
			</DataColumn>
			{#if inquiryType !== InquiryType.delivery}
				<DataColumn title="배송지">
					<div>
						{''}
					</div>
					<TextButton text="배송지 목록" on:click={getDeliveryAddresses} />
				</DataColumn>
			{/if}
		</div>
		<div class="flex flex-col flex-1">
			<DataColumn title="관할지사">
				<DropdownSelect
					options={agencies}
					noDefault
					bind:selected={agencyName}
					disabled={isCompleted}
				/>

				{#if agencyName !== customer.agencyName}
					<TextButton text="저장" on:click={changeAgency} disabled={isCompleted} />
				{/if}
			</DataColumn>

			{#if inquiryType !== InquiryType.smarterMoney}
				<DataColumn title="스마터머니">
					<MdGray>
						{formatMoney({ money: customer.smarterMoney })}
					</MdGray>
					<TextButton text="관리" on:click={getSmarterMoneyTransactions} />
				</DataColumn>
			{/if}

			{#if inquiryType !== InquiryType.draft}
				<DataColumn title="로고시안">
					<div>
						{''}
					</div>
					<TextButton text="로고시안 목록" on:click={getDrafts} />
				</DataColumn>
			{/if}
			<DataColumn title="환불계좌">
				<TextButton disabled={isCompleted} on:click={onClickChangeRefundAccount}>
					{customer.refundAccountBank ?? '-'}
					{customer.refundAccountNo ?? ''}
					{#if customer.refundAccountOwner}
						(예금주:
						{customer.refundAccountOwner}
						)
					{/if}
				</TextButton>
			</DataColumn>
			<DataColumn title="메모">
				<TextArea bind:value={memo} classes="w-full" disabled={isCompleted} />
				<TextButton
					text="저장"
					disabled={memo === customer.memo || isCompleted}
					on:click={saveMemo}
				/>
			</DataColumn>
		</div>
	</div>
</div> -->
