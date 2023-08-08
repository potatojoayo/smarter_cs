<script lang="ts">
	import Draft from '$data/classes/Draft';
	import ModalDialog from '$lib/components/modal/ModalDialog.svelte';
	import DataColumn from '$lib/components/DataColumn.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import Thead from '$lib/components/table/Thead.svelte';
	import Th from '$lib/components/table/Th.svelte';
	import Tbody from '$lib/components/table/Tbody.svelte';
	import Tr from '$lib/components/table/Tr.svelte';
	import Td from '$lib/components/table/Td.svelte';
	import MdBlack from '$lib/components/base/MdBlack.svelte';
	import TextArea from '$lib/components/input/TextArea.svelte';
	import ModalButton from '$data/classes/ModalButton';
	import { ButtonColor } from '$data/enums/ButtonColor';
	import InputMoney from '$lib/components/input/InputMoney.svelte';
	import DropdownSelect from '$lib/components/input/DropdownSelect.svelte';
	import { DRAFT_FONTS } from '$data/consts/DRAFT_FONTS';
	import { THREAD_COLORS } from '$data/consts/THREAD_COLORS';
	import { PRINTING_METHODS } from '$data/consts/PRINTING_METHODS';
	import InputNumber from '$lib/components/input/InputNumber.svelte';
	import { changeSearchParam } from '$lib/utils/changeSearchParam';
	import InputImage from '../input/InputImage.svelte';
	import type ParentCategory from '$data/classes/Category';
	import ProductService from '$data/services/ProductService';
	import { onMount } from 'svelte';
	import DraftSizesInfo from '$lib/components/modal/DraftSizesInfo.svelte';

	export let draftId: number,
		open = false,
		editable = false,
		add = false,
		userId: number | undefined = undefined,
		subCategory: string | undefined = undefined,
		category: string | undefined = undefined,
		onSuccess: (() => void) | undefined = undefined,
		draftPage: number = 1,
		onDraftAdded: ((draft: Draft) => void) | undefined = undefined;

	let draft = Draft.new(),
		file: File,
		categories: ParentCategory[] = [],
		selectedCategory: ParentCategory | undefined;

	let sizeNumber = 1;

	onMount(() => {
		if (open && draftId && !add) {
			Draft.fromId(draftId).then((d) => {
				draft = d;
			});
		}
	});
	$: {
		if (add) {
			ProductService.getCategories().then((c) => {
				categories = c;
				if (category && subCategory) {
					selectedCategory = categories.find((c) => c.name === category);
					draft.categoryName = selectedCategory?.name;
					draft.subCategoryName = subCategory;
				}
			});
		}
	}

	function handleCategoryClick(categoryName: string) {
		selectedCategory = categories.find((c) => c.name === categoryName);
		draft.categoryName = categoryName;
	}
	function handleSubCategoryClick(subCategoryName: string) {
		draft.subCategoryName = subCategoryName;
	}
	async function handleUpdate() {
		if (add && (!file || !draft.categoryName || !draft.subCategoryName)) {
			return alert('이미지와 카테고리 및 서브카테고리를 모두 선택해주세요.');
		}
		if (!confirm('저장하시겠습니까?')) return;
		const result = await draft.save({ file, userId });
		console.log(result.success);
		if (result.success) {
			alert('저장되었습니다.');
			if (onSuccess) {
				onSuccess();
			}
			if (add && onDraftAdded) {
				onDraftAdded(result.draft);
			} else {
				await changeSearchParam({
					param: 'draftPage',
					value: draftPage.toString(),
					invalidateAll: true,
					noScroll: true
				});
			}
			add = false;
			open = false;
		} else {
			alert('저장에 실패하였습니다.');
		}
	}
</script>

{#if open && draft}
	<ModalDialog
		title="로고시안 상세"
		bind:open
		buttons={editable
			? [
					new ModalButton({
						title: '취소',
						color: ButtonColor.red,
						onClick: () => {
							open = false;
						}
					}),
					new ModalButton({
						title: '저장',
						color: ButtonColor.blue,
						onClick: handleUpdate
					})
			  ]
			: [
					new ModalButton({
						title: '닫기',
						color: ButtonColor.blue,
						onClick: () => {
							open = false;
						}
					})
			  ]}
	>
		<div class="flex space-x-8">
			<div class="flex flex-col flex-1">
				<div class="w-[320px] h-[200px] mb-4 flex flex-col">
					{#if draft.image}
						<a
							href={draft.image}
							target="_blank"
							download
							class="border rounded p-4 flex items-center justify-center w-[320px] h-[200px]"
						>
							<img src={draft.image} alt="draft" class="h-full w-auto" />
						</a>
					{/if}

					{#if editable}
						{#if draft.image}
							<InputImage
								label="이미지 변경"
								classes="ml-auto my-2"
								bind:file
								bind:image={draft.image}
							/>
						{:else}
							<InputImage
								label="이미지 추가"
								box
								classes="ml-auto mt-2 mt-auto"
								bind:file
								bind:image={draft.image}
							/>
						{/if}
					{/if}
				</div>

				<DataColumn title="카테고리">
					{#if add}
						<DropdownSelect
							options={categories.map((c) => c.name)}
							selected={draft.categoryName}
							onSelect={handleCategoryClick}
						/>
					{:else}
						{draft.categoryName}
					{/if}
				</DataColumn>
				<DataColumn title="서브카테고리">
					{#if add}
						<DropdownSelect
							options={selectedCategory?.children.map((c) => c.name) ?? []}
							selected={draft.subCategoryName}
							onSelect={handleSubCategoryClick}
						/>
					{:else}
						{draft.subCategoryName}
					{/if}
				</DataColumn>
				<DataColumn title="작업비">
					<div class="flex items-center space-x-2">
						<InputMoney bind:value={draft.priceWork} disabled={!editable} />
						<MdBlack>원</MdBlack>
					</div>
				</DataColumn>
				<DataColumn title="용역비">
					<div class="flex items-center space-x-2">
						<InputMoney bind:value={draft.priceWorkLabor} disabled={!editable} />
						<MdBlack>원</MdBlack>
					</div>
				</DataColumn>
				<DataColumn title="폰트">
					<DropdownSelect options={DRAFT_FONTS} bind:selected={draft.font} disabled={!editable} />
				</DataColumn>
				<DataColumn title="실색깔">
					<DropdownSelect
						options={THREAD_COLORS}
						bind:selected={draft.threadColor}
						disabled={!editable}
					/>
				</DataColumn>
				<DataColumn title="프린팅방법">
					<DropdownSelect
						options={PRINTING_METHODS}
						bind:selected={draft.printing}
						disabled={!editable}
					/>
				</DataColumn>
			</div>
			<DraftSizesInfo {draft} {editable} />
		</div>
	</ModalDialog>
{/if}
