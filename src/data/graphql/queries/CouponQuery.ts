import { gql } from 'graphql-request';

export default class CouponQuery {
	static CouponMaster = gql`
		query CouponMaster($name: String) {
			couponMaster(name: $name) {
				id
				price
				countPerIssue
				type
				name
				expireDay
				totalIssuedCount
			}
		}
	`;
	static CouponIssued = gql`
		query IssuedCoupons(
			$couponType: String
			$page: Int
			$keyword: String
			$start: String
			$end: String
		) {
			issuedCoupons(
				couponType: $couponType
				page: $page
				keyword: $keyword
				start: $start
				end: $end
			) {
				totalCount
				issuedCouponsHistories {
					id
					couponNumber
					gymName
					price
					dateIssued
					startOfUse
					endOfUse
					coupon {
						referralCode
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
			}
		}
	`;

	static ManualCouponIssueHistories = gql`
		query ManualCouponIssueHistories($page: Int, $keyword: String, $start: String, $end: String) {
			couponMasterIssueHistories(
				page: $page
				keyword: $keyword
				start: $start
				end: $end
				couponType: "수동쿠폰"
			) {
				couponMasterIssueHistories {
					couponMaster {
						id
						name
					}
					condition
					thresholdAmount
					issuedCountPerGym
					issuedAmountPerGym
					searchType
					totalIssuedCount
					totalIssuedAmount
					expiredDay
					couponMessage
					dateIssued
				}
				totalCount
			}
		}
	`;

	//쿠폰 사용내역 불러오기 쿼리문
	static usedCouponList = gql`
		query UsedCoupons(
			$couponMasterId: Int
			$page: Int
			$couponType: String
			$keyword: String
			$start: String
			$end: String
		) {
			usedCoupons(
				couponMasterId: $couponMasterId
				page: $page
				couponType: $couponType
				keyword: $keyword
				start: $start
				end: $end
			) {
				totalCount
				usedCouponsHistories {
					couponNumber
					gymName
					price
					orderNumber
					dateUsed
					coupon {
						referralCode
						couponMaster {
							name
						}
					}
				}
			}
		}
	`;

	static menualCouponList = gql`
		query CouponMaster($couponType: String, $page: Int) {
			couponMasters(couponType: $couponType, page: $page) {
				couponMasters {
					id
					name
					price
					dateCreated
					totalIssuedCount
				}
				totalCount
			}
		}
	`;

	//수동발행쿠폰-쿠폰목록-쿠폰클릭 후 모달에서 총 발급 인원 수와 총 예상 금액, 해당 체육관 목록 불러오기
	static manualCouponTargetList = gql`
		query CouponInfos(
			$couponMasterId: Int
			$subject: String
			$subjectPrice: Int
			$issueCount: Int
		) {
			couponInfos(
				couponMasterId: $couponMasterId
				subject: $subject
				subjectPrice: $subjectPrice
				issueCount: $issueCount
			) {
				totalUsersCount
				totalExpectedPrice
				gymIds
			}
		}
	`;

	static AddressZipCodes = gql`
		query AddressZipCodes {
			addressZipCodes {
				id
				siDo
				children {
					id
					siGunGu
				}
			}
		}
	`;
}
