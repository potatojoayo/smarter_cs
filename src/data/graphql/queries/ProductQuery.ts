import { gql } from 'graphql-request';

export default class ProductQuery {
	static ProductMasters = gql`
		query ProductMasters(
			$category: String
			$subCategory: String
			$state: String
			$brand: String
			$page: Int
		) {
			brands(category: $subCategory) {
				name
			}
			categories {
				name
				children {
					name
				}
			}
			csProductMasters(
				category: $category
				subCategory: $subCategory
				state: $state
				brand: $brand
				page: $page
			) {
				totalCount
				productMasters {
					id
					name
					priceGym
					priceConsumer
					priceParent
					memo
					priceVendor
					colors
					sizes
					productNumber
					category {
						name
					}
					subCategory {
						name
					}
					brand {
						name
					}
					state
					dateCreated
					needDraft
					dateUpdated
					thumbnail
				}
			}
		}
	`;

	static ProductMaster = gql`
		query ProductMaster($id: Int) {
			productMaster(id: $id) {
				id
				name
				deliveryType
				memo
				category {
					name
				}
				subCategory {
					name
				}
				brand {
					name
				}
				supplier {
					name
				}
				productNumber
				needDraft

				priceGym
				priceParent
				priceVendor
				priceConsumer
				thumbnail

				colors
				sizes
				priceDelivery
				deliveryType

				state
				descriptionImage
				dateCreated
				dateUpdated
				products {
					modelNumber
					name
					color
					size
					priceAdditional
					inventoryQuantity
					state
					dateCreated
					dateUpdated
				}
			}
		}
	`;
}
