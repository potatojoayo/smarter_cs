import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';

export async function reload(options?: { deleteParams?: string[]; noScroll?: boolean }) {
	const searchParams = get(page).url.searchParams;
	if (options?.deleteParams) {
		options.deleteParams.forEach((d) => searchParams.delete(d));
	}
	const query = new URLSearchParams(searchParams.toString());
	await goto(`?${query.toString()}`, {
		replaceState: true,
		invalidateAll: true,
		noScroll: options?.noScroll
	});
}
