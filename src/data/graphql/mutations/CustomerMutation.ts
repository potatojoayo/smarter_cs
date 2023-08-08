import { gql } from 'graphql-request';

export default class CustomerMutation {
	static CsSubtractSmarterMoney = gql`
		mutation CsSubtractSmarterMoney($userId: Int!, $amount: Int!, $description: String) {
			csSubtractSmarterMoney(userId: $userId, amount: $amount, description: $description) {
				success
			}
		}
	`;
	static CsChargeSmarterMoney = gql`
		mutation CsChargeSmarterMoney($userId: Int!, $amount: Int!, $description: String) {
			csChargeSmarterMoney(userId: $userId, amount: $amount, description: $description) {
				success
			}
		}
	`;
	static SetPassword = gql`
		mutation SetPassword($id: Int, $password: String, $confirmPassword: String) {
			setPassword(userId: $id, newPassword: $password, confirmPassword: $confirmPassword) {
				success
			}
		}
	`;

	static UpdateUserInfo = gql`
		mutation UpdateUserInfo(
			$id: Int
			$gymName: String
			$userName: String
			$phone: String
			$agencyName: String
			$memo: String
			$address: String
			$detailAddress: String
			$zipCode: String
			$refundAccountBank: String
			$refundAccountNo: String
			$refundAccountOwner: String
		) {
			updateUserInfo(
				gymId: $id
				userName: $userName
				phone: $phone
				agencyName: $agencyName
				memo: $memo
				gymName: $gymName
				address: $address
				detailAddress: $detailAddress
				zipCode: $zipCode
				refundAccountBank: $refundAccountBank
				refundAccountNo: $refundAccountNo
				refundAccountOwner: $refundAccountOwner
			) {
				success
			}
		}
	`;

	static DeleteAddress = gql`
		mutation DeleteAddress($addressId: Int!) {
			deleteAddress(addressId: $addressId) {
				success
			}
		}
	`;

	static UpdateAddress = gql`
		mutation UpdateAddress(
			$id: Int
			$name: String
			$receiver: String
			$phone: String
			$zipCode: String
			$address: String
			$detailAddress: String
			$isDefault: Boolean
			$deliveryMemo: String
			$page: Int
		) {
			updateAddress(
				addressId: $id
				name: $name
				page: $page
				receiver: $receiver
				phone: $phone
				zipCode: $zipCode
				address: $address
				detailAddress: $detailAddress
				isDefault: $isDefault
				deliveryMemo: $deliveryMemo
			) {
				success
				addresses {
					id
					name
					receiver
					address
					detailAddress
					isDefault
					deliveryMemo
					zipCode
					phone
				}
			}
		}
	`;

	static CreateAddress = gql`
		mutation CreateAddress(
			$name: String
			$receiver: String
			$phone: String
			$zipCode: String
			$address: String
			$detailAddress: String
			$isDefault: Boolean
			$deliveryMemo: String
			$gymId: Int
		) {
			createAddress(
				gymId: $gymId
				name: $name
				receiver: $receiver
				phone: $phone
				zipCode: $zipCode
				address: $address
				detailAddress: $detailAddress
				isDefault: $isDefault
				deliveryMemo: $deliveryMemo
			) {
				success
			}
		}
	`;
}
