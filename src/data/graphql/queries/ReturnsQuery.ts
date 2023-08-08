import { gql } from 'graphql-request';

export default class ReturnsQuery {
	static returnsRequests = gql`
		query ReturnRequests(
			$page: Int
			$keyword: String
			$state: String
			$start: String
			$end: String
		) {
			returnRequests(page: $page, keyword: $keyword, state: $state, start: $start, end: $end) {
				totalCount
				returnRequests {
					id
					csRequestNumber
					csRequest {
						id
					}
					orderNumber
					gymName
					returnReason
					returnProductsName
					totalReturnPrice
					totalProductsPrice
					state
					dateCreated
				}
			}
		}
	`;
	static returnRequest = gql`
		query ReturnRequest($returnId: Int) {
			returnRequest(returnId: $returnId) {
				returnDetails {
					id
					productMasterName
					priceWork
					color
					size
					returnQuantity
					returnPrice
					orderDetail {
						priceGym
					}
				}
				returnReason
				receiver
				phone
				address
				detailAddress
				zipCode
				totalProductsPrice
				state
				returnProductsName
				userId
				currentUserSmarterMoney
				isDeliveryPriceExempt
			}
		}
	`;
}
