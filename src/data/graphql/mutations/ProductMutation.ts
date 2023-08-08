import { gql } from 'graphql-request';

export default class ProductMutation {
	static UpdateMemo = gql`
		mutation UpdateMemo($productMasterId: Int, $memo: String) {
			updateProductMasterMemo(productMasterId: $productMasterId, memo: $memo) {
				success
			}
		}
	`;
}
