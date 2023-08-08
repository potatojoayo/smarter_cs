import { gql } from 'graphql-request';

export default class CancelOrderMutation {
	static ConcludeCancelOrderWithoutDeposit = gql`
		mutation ConcludeCancelOrderWithoutDeposit($cancelIds: [Int]) {
			concludeCancelOrderWithoutDeposit(cancelIds: $cancelIds) {
				success
				message
			}
		}
	`;
}
