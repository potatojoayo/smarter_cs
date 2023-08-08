<script>
	import MdBlue from '$lib/components/base/MdBlue.svelte';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import MdGray from '$lib/components/base/MdGray.svelte';
	import MdLightGray from '$lib/components/base/MdLightGray.svelte';
	import MdRed from '$lib/components/base/MdRed.svelte';
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import LgBlue from '$lib/components/base/LgBlue.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import DateFormat from '$lib/components/date/DateFormat.svelte';
	import DateTimeFormat from '$lib/components/date/DateTimeFormat.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import InputDate from '$lib/components/input/InputDate.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import DropdownSelect from '$lib/components/input/DropdownSelect.svelte';
</script>

<div class="flex">
	<div class="flex flex-col p-4">
		<MdBlack text="md black" />
		<MdBlue text="md blue" />
		<MdGray text="md gray" />
		<MdLightGray text="md light gray" />
		<MdRed text="md red" />
		<LgBlack text="lg black" />
		<LgBlack text="lg black bold" bold />
		<LgBlue text="lg blue" />
		<LgBlue text="lg blue bold" bold />
		<div class="my-2">{''}</div>
		<Button text="파란 버튼" />
		<div class="my-2">{''}</div>
		<Button text="빨간 버튼" red />

		<div class="my-2">{''}</div>
		<TextButton text="텍스트 버튼" />
		<div class="my-2">{''}</div>
		<TextButton text="텍스트 버튼" red />
		<DateFormat date={new Date('1994-02-12')} />
		<DateTimeFormat />
		<div>
			<InputDate />
			<span class="mx-2">~</span>
			<InputDate />
		</div>
		<Table>
			<Thead>
				<Th>문의번호</Th>
				<Th>접수일</Th>
				<Th>체육관명</Th>
				<Th>구분</Th>
				<Th>사유</Th>
				<Th>주문상태</Th>
				<Th>처리상태</Th>
				<Th>처리일</Th>
			</Thead>
			<Tbody>
				<Tr onClick={() => {}}>
					<Td>Q412</Td>
					<Td>
						<DateFormat />
					</Td>
					<Td>스마터 태권도</Td>
					<Td>주문취소</Td>
					<Td>단순변심</Td>
					<Td>결제전</Td>
					<Td>미처리</Td>
					<Td />
				</Tr>
			</Tbody>
		</Table>
		<div class="my-2">{''}</div>
		<Pagination />
		<InputText />
		<DropdownSelect />
	</div>
</div>
