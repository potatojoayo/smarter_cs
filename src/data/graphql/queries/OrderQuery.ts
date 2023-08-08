import { gql } from 'graphql-request';

export default class OrderQuery {
	static OrderMaster = gql`
		query OrderMaster($id: Int, $orderNumber: String) {
			orderMaster(orderMasterId: $id, orderNumber: $orderNumber) {
				orderState
				id
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
		}
	`;

	static OrderDetailDelivery = gql`
		query OrderDetailDelivery($orderDetailId: Int) {
			orderDetailDelivery(orderDetailId: $orderDetailId) {
				deliveryAgency {
					id
					name
				}
				trackingNumber
				photo
			}
		}
	`;

	static WorkById = gql`
		query WorkById($workId: Int) {
			workById(workId: $workId) {
				memoBySubcontractor
				memoByAdmin
				memoByPreWorker
				details {
					userRequest
					draft {
						id
						image
						memo
						font
						priceWork
						printing
						priceWorkLabor
						threadColor
						subCategory {
							name
						}
					}
					product {
						name
						color
						size
					}
					productMaster {
						thumbnail
					}
					quantity
					state
					orderMaster {
						user {
							phone
							name
							gym {
								name
							}
						}
					}
					studentNames
				}
			}
		}
	`;
}
