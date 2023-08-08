import type { Page } from '@sveltejs/kit';
import { gql } from 'graphql-request';
import HttpClient from '$data/graphql/client';
import CancelOrderRequest from '$data/classes/CancelOrderRequest';

export async function load({ url }: Page) {
	const CancelOrderRequests = gql`
		query CancelOrderRequests(
			$page: Int = 1
			$state: String
			$keyword: String
			$start: String
			$end: String
		) {
			cancelOrderRequests(
				page: $page
				state: $state
				keyword: $keyword
				start: $start
				end: $end
				isWithoutDeposit: true
			) {
				cancelOrderRequests {
					id
					csRequestNumber
					csRequestId
					orderNumber
					orderMasterId
					gymName
					reason
					priceProducts
					priceWorks
					priceDelivery
					priceTotal
					state
					dateCreated
					dateCompleted
				}
				totalCount
			}
		}
	`;

	const page = url.searchParams.get('page') ?? '1',
		state = url.searchParams.get('state') ?? '전체',
		keyword = url.searchParams.get('keyword') ?? undefined,
		start = url.searchParams.get('start') ?? undefined,
		end = url.searchParams.get('end') ?? undefined;

	const client = HttpClient.getInstance(),
		{ cancelOrderRequests } = (await client.request(CancelOrderRequests, {
			page,
			state,
			keyword,
			start,
			end
		})) as {
			cancelOrderRequests: {
				cancelOrderRequests: CancelOrderRequest[];
				totalCount: number;
			};
		};
	return {
		cancelOrderRequests: cancelOrderRequests.cancelOrderRequests.map(
			(cor) => new CancelOrderRequest(cor)
		),
		totalCount: cancelOrderRequests.totalCount
	};
}
