import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';

export async function changeSearchParam({
	param,
	value,
	deleteParams,
	replaceState = true,
	invalidateAll = false,
	noScroll = false
}: {
	param: string;
	value: string;
	deleteParams?: string[];
	replaceState?: boolean;
	invalidateAll?: boolean;
	noScroll?: boolean;
}) {
	const searchParams = get(page).url.searchParams;
	if (deleteParams) {
		deleteParams.forEach((d) => searchParams.delete(d));
	}
	const query = new URLSearchParams(searchParams.toString());
	query.set(param, value);
	await goto(`?${query.toString()}`, {
		replaceState,
		invalidateAll,
		noScroll
	});
}
