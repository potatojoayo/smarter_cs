import { gql } from 'graphql-request';

export default class CsRequestQuery {
	static CsRequests = gql`
		query CsRequests(
			$page: Int
			$category: String
			$keyword: String
			$csState: String
			$start: String
			$end: String
		) {
			csRequests(
				page: $page
				category: $category
				keyword: $keyword
				csState: $csState
				start: $start
				end: $end
			) {
				csRequests {
					id
					requestNumber
					dateRequested
					gymName
					category
					csState
					reason
					orderState
					requestMemos {
						id
						contents
						dateCreated
					}
					dateCompleted
				}
				totalCount
			}
		}
	`;

	static CsRequestDetail = gql`
		query CsRequestDetail(
			$id: Int!
			$deliveryAddressPage: Int = 1
			$getDeliveryAddresses: Boolean = false
			$smarterMoneyPage: Int = 1
			$getSmarterMoneyTransactions: Boolean = false
			$draftPage: Int = 1
			$getDrafts: Boolean = false
			$getOrderMaster: Boolean = false
			$getCategories: Boolean = false
		) {
			csRequest(id: $id) {
				id
				requestNumber
				dateRequested
				orderMasterId
				gymName
				orderNumber
				category
				csState
				reason
				orderState
				requestMemos {
					id
					contents
					dateCreated
				}
				dateCompleted
				requestContents {
					id
					contents
					dateCreated
					replies {
						id
						contents
						dateCreated
					}
				}

				orderMaster @include(if: $getOrderMaster) {
					id
					isChild
					additionalOrders {
						priceTotal
						priceToPay
						paymentRequest {
							method
							amount
							requestedAt
						}
						paymentRequest {
							method
						}
						id
						orderNumber
						dateCreated
						details {
							id
							studentNames
							productMaster {
								priceGym
							}
							product {
								name
								color
								size
								priceAdditional
							}
							quantity
							draft {
								id
								priceWork
								priceWorkLabor
							}
							priceTotal
							state
							work {
								workId
							}
						}
					}
					orderState
					orderNumber
					dateCreated
					gymName
					agencyName
					orderer
					phone
					priceTotal
					priceDelivery
					smarterMoney
					priceToPay
					paymentRequest {
						method
					}
					paymentSuccess {
						method
						amount
						requestedAt
					}
					receiver
					address
					detailAddress
					zipCode
					deliveryRequest
					isPickUp
					memo
					details {
						id
						studentNames
						productMaster {
							priceGym
						}
						product {
							name
							color
							size
							priceAdditional
						}
						quantity
						draft {
							id
							priceWork
							priceWorkLabor
						}
						priceTotal
						state
						work {
							workId
						}
					}
				}
				gym {
					id
					user {
						userId
						identification
						name
						phone
						refundAccountBank
						refundAccountNo
						refundAccountOwner
					}
					name
					agency {
						name
					}
					address
					detailAddress
					zipCode
					memo
					smarterMoney
					businessRegistrationNumber
					businessRegistrationCertificate

					addresses(page: $deliveryAddressPage) @include(if: $getDeliveryAddresses) {
						addresses {
							id
							name
							address
							detailAddress
							isDefault
							zipCode
							receiver
							phone
							deliveryMemo
						}
						totalCount
					}

					drafts(page: $draftPage) @include(if: $getDrafts) {
						drafts {
							id
							categoryName
							subCategoryName
							priceWork
							priceWorkLabor
							printing
							font
							threadColor
							memo
							dateCreated
							image
						}
						totalCount
					}

					smarterMoneyHistories(page: $smarterMoneyPage)
						@include(if: $getSmarterMoneyTransactions) {
						smarterMoneyHistories {
							id
							dateCreated
							transactionType
							description
							amount
							orderNumber
						}
						totalCount
					}
				}
			}
			agencies {
				edges {
					node {
						name
					}
				}
			}

			categories(depth: 0) @include(if: $getCategories) {
				name
				children {
					name
				}
			}
		}
	`;
}
