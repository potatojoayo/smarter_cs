import { gql } from 'graphql-request';
import type { PageServerLoad } from './$types';
import HttpClient from '$data/graphql/client';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const page = url.searchParams.get('page'),
		state = url.searchParams.get('state'),
		keyword = url.searchParams.get('keyword'),
		start = url.searchParams.get('start'),
		end = url.searchParams.get('end'),
		token = cookies.get('JWT');

	const MyTaOrderMasters = gql`
		query MyTaOrderMasters(
			$page: Int
			$state: String
			$keyowrd: String
			$start: String
			$end: String
			$token: String!
		) {
			myTaOrderMasters(
				page: $page
				start: $start
				keyword: $keyowrd
				end: $end
				state: $state
				token: $token
			) {
				taOrderMasters {
					id
					orderNumber
					dateOrdered
					gymName
					totalPriceGym
					totalPriceSpecial
					pricePaid
					priceDelivery
					priceToBePaid
					state
				}
				totalCount
			}
		}
	`;

	const client = HttpClient.getInstance();

	const { myTaOrderMasters } = (await client.request(MyTaOrderMasters, {
		page,
		state,
		keyword,
		start,
		end,
		token
	})) as {
		myTaOrderMasters: {
			taOrderMasters: {
				orderNumber: string;
				dateOrdered: Date;
				gymName: string;
				totalPriceGym: number;
				totalPriceSpecial: number;
				pricePaid: number;
				priceDelivery: number;
				priceToBePaid: number;
			}[];
			totalCount: number;
		};
	};

	return {
		myTaOrderMasters
	};
};
