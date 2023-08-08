import HttpClient from '$data/graphql/client';
import CancelOrderMutation from '$data/graphql/mutations/CancelOrderMutation';

export default class CancelORderService {
	static async concludeCancelOrderWithoutDeposit(variables: { cancelIds: number[] }) {
		const client = HttpClient.getInstance();
		const {
			concludeCancelOrderWithoutDeposit: { success, message }
		} = (await client.request(
			CancelOrderMutation.ConcludeCancelOrderWithoutDeposit,
			variables
		)) as {
			concludeCancelOrderWithoutDeposit: {
				success: boolean;
				message: string;
			};
		};
		return {
			success,
			message
		};
	}
}
