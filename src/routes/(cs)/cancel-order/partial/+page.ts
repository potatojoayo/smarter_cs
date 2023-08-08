import { gql } from 'graphql-request';
import type { Page } from '@sveltejs/kit';
import HttpClient from '$data/graphql/client';
import PartialCancelHistory from '$data/classes/PartialCancelHistory';

export async function load({ url }: Page) {
	const PartialCancelHistories = gql`
		query PartialCancelHistories($page: Int = 1, $keyword: String, $start: String, $end: String) {
			partialCancelHistories(page: $page, keyword: $keyword, start: $start, end: $end) {
				partialCancelHistories {
					csRequestNumber
					csRequestId
					orderNumber
					orderMasterId
					gymName
					reason
					priceTotal
					productName
					color
					size
					priceProduct
					canceledQuantity
					dateCreated
				}
				totalCount
			}
		}
	`;

	const page = url.searchParams.get('page') ?? '1',
		keyword = url.searchParams.get('keyword') ?? undefined,
		start = url.searchParams.get('start') ?? undefined,
		end = url.searchParams.get('end') ?? undefined;

	const client = HttpClient.getInstance(),
		{ partialCancelHistories } = (await client.request(PartialCancelHistories, {
			page,
			keyword,
			start,
			end
		})) as {
			partialCancelHistories: {
				partialCancelHistories: PartialCancelHistory[];
				totalCount: number;
			};
		};

	return {
		partialCancelHistories: partialCancelHistories.partialCancelHistories.map(
			(pch) => new PartialCancelHistory(pch)
		),
		totalCount: partialCancelHistories.totalCount
	};
}
