<script lang="ts">
	import LgBlack from '$lib/components/base/LgBlack.svelte';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	import type ParentCategory from '$data/classes/Category';
	import type { Category } from '$data/classes/Category';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import { gql } from 'graphql-request';
	import HttpClient from '$data/graphql/client';
	import ProductMaster from '$data/classes/ProductMaster';
	import type Customer from '$data/classes/Customer';
	import Draft from '$data/classes/Draft';
	import Drafts from '$lib/components/inquiry/Drafts.svelte';
	import InputNumber from '$lib/components/input/InputNumber.svelte';
	import InputText from '$lib/components/input/InputText.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import formatMoney from '$lib/utils/formatMoney';
	import OrderedProduct from '$data/classes/OrderedProduct';
	import TextButton from '$lib/components/buttons/TextButton.svelte';
	import OrderService from '$data/services/OrderService';
	import type CsRequest from '$data/classes/CsRequest';

	export let categories: ParentCategory[], customer: Customer, csRequest: CsRequest;

	const client = HttpClient.getInstance();

	let selectedCategory: ParentCategory | undefined,
		selectedSubCategory: Category | undefined,
		brands: string[] | undefined,
		selectedBrand: string | undefined,
		productMasters: ProductMaster[] | undefined,
		selectedProductMaster: ProductMaster | undefined,
		products: OrderedProduct[] | undefined,
		drafts: Draft[] | undefined,
		selectedDraft: Draft | undefined,
		addedProducts: OrderedProduct[] = [];
	function handleBackButtonClick() {
		changeSearchParam({
			param: 'mode',
			value: 'Default'
		});
	}

	function handleCategoryClick(category: ParentCategory) {
		selectedCategory = category;
		selectedSubCategory =
			brands =
			selectedBrand =
			productMasters =
			selectedProductMaster =
			products =
			drafts =
			selectedDraft =
				undefined;
	}

	async function handleSubCategoryClick(subCategory: Category) {
		selectedSubCategory = subCategory;
		brands =
			productMasters =
			selectedProductMaster =
			products =
			selectedBrand =
			drafts =
			selectedDraft =
				undefined;

		const Brands = gql`
			query Brands($category: String) {
				brands(category: $category) {
					name
				}
			}
		`;
		const result = (await client.request(Brands, { category: subCategory.name })) as {
			brands: { name: string }[];
		};
		brands = result.brands.map((b) => b.name);
	}

	async function handleBrandClick(brand: string) {
		selectedBrand = brand;
		productMasters = selectedProductMaster = products = drafts = selectedDraft = undefined;

		const ProductMasters = gql`
			query Products($brand: String, $subCategory: String) {
				productMasterList(brand: $brand, subCategory: $subCategory) {
					id
					name
					needDraft
					priceGym
				}
			}
		`;

		const { productMasterList } = (await client.request(ProductMasters, {
			brand,
			subCategory: selectedSubCategory?.name
		})) as {
			productMasterList: {
				id: number;
				name: string;
				needDraft: boolean;
				priceGym: number;
			}[];
		};
		productMasters = productMasterList.map((p) => new ProductMaster(p));
	}

	async function handleProductMasterClick(productMaster) {
		selectedProductMaster = productMaster;
		products = drafts = selectedDraft = undefined;
		const Products = gql`
			query Products($productMasterId: Int) {
				productList(productMasterId: $productMasterId) {
					id
					color
					size
					priceAdditional
				}
			}
		`;

		const { productList } = (await client.request(Products, {
			productMasterId: selectedProductMaster?.id
		})) as {
			productList: {
				id: number;
				color: string;
				size: string;
				priceAdditional: number;
			}[];
		};

		products = productList.map(
			(p) =>
				new OrderedProduct({
					color: p.color,
					id: p.id,
					priceProduct:
						(selectedProductMaster ? selectedProductMaster.priceGym : 0) + p.priceAdditional,
					productId: p.id,
					productMasterId: selectedProductMaster ? selectedProductMaster.id : -1,
					productName: selectedProductMaster ? selectedProductMaster.name : '',
					size: p.size
				})
		);

		const Drafts = gql`
			query Drafts($userId: Int, $subCategoryName: String) {
				drafts(userId: $userId, subCategoryName: $subCategoryName) {
					id
					categoryName
					subCategoryName
					image
					font
					threadColor
					printing
					priceWork
					priceWorkLabor
					memo
				}
			}
		`;
		const result = (await client.request(Drafts, {
			userId: customer.userId,
			subCategoryName: selectedSubCategory?.name
		})) as {
			drafts: {
				id: number;
				image: URL;
				font?: string;
				threadColor?: string;
				printing?: string;
				priceWork: number;
				categoryName: string;
				subCategoryName: string;
				priceWorkLabor: number;
				memo?: string;
			}[];
		};

		drafts = result.drafts.map((d) => new Draft(d));
	}

	function handleAddButtonClick() {
		if (products) {
			products.forEach((p: OrderedProduct) => {
				if (p.quantity > 0) {
					p.priceWork = selectedDraft ? selectedDraft.priceWork : 0;
					p.priceTotal = (p.priceProduct + p.priceWork) * p.quantity;
					const newOrder = new OrderedProduct({
						color: p.color,
						priceProduct: p.priceProduct,
						productId: p.productId,
						productMasterId: p.productMasterId,
						productName: p.productName,
						size: p.size,
						id: p.id
					});
					newOrder.quantity = p.quantity;
					newOrder.draftId = selectedDraft?.id;
					newOrder.priceWork = p.priceWork;
					newOrder.priceTotal = p.priceTotal;
					newOrder.studentNames = p.studentNames;
					addedProducts.push(newOrder);
				}
				p.quantity = 0;
			});
			document.querySelectorAll('input.name').forEach((input: HTMLInputElement) => {
				input.value = '';
			});
			document.querySelectorAll('input.quantity').forEach((input: HTMLInputElement) => {
				input.value = '0';
			});
			addedProducts = addedProducts;
		}
	}

	function handleDeleteOrderedProduct(index: number) {
		addedProducts.splice(index, 1);
		addedProducts = addedProducts;
	}

	async function handleOrderButtonClick() {
		console.log(addedProducts);
		if (!confirm('주문을 진행하시겠습니까?')) return;
		const { success, message } = await OrderService.additionalOrder({
			csRequestId: csRequest.id,
			orderedProducts: addedProducts.map((a) => {
				return {
					productMasterId: a.productMasterId,
					productId: a.productId,
					quantity: a.quantity,
					draftId: a.draftId,
					studentNames: a.studentNames
				};
			})
		});
		alert(message);
		if (success) {
			changeSearchParam({
				param: 'mode',
				value: 'Default'
			});
		}
	}
