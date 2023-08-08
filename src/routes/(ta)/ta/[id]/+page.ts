import { gql } from 'graphql-request';
import type { PageLoad } from './$types';
import HttpClient from '$data/graphql/client';
import TaOrderMaster from '$data/classes/TaOrderMaster';

export const load: PageLoad = async ({ params }) => {
	const id = params.id;

	const TaOrderMasterQuery = gql`
		query TaOrderMaster($id: Int) {
			taOrderMaster(taOrderMasterId: $id) {
				id
				orderNumber
				dateOrdered
				gymName
				taName
				ordererName
				phone
				address
				detailAddress
				pricePaid
				priceDelivery
				priceToBePaid
				totalPriceSpecial
				totalPriceGym
				totalCount
				zipCode
				receiver
				isPickUp
				taOrderDetails {
					id
					productImage
					productName
					color
					size
					priceGym
					priceSpecial
					quantity
					totalPriceSpecial
					priceWork
				}
			}
		}
	`;

	const client = HttpClient.getInstance();
	const result = (await client.request(TaOrderMasterQuery, { id })) as {
		taOrderMaster: Required<TaOrderMaster>;
	};
	const taOrderMaster = new TaOrderMaster(result.taOrderMaster);
	return {
		taOrderMaster
	};
};
