import { gql } from 'graphql-request';

export default class AddressQuery {
	static Addresses = gql`
		query Addresses($userId: Int) {
			addresses(userId: $userId) {
				id
				name
				phone
				receiver
				zipCode
				address
				detailAddress
				isDefault
			}
		}
	`;
}
