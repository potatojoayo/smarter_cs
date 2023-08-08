import { gql } from 'graphql-request';

export default class ChangeRequestMutation {
	static UpdateChangeRequest = gql`
		mutation UpdateChangeRequest(
			$changeRequestId: Int
			$changeRequestDetails: [ChangeDetailInputType]
			$changeReason: String
			$pickUpPhone: String
			$pickUpAddress: String
			$pickUpDetailAddress: String
			$pickUpZipCode: String
			$deliveryReceiver: String
			$deliveryPhone: String
			$deliveryAddress: String
			$deliveryDetailAddress: String
			$deliveryZipCode: String
			$memo: String
			$isChangedPriceExempt: Boolean
			$isDeliveryPriceExempt: Boolean
			$deliveryPrice: Int = 0
			$deliveryAgencyId: Int
			$trackingNumber: String
		) {
			updateChangeRequest(
				changeRequestId: $changeRequestId
				changeRequestDetails: $changeRequestDetails
				changeReason: $changeReason
				pickUpPhone: $pickUpPhone
				pickUpAddress: $pickUpAddress
				pickUpDetailAddress: $pickUpDetailAddress
				pickUpZipCode: $pickUpZipCode
				deliveryReceiver: $deliveryReceiver
				deliveryPhone: $deliveryPhone
				deliveryAddress: $deliveryAddress
				deliveryDetailAddress: $deliveryDetailAddress
				deliveryZipCode: $deliveryZipCode
				memo: $memo
				isChangedPriceExempt: $isChangedPriceExempt
				isDeliveryPriceExempt: $isDeliveryPriceExempt
				deliveryPrice: $deliveryPrice
				deliveryAgencyId: $deliveryAgencyId
				trackingNumber: $trackingNumber
			) {
				success
			}
		}
	`;

	static CreateChangeRequest = gql`
		mutation CreateChangeRequest(
			$csRequestId: Int!
			$orderDetails: [ChangeInputType]
			$changeReason: String
			$pickUpReceiver: String
			$pickUpPhone: String
			$pickUpAddress: String
			$pickUpDetailAddress: String
			$pickUpZipCode: String
			$deliveryReceiver: String
			$deliveryPhone: String
			$deliveryAddress: String
			$deliveryDetailAddress: String
			$deliveryZipCode: String
			$memo: String
		) {
			createChangeRequest(
				csRequestId: $csRequestId
				orderDetails: $orderDetails
				changeReason: $changeReason
				pickUpReceiver: $pickUpReceiver
				pickUpPhone: $pickUpPhone
				pickUpAddress: $pickUpAddress
				pickUpDetailAddress: $pickUpDetailAddress
				pickUpZipCode: $pickUpZipCode
				deliveryReceiver: $deliveryReceiver
				deliveryPhone: $deliveryPhone
				deliveryAddress: $deliveryAddress
				deliveryDetailAddress: $deliveryDetailAddress
				deliveryZipCode: $deliveryZipCode
				memo: $memo
			) {
				success
				message
			}
		}
	`;

	static CompleteChangeRequest = gql`
		mutation CompleteChange(
			$changeRequestId: Int
			$changeRequestDetails: [ChangeDetailInputType]
			$changeReason: String
			$pickUpPhone: String
			$pickUpAddress: String
			$pickUpDetailAddress: String
			$pickUpZipCode: String
			$deliveryReceiver: String
			$deliveryPhone: String
			$deliveryAddress: String
			$deliveryDetailAddress: String
			$deliveryZipCode: String
			$memo: String
			$isChangedPriceExempt: Boolean
			$isDeliveryPriceExempt: Boolean
			$deliveryPrice: Int = 0
			$deliveryAgencyId: Int
			$trackingNumber: String
		) {
			completeChange(
				changeRequestId: $changeRequestId
				changeRequestDetails: $changeRequestDetails
				changeReason: $changeReason
				pickUpPhone: $pickUpPhone
				pickUpAddress: $pickUpAddress
				pickUpDetailAddress: $pickUpDetailAddress
				pickUpZipCode: $pickUpZipCode
				deliveryReceiver: $deliveryReceiver
				deliveryPhone: $deliveryPhone
				deliveryAddress: $deliveryAddress
				deliveryDetailAddress: $deliveryDetailAddress
				deliveryZipCode: $deliveryZipCode
				memo: $memo
				isChangedPriceExempt: $isChangedPriceExempt
				isDeliveryPriceExempt: $isDeliveryPriceExempt
				deliveryPrice: $deliveryPrice
				deliveryAgencyId: $deliveryAgencyId
				trackingNumber: $trackingNumber
			) {
				success
			}
		}
	`;
}
