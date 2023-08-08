import { page } from '$app/stores';
import { goto } from '$app/navigation';

export async function deleteSearchParams({
	deleteParams,
	replaceState = true,
	noScroll = false
}: {
	deleteParams: string[];
	replaceState?: boolean;
	noScroll?: boolean;
}) {
	let query = new URLSearchParams();
	page.subscribe((p) => {
		const searchParams = p.url.searchParams;
		deleteParams.forEach((d) => searchParams.delete(d));
		query = new URLSearchParams(searchParams.toString());
	});
	await goto(`?${query.toString()}`, {
		replaceState,
		noScroll,
		invalidateAll: true
	});
}
