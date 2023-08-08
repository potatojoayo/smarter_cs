import { gql } from 'graphql-request';

export default class TaOrderMutation {
	static CreateTaOrder = gql`
		mutation CreateTaOrder(
			$gymId: Int
			$orderedProducts: [OrderedProductInputType]
			$address: String
			$detailAddress: String
			$zipCode: String
		) {
			createTaOrder(
				gymId: $gymId
				orderedProducts: $orderedProducts
				address: $address
				detailAddress: $detailAddress
				zipCode: $zipCode
			) {
				message
				success
			}
		}
	`;

	static UpdateTaOrder = gql`
		mutation UpdateTaOrder(
			$id: Int
			$details: [TaOrderDetailInputType]
			$pricePaid: Int
			$priceDelivery: Int
		) {
			updateTaOrder(
				taOrderMasterId: $id
				taOrderDetails: $details
				pricePaid: $pricePaid
				priceDelivery: $priceDelivery
			) {
				success
				message
			}
		}
	`;
}
