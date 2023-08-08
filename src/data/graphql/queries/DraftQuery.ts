import { gql } from 'graphql-request';

export default class DraftQuery {
	static Draft = gql`
		query Draft($id: Int!) {
			draft(id: $id) {
				id
				categoryName
				subCategoryName
				priceWork
				priceWorkLabor
				printing
				font
				threadColor
				memo
				image
				sizes {
					id
					name
					backWidth
					backHeight
					leftChestWidth
					leftChestHeight
					rightChestWidth
					rightChestHeight
					leftShoulderWidth
					leftShoulderHeight
					rightShoulderWidth
					rightShoulderHeight
					heapWidth
					heapHeight
					leftPantMiddleWidth
					leftPantMiddleHeight
					rightPantMiddleWidth
					rightPantMiddleHeight
					leftPantLowWidth
					leftPantLowHeight
					rightPantLowWidth
					rightPantLowHeight
					flagWidth
					flagHeight
				}
			}
		}
	`;
}
