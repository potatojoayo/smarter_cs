import { gql } from 'graphql-request';

export default class UpdateReturnMutation {
	static UpdateReturn = gql`
		mutation updateReturn(
			$address: String
			$deliveryPrice: Int
			$detailAddress: String
			$isDeliveryPriceExempt: Boolean
			$memo: String
			$phone: String
			$receiver: String
			$returnDetails: [ReturnDetailInputType]
			$returnId: Int
			$returnReason: String
			$zipCode: String
		) {
			updateReturn(
				address: $address
				deliveryPrice: $deliveryPrice
				detailAddress: $detailAddress
				isDeliveryPriceExempt: $isDeliveryPriceExempt
				memo: $memo
				phone: $phone
				receiver: $receiver
				returnDetails: $returnDetails
				returnId: $returnId
				returnReason: $returnReason
				zipCode: $zipCode
			) {
				success
				message
			}
		}
	`;
	static CompleteReturn = gql`
		mutation completeReturn(
			$returnId: Int
			$address: String
			$deliveryPrice: Int
			$detailAddress: String
			$isDeliveryPriceExempt: Boolean
			$memo: String
			$phone: String
			$receiver: String
			$returnDetails: [ReturnDetailInputType]
			$returnReason: String
			$zipCode: String
		) {
			completeReturn(
				returnId: $returnId
				address: $address
				deliveryPrice: $deliveryPrice
				detailAddress: $detailAddress
				isDeliveryPriceExempt: $isDeliveryPriceExempt
				memo: $memo
				phone: $phone
				receiver: $receiver
				returnDetails: $returnDetails
				returnReason: $returnReason
				zipCode: $zipCode
				) {
				success
				message
				}
		}
	`;
}
