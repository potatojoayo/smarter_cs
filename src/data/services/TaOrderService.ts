import HttpClient from '$data/graphql/client';
import TaOrderMutation from '$data/graphql/mutations/TaOrderMutation';

export default class TaOrderService {
	static async taOrder(variables: {
		gymId: number;
		orderedProducts: {
			productMasterId: number;
			productId: number;
			quantity: number;
			draftId?: number;
			studentNames?: string[];
			userRequest?: string;
		}[];
		address: string;
		detailAddress: string;
		zipCode: string;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(TaOrderMutation.CreateTaOrder, variables)) as {
			createTaOrder: {
				success: boolean;
				message: string;
			};
		};

		return {
			success: result.createTaOrder.success,
			message: result.createTaOrder.message
		};
	}

	static async updateTaOrder(variables: {
		id: number;
		details: { id: number; priceSpecial: number }[];
		pricePaid: number;
		priceDelivery: number;
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(TaOrderMutation.UpdateTaOrder, variables)) as {
			updateTaOrder: {
				success: boolean;
				message: boolean;
			};
		};

		return {
			success: result.updateTaOrder.success,
			message: result.updateTaOrder.message
		};
	}
}
