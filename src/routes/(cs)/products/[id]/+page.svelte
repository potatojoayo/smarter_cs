<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import DataColumn from '$lib/components/DataColumn.svelte';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import ProductState from '$lib/components/ProductState.svelte';
	import { formatDate } from '$lib/utils/formatDate';
	import formatMoney from '$lib/utils/formatMoney';
	import type { PageData } from './$types';

	export let data: PageData;
	const { productMaster } = data;
	async function handleSaveMemo() {
		if (!confirm('메모를 저장하시겠습니까?')) return;

		if (await productMaster.updateMemo()) {
			alert('메모가 저장되었습니다.');
		} else {
			alert('메모 저장에 실패했습니다. 개발팀에 문의해주세요.');
		}
	}
</script>

<div class="p-8 max-w-[1500px] mx-auto">
	<div class="p-8 border bg-white rounded">
		<div class="flex justify-between space-x-16">
			<div class="flex flex-col flex-1">
				<DataColumn title="상품등록일">
					{formatDate(productMaster.dateCreated)}
				</DataColumn>
				<DataColumn title="상품번호">
					{productMaster.productNumber}
				</DataColumn>
				<DataColumn title="상품사진">
					<img src={productMaster.thumbnail} alt={productMaster.name} class="w-40" />
				</DataColumn>
				<DataColumn title="상품명">
					{productMaster.name}
				</DataColumn>
				<DataColumn title="카테고리">
					{productMaster.category}
				</DataColumn>
				<DataColumn title="서브카테고리">
					{productMaster.subCategory}
				</DataColumn>
				<DataColumn title="브랜드">
					{productMaster.brand}
				</DataColumn>
			</div>
			<div class="flex flex-col flex-1">
				<DataColumn title="상품수정일">
					{formatDate(productMaster.dateUpdated)}
				</DataColumn>
				<DataColumn title="소비자가">
					{formatMoney({ money: productMaster.priceConsumer })}
				</DataColumn>
				<DataColumn title="학부모가">
					{formatMoney({ money: productMaster.priceParent })}
				</DataColumn>
				<DataColumn title="체육관가">
					{formatMoney({ money: productMaster.priceGym })}
				</DataColumn>
				<DataColumn title="이리스가">
					{formatMoney({ money: productMaster.priceVendor })}
				</DataColumn>
				<DataColumn title="배송비">
					{formatMoney({ money: productMaster.priceDelivery })}
				</DataColumn>
				<DataColumn title="배송유형">
					{productMaster.deliveryType}
				</DataColumn>
				<DataColumn title="로고시안필수">
					{productMaster.needDraft ? 'O' : 'X'}
				</DataColumn>
				<DataColumn title="메모">
					<div class="w-full flex items-end space-x-4">
						<TextArea bind:value={productMaster.memo} classes="w-full" />
						<TextButton on:click={handleSaveMemo}>저장</TextButton>
					</div>
				</DataColumn>
			</div>
		</div>
		{#if productMaster.products}
			<div class="my-8">
				<LgBlack>상품목록</LgBlack>
			</div>
			<Table>
				<Thead>
					<Th classes="w-60">모델번호</Th>
					<Th>상품명</Th>
					<Th classes="w-28">색상</Th>
					<Th classes="w-28">사이즈</Th>
					<Th classes="w-28">추가금액</Th>
					<Th classes="w-28">재고수량</Th>
					<Th classes="w-24">상태</Th>
					<Th classes="w-28">등록일</Th>
					<Th classes="w-28">수정일</Th>
				</Thead>
				<Tbody>
					{#each productMaster.products as product}
						<Tr>
							<Td>
								{product.modelNumber}
							</Td>
							<Td>
								{productMaster.name}
							</Td>
							<Td>
								{product.color}
							</Td>
							<Td>
								{product.size}
							</Td>
							<Td>
								{formatMoney({ money: product.priceAdditional })}
							</Td>
							<Td>
								{product.inventoryQuantity}
							</Td>
							<Td>
								<ProductState state={product.state} />
							</Td>
							<Td>
								{formatDate(product.dateCreated)}
							</Td>
							<Td>
								{formatDate(product.dateUpdated)}
							</Td>
						</Tr>
					{/each}
				</Tbody>
			</Table>
		{/if}
	</div>
</div>
