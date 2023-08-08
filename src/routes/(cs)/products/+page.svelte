<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import DropdownSelect from '$lib/components/input/DropdownSelect.svelte';
	import ProductMasterMemoModal from '$lib/components/modal/ProductMasterMemoModal.svelte';
	import Pagination from '$lib/components/pagination/Pagination.svelte';
	import ProductState from '$lib/components/ProductState.svelte';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	import formatMoney from '$lib/utils/formatMoney';
	import { goto } from '$app/navigation';
	import type ProductMaster from '$data/classes/ProductMaster';
	import type { PageData } from './$types';

	export let data: PageData,
		memoDialogOpen = false,
		selectedProductMaster: ProductMaster;

	let { productMasters, totalCount, categories, category, subCategory, brand, brands } = data;
	$: ({ productMasters, totalCount, categories, category, subCategory, brand, brands } = data);

	function handleProductClick(productMaster: ProductMaster) {
		goto(`products/${productMaster.id}`);
	}
	function handleMemoClick(productMaster: ProductMaster) {
		if (!productMaster.memo) return;
		selectedProductMaster = productMaster;
		memoDialogOpen = true;
	}
</script>

<div class="p-8 max-w-[1500px] mx-auto">
	<div class="p-8 rounded-lg border bg-white">
		<div class="flex space-x-4">
			<div class="flex flex-col space-y-2">
				<MdBlack>카테고리</MdBlack>
				<DropdownSelect
					options={['전체'].concat(categories.map((c) => c.name))}
					noDefault
					classes="min-w-[120px] text-left"
					selected={category}
					onSelect={(value) => {
						changeSearchParam({
							param: 'category',
							value,
							deleteParams: ['subCategory', 'brand', 'page'],
							invalidateAll: true
						});
					}}
				/>
			</div>

			<div class="flex flex-col space-y-2">
				<MdBlack>서브카테고리</MdBlack>
				<DropdownSelect
					classes="min-w-[120px] text-left"
					options={['전체'].concat(
						categories.find((c) => c.name === category)
							? categories.find((c) => c.name === category).children.map((c) => c.name)
							: []
					)}
					noDefault
					selected={subCategory}
					onSelect={(value) => {
						changeSearchParam({
							param: 'subCategory',
							value,
							deleteParams: ['brand', 'page'],
							invalidateAll: true
						});
					}}
				/>
			</div>
			<div class="flex flex-col space-y-2">
				<MdBlack>브랜드</MdBlack>
				<DropdownSelect
					classes="min-w-[120px] text-left"
					options={['전체'].concat(brands)}
					noDefault
					selected={brand}
					onSelect={(value) => {
						changeSearchParam({
							param: 'brand',
							value,
							invalidateAll: true,
							deleteParams: ['page']
						});
					}}
				/>
			</div>
		</div>
		<Table classes="w-full mt-8">
			<Thead>
				<Th classes="w-24">상품사진</Th>
				<Th classes="w-32">카테고리</Th>
				<Th classes="w-28">서브카테고리</Th>
				<Th classes="w-28">브랜드</Th>
				<Th classes="w-32">상품명</Th>
				<Th classes="w-28">가격</Th>
				<Th classes="w-20">상태</Th>
				<Th classes="w-28">색상</Th>
				<Th classes="w-32">사이즈</Th>
				<Th classes="w-20" />
			</Thead>
			<Tbody>
				{#each productMasters as productMaster (productMaster.id)}
					<Tr onClick={() => handleProductClick(productMaster)}>
						<Td>
							<img src={productMaster.thumbnail} alt={productMaster.name} class="h-20 w-20" />
						</Td>
						<Td>
							{productMaster.category}
						</Td>
						<Td>
							{productMaster.subCategory}
						</Td>
						<Td>
							{productMaster.brand}
						</Td>
						<Td>
							{productMaster.name}
						</Td>
						<Td>
							{formatMoney({ money: productMaster.priceGym })}
						</Td>
						<Td>
							<ProductState state={productMaster.state} />
						</Td>
						<Td>
							{productMaster.colors?.join(', ')}
						</Td>
						<Td>
							{productMaster.sizes?.join(', ')}
						</Td>
						<Td>
							{#if productMaster.memo}
								<TextButton on:click={() => handleMemoClick(productMaster)}>메모</TextButton>
							{/if}
						</Td>
					</Tr>
				{/each}
			</Tbody>
		</Table>
		<div class="mt-8 flex justify-center">
			<Pagination {totalCount} />
		</div>
	</div>
</div>

{#if memoDialogOpen}
	<ProductMasterMemoModal bind:open={memoDialogOpen} productMaster={selectedProductMaster} />
{/if}