</script>

<div class="flex flex-col p-8 border rounded bg-white">
	<button on:click={handleBackButtonClick} class="flex space-x-2 items-center w-fit">
		<i class="fa-regular fa-arrow-left text-gray-700 text-2xl" />
		<LgBlack>추가주문</LgBlack>
	</button>
	<div class="mt-8 flex space-x-4">
		<div class="flex border rounded max-h-80">
			<div class="flex flex-col overflow-y-scroll w-52 border-r">
				{#each categories as category}
					<button
						on:click={() => handleCategoryClick(category)}
						class="px-8 py-2 cursor-pointer text-start {selectedCategory === category
							? 'bg-blue-500 text-white'
							: ' hover:bg-gray-100'}"
					>
						{category.name}
					</button>
				{/each}
			</div>
			<div class="flex flex-col overflow-y-scroll w-52 border-r">
				{#if selectedCategory}
					{#each selectedCategory.children as subCategory}
						<button
							on:click={() => handleSubCategoryClick(subCategory)}
							class="px-8 py-2 cursor-pointer text-start {selectedSubCategory === subCategory
								? 'bg-blue-500 text-white'
								: ' hover:bg-gray-100'}"
						>
							{subCategory.name}
						</button>
					{/each}
				{:else}
					<div class="p-4">
						<MdBlack>카테고리를 선택해주세요.</MdBlack>
					</div>
				{/if}
			</div>

			<div class="flex flex-col overflow-y-scroll w-52 border-r">
				{#if brands}
					{#each brands as brand}
						<button
							on:click={() => handleBrandClick(brand)}
							class="px-8 py-2 cursor-pointer text-start {selectedBrand === brand
								? 'bg-blue-500 text-white'
								: ' hover:bg-gray-100'}"
						>
							{brand}
						</button>
					{/each}
				{:else}
					<div class="p-4">
						<MdBlack>서브카테고리를 선택해주세요.</MdBlack>
					</div>
				{/if}
			</div>

			<div class="flex flex-col overflow-y-scroll w-52">
				{#if productMasters}
					{#each productMasters as productMaster}
						<button
							on:click={() => handleProductMasterClick(productMaster)}
							class="px-8 py-2 cursor-pointer text-start {selectedProductMaster === productMaster
								? 'bg-blue-500 text-white'
								: ' hover:bg-gray-100'}"
						>
							{productMaster.name}
						</button>
					{/each}
				{:else}
					<div class="p-4">
						<MdBlack>브랜드를 선택해주세요.</MdBlack>
					</div>
				{/if}
			</div>
		</div>

		<div class="flex-1 max-h-80 overflow-y-scroll">
			<Drafts
				{drafts}
				select
				bind:selectedDraft
				{customer}
				onDraftAdded={(draft) => {
					if (
						draft.categoryName === selectedCategory?.name &&
						draft.subCategoryName === selectedSubCategory?.name
					)
						drafts?.push(draft);
					drafts = drafts;
				}}
			/>
			{#if selectedProductMaster && selectedProductMaster.needDraft && !drafts}
				<MdBlack>로고시안이 필요한 상품이지만, 등록된 로고시안이 없어 주문할 수 없습니다.</MdBlack>
			{/if}
		</div>
	</div>

	{#if selectedProductMaster}
		<div class="mt-4 flex w-full space-x-8">
			{#if products}
				<div class="flex-1">
					<Table classes="w-full">
						<Thead>
							<Th classes="w-80">상품명</Th>
							<Th classes="w-20">색상</Th>
							<Th classes="w-20">사이즈</Th>
							<Th classes="w-28">가격</Th>
							<Th classes="w-28">작업비</Th>
							<Th classes="w-20">수량</Th>
							<Th>이름</Th>
						</Thead>
						<Tbody>
							{#each products as product}
								<Tr>
									<Td>
										{selectedProductMaster.name}
									</Td>
									<Td>
										{product.color}
									</Td>
									<Td>
										{product.size}
									</Td>
									<Td>
										{formatMoney({
											money: product.priceProduct
										})}
									</Td>
									<Td>
										{formatMoney({ money: selectedDraft ? selectedDraft.priceWork : 0 })}
									</Td>
									<Td>
										<InputNumber
											classes="w-10 text-center quantity"
											bind:value={product.quantity}
										/>
									</Td>
									<Td>
										<InputText
											classes="w-full name"
											onInput={(e) => {
												const value = e.target.value;
												let names = value.split(',');
												names = names.filter((n) => n.trim());
												product.studentNames = names;
												product.quantity = names.length;
											}}
										/>
									</Td>
								</Tr>
							{/each}
						</Tbody>
					</Table>
				</div>
			{/if}
		</div>
		<div class="mt-4 ml-auto">
			<Button text="상품추가" on:click={handleAddButtonClick} />
		</div>
	{/if}
	<div class="mt-4 p-8 border rounded">
		<LgBlack>추가주문 상품 목록</LgBlack>
		<div class="mt-4">
			<Table classes="w-full">
				<Thead>
					<Th>상품명</Th>
					<Th classes="w-28">색상</Th>
					<Th classes="w-28">사이즈</Th>
					<Th classes="w-32">가격</Th>
					<Th classes="w-32">작업비</Th>
					<Th classes="w-20">수량</Th>
					<Th>이름</Th>
					<Th classes="w-32">금액합계</Th>
					<Th classes="w-10" />
				</Thead>
				<Tbody>
					{#each addedProducts as product, index}
						<Tr>
							<Td>
								{product.productName}
							</Td>
							<Td>
								{product.color}
							</Td>
							<Td>
								{product.size}
							</Td>
							<Td>
								{formatMoney({
									money: product.priceProduct
								})}
							</Td>
							<Td>
								{formatMoney({
									money: product.priceWork
								})}
							</Td>
							<Td>
								{product.quantity}
							</Td>
							<Td>
								{product.studentNames ? product.studentNames.join(', ') : '-'}
							</Td>
							<Td>
								{formatMoney({
									money: product.priceTotal
								})}
							</Td>
							<Td>
								<TextButton red text="삭제" on:click={() => handleDeleteOrderedProduct(index)} />
							</Td>
						</Tr>
					{/each}
				</Tbody>
			</Table>
		</div>
	</div>
	<Button text="주문하기" classes="mt-4 ml-auto" on:click={handleOrderButtonClick} />
</div>
