import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';

export function changeSearchParams({
	params,
	deleteParams,
	replaceState = true,
	noScroll = false,
	invalidateAll = false
}: {
	params: {
		param: string;
		value: string;
	}[];
	deleteParams?: string[];
	replaceState?: boolean;
	noScroll?: boolean;
	invalidateAll?: boolean;
}) {
	const searchParams = get(page).url.searchParams;
	if (deleteParams) {
		deleteParams.forEach((d) => searchParams.delete(d));
	}
	const query = new URLSearchParams(searchParams.toString());

	params.forEach((p) => {
		query.set(p.param, p.value);
	});
	goto(`?${query.toString()}`, {
		replaceState,
		noScroll,
		invalidateAll
	});
}
