import { gql } from 'graphql-request';
import type { PageLoad } from './$types';
import HttpClient from '$data/graphql/client';
import type { Category } from '$data/classes/Category';
import ParentCategory from '$data/classes/Category';
import Customer from '$data/classes/Customer';
import DeliveryAddress from '$data/classes/DeliveryAddress';

export const load: PageLoad = async ({ url }) => {
	const gymId = url.searchParams.get('gymId');
	const client = HttpClient.getInstance();
	const Query = gql`
		query TaOrder($gymId: Int) {
			categories {
				id
				name
				children {
					id
					name
				}
			}
			customer(id: $gymId) {
				id
				smarterMoney
				user {
					userId
					identification
					refundAccountNo
					refundAccountBank
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
			}
		}
	`;

	const result = (await client.request(Query, { gymId })) as {
		categories: {
			id: number;
			name: string;
			children: Category[];
		}[];
		customer?: {
			id: number;
			smarterMoney?: number;
			user: {
				userId?: number;
				identification?: string;
				phone: string;
				name: string;
				refundAccountBank?: string;
				refundAccountNo?: string;
				refundAccountOwner?: string;
				wallet?: {
					balance: number;
				};
				addresses: {
					id: number;
					name: string;
					receiver: string;
					address: string;
					detailAddress: string;
					isDefault: boolean;
					phone: string;
					zipCode: string;
					deliveryMemo?: string;
				}[];
			};
			name: string;
			address?: string;
			detailAddress?: string;
			zipCode?: string;
			agency?: {
				name: string;
			};
			businessRegistrationNumber?: string;
			businessRegistrationCertificate?: URL;
			memo?: string;
		};
	};

	const parentCategories = result.categories.map((c) => new ParentCategory(c));
	const customer = result.customer ? new Customer(result.customer) : undefined;
	const deliveryAddresses = result.customer?.user.addresses.map((a) => new DeliveryAddress(a));

	return {
		parentCategories,
		customer,
		deliveryAddresses
	};
};
