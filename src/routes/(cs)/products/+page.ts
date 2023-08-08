import ProductService from '$data/services/ProductService';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const page = url.searchParams.get('page') ?? '1';
	const category = url.searchParams.get('category') ?? '전체';
	const subCategory = url.searchParams.get('subCategory') ?? '전체';
	const brand = url.searchParams.get('brand') ?? '전체';
	const state = url.searchParams.get('state') ?? '전체';

	const { productMasters, totalCount, categories, brands } = await ProductService.productMasters({
		page,
		category,
		subCategory,
		brand,
		state
	});

	return {
		productMasters,
		totalCount,
		categories,
		category,
		subCategory,
		brand,
		state,
		brands
	};
};
