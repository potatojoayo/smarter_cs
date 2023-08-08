import HttpClient from '$data/graphql/client';
import DeliveryAddress from '$data/classes/DeliveryAddress';
import AddressQuery from '$data/graphql/queries/AddressQuery';

export default class AddressService {
	static async getAddressesOfUser(userId: number) {
		const client = HttpClient.getInstance();
		const result = (await client.request(AddressQuery.Addresses, { userId })) as {
			addresses: {
				name: string;
				phone: string;
				receiver: string;
				zipCode: string;
				address: string;
				detailAddress: string;
				id: number;
				isDefault: boolean;
			}[];
		};
		return result.addresses.map((a) => new DeliveryAddress(a));
	}
}
