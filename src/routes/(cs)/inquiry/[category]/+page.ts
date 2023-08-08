import CsRequestService from '$data/services/CsRequestService';
import type { Page } from '@sveltejs/kit';

export async function load({ params, url }: Page) {
	// let { category } = params;
	// switch (category) {
	// 	case 'all':
	// 		category = '전체';
	// 		break;
	// 	case 'general':
	// 		category = '일반문의';
	// 		break;
	// 	case 'modify':
	// 		category = '주문변경';
	// 		break;
	// 	case 'delivery':
	// 		category = '오배송';
	// 		break;
	// 	case 'draft':
	// 		category = '로고시안';
	// 		break;
	// 	case 'money':
	// 		category = '스마터머니';
	// 		break;
	// 	case 'address':
	// 		category = '배송지';
	// 		break;
	// }
	const category = url.searchParams.get('category') ?? '전체';
	const page = url.searchParams.get('page') ?? '1';
	const keyword = url.searchParams.get('keyword');
	const csState = url.searchParams.get('csState') ?? '전체';
	const start = url.searchParams.get('start');
	const end = url.searchParams.get('end');

	const { totalCount, csRequests } = await CsRequestService.getRequests({
		category,
		page,
		keyword,
		csState,
		start,
		end
	});

	return {
		totalCount,
		csRequests
	};
}
