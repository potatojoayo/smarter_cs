import ParentCategory from '$data/classes/Category';
import ProductMaster, { type ProductMasterConstructor } from '$data/classes/ProductMaster';
import HttpClient from '$data/graphql/client';
import ProductMutation from '$data/graphql/mutations/ProductMutation';
import ProductQuery from '$data/graphql/queries/ProductQuery';
import { gql } from 'graphql-request';

export default class ProductService {
	static async productMasters(variables: {
		page: string;
		category: string;
		subCategory: string;
		state: string;
		brand: string;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(ProductQuery.ProductMasters, variables)) as {
			categories: {
				name: string;
				children: {
					name: string;
				}[];
			}[];
			brands: {
				name: string;
			}[];
			csProductMasters: {
				totalCount: number;
				productMasters: {
					id: number;
					name: string;
					priceGym: number;
					needDraft: boolean;
					colors: string[];
					sizes: string[];
					productNumber: string;
					category: {
						name: string;
					};
					subCategory: {
						name: string;
					};
					brand: {
						name: string;
					};
					state: string;
					dateCreated: Date;
					dateUpdated: Date;
					thumbnail: string;
				}[];
			};
		};
		const { productMasters, totalCount } = result.csProductMasters;

		return {
			productMasters: productMasters.map((p) => new ProductMaster(p)),
			totalCount,
			categories: result.categories.map((c) => new ParentCategory(c)),
			brands: result.brands.map((b) => b.name)
		};
	}

	static async getCategories() {
		const Categories = gql`
			query Categories {
				categories(depth: 0) {
					name
					children {
						name
					}
				}
			}
		`;

		const client = HttpClient.getInstance();

		const result = (await client.request(Categories)) as {
			categories: {
				name: string;
				children: {
					name: string;
				}[];
			}[];
		};

		return result.categories.map((c) => new ParentCategory(c));
	}

	static async productmaster(variables: { id: number }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(ProductQuery.ProductMaster, variables)) as {
			productMaster: ProductMasterConstructor;
		};
		return new ProductMaster(result.productMaster);
	}

	static async updateMemo(variables: { productMasterId: number; memo: string }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(ProductMutation.UpdateMemo, variables)) as {
			updateProductMasterMemo: {
				success: boolean;
			};
		};
		return result.updateProductMasterMemo.success;
	}
}
