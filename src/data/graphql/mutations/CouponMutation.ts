import { gql } from 'graphql-request';

export default class CouponMutation {
	static UpdateNewMemberCoupon = gql`
		mutation UpdateNewMemberCoupon($price: Int, $countPerIssue: Int, $expireDay: Int) {
			updateNewMemberCoupon(expireDay: $expireDay, countPerIssue: $countPerIssue, price: $price) {
				success
				couponMaster {
					id
					price
					countPerIssue
					type
					name
					expireDay
					totalIssuedCount
				}
			}
		}
	`;
	static UpdateReferralCoupon = gql`
		mutation UpdateReferralCoupon($price: Int, $countPerIssue: Int, $expireDay: Int) {
			updateReferralCoupon(expireDay: $expireDay, countPerIssue: $countPerIssue, price: $price) {
				success
				couponMaster {
					id
					price
					countPerIssue
					type
					name
					expireDay
					totalIssuedCount
				}
			}
		}
	`;

	static createManualCoupon = gql`
		mutation createCoupon($message: String, $name: String, $price: Int) {
			createCoupon(message: $message, name: $name, price: $price) {
				success
			}
		}
	`;

	static IssueManualCoupon = gql`
		mutation IssueManualCoupon(
			$couponMasterId: Int!
			$gymIds: [Int]!
			$issueNumber: Int!
			$expireDay: Int!
			$couponMessage: String!
			$addressZipCodeId: Int
			$condition: String
			$thresholdAmount: Int
			$searchType: String
		) {
			issueManualCoupon(
				couponMasterId: $couponMasterId
				gymIds: $gymIds
				issueNumber: $issueNumber
				expireDay: $expireDay
				couponMessage: $couponMessage
				addressZipCodeId: $addressZipCodeId
				condition: $condition
				thresholdAmount: $thresholdAmount
				searchType: $searchType
			) {
				success
				message
			}
		}
	`;
}
