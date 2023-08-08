import { gql } from 'graphql-request';

export default class ChangeRequestQuery {
	static changeRequests = gql`
		query ChangeRequests(
			$page: Int
			$keyword: String
			$state: String
			$start: String
			$end: String
		) {
			changeRequests(page: $page, keyword: $keyword, state: $state, start: $start, end: $end) {
				totalCount
				changeRequests {
					csRequest {
						id
					}
					id
					csRequestNumber
					orderNumber
					gymName
					changeReason
					changeProductsName
					totalChangingPrice
					state
					dateCreated
				}
			}
		}
	`;

	static ChangeRequestQuery = gql`
		query ChangeRequest($id: Int!) {
			changeRequest(id: $id) {
				id
				changeReason
				delivery {
					id
					trackingNumber
					deliveryAgency {
						name
						id
					}
				}
				pickUpReceiver
				pickUpZipCode
				pickUpDetailAddress
				pickUpAddress
				pickUpPhone
				currentSmarterMoney
				afterSmarterMoney
				priceToPay
				deliveryPrice
				csRequest {
					id
				}
				deliveryAddress
				deliveryDetailAddress
				deliveryPhone
				deliveryPrice
				deliveryReceiver
				deliveryZipCode
				memo
				gymName
				state
				totalChangingPrice
				isChangedPriceExempt
				isDeliveryPriceExempt
				priceToPay
				customer {
					user {
						userId
					}
					smarterMoney
				}
				changeDetails {
					id
					priceWork
					changingQuantity
					changedProduct {
						id
						color
						size
						priceAdditional
					}
					priceChangedProduct
					changingProduct {
						id
						color
						size
						priceAdditional
					}
					productName
					changingPrice
					totalChangingPrice
					options {
						id
						color
						size
						priceAdditional
					}
				}
			}
			deliveryAgencies {
				name
				id
			}
		}
	`;
}
