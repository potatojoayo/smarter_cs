import ProductMaster from '$data/classes/ProductMaster';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const id = +params.id;
	const productMaster = await ProductMaster.fromId(id);
	return { productMaster };
};
