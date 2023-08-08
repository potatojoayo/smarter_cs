import { gql } from 'graphql-request';

export default class CustomerQuery {
	static Customer = gql`
		query Customer(
			$id: Int!
			$csRequestPage: Int = 1
			$orderMasterPage: Int = 1
			$getOrderMasters: Boolean = false
			$getSmarterMoneyTransactions: Boolean = false
			$smarterMoneyPage: Int = 1
			$getAddresses: Boolean = false
			$addressPage: Int = 1
			$getDrafts: Boolean = false
			$draftPage: Int = 1
			$getOrderMaster: Boolean = false
			$orderMasterId: Int
		) {
			customer(id: $id) {
				id
				smarterMoney
				user {
					userId
					identification
					refundAccountNo
					refundAccountBank
					refundAccountOwner
					phone
					name
					wallet {
						balance
					}
				}
				name
				address
				zipCode
				detailAddress
				agency {
					name
				}
				businessRegistrationNumber
				businessRegistrationCertificate
				memo
				csRequests(page: $csRequestPage) {
					csRequests {
						id
						requestNumber
						dateRequested
						category
						reason
						csState
						orderState
						requestContents {
							contents
						}
						dateCompleted
					}
					totalCount
				}

				orderMasters(page: $orderMasterPage, excludeStates: ["구매요청"])
					@include(if: $getOrderMasters) {
					orderMasters {
						id
						orderNumber
						dateCreated
						priceTotal
						priceDelivery
						priceToPay
						orderState
						smarterMoney
						memo
						isPickUp
						coupon {
							couponNumber
							couponName
							price
						}
					}
					totalCount
				}

				smarterMoneyHistories(page: $smarterMoneyPage) @include(if: $getSmarterMoneyTransactions) {
					smarterMoneyHistories {
						dateCreated
						transactionType
						description
						amount
						orderNumber
					}
				}
				addresses(page: $addressPage) @include(if: $getAddresses) {
					addresses {
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
			}

			orderMaster(orderMasterId: $orderMasterId) @include(if: $getOrderMaster) {
				id
				orderState
				orderNumber
				dateCreated
				gymName
				agencyName
				isChild
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
					productMaster {
						priceGym
					}
					studentNames
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
				coupon {
					couponNumber
					couponName
					price
					couponMaster {
						type
						name
					}
				}
			}
		}
	`;
	static Customers = gql`
		query Customers($keyword: String) {
			customers(keyword: $keyword) {
				id
				address
				detailAddress
				totalPurchasedAmount
				prevMonthPurchasedAmount
				zipCode
				user {
					phone
					name
				}
				name
			}
		}
	`;

	static CustomersWithTotalCount = gql`
		query CustomersWithTotalCount(
			$totalPurchasedAmount: Int
			$prevMonthPurchasedAmount: Int
			$addressZipCodeId: Int
			$page: Int
		) {
			customersWithTotalCount(
				page: $page
				totalPurchasedAmount: $totalPurchasedAmount
				prevMonthPurchasedAmount: $prevMonthPurchasedAmount
				addressZipCodeId: $addressZipCodeId
			) {
				customers {
					id
					address
					detailAddress
					totalPurchasedAmount
					prevMonthPurchasedAmount
					zipCode
					user {
						phone
						name
					}
					name
				}
				totalCount
			}
		}
	`;
}
