import ChangeService from '$data/services/ChangeService';
import type { Page } from '@sveltejs/kit';

export async function load({ url }: Page) {
	const keyword = url.searchParams.get('keyword');
	const start = url.searchParams.get('start');
	const end = url.searchParams.get('end');
	const page = url.searchParams.get('page') !== null ? +url.searchParams.get('page')! : 1;
	const state = url.searchParams.get('state') || '전체';
	const result = await ChangeService.getChangeRequests({
		page: +page,
		keyword,
		state,
		start,
		end
	});
	const { changeRequests, totalCount } = result;
	return {
		changeRequests: changeRequests,
		totalCount: totalCount,
		page
	};
}
