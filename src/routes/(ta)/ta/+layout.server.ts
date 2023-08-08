import HttpClient from '$data/graphql/client';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get('JWT');
	const client = HttpClient.getInstance();
	try {
		await client.checkAuth(token);
	} catch (_) {
		throw redirect(302, '/ta/login');
	}
};
