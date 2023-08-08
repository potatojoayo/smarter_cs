import { gql } from 'graphql-request';

export default class UserMutations {
	static getToken = gql`
		mutation Login($identification: String!, $password: String!) {
			tokenAuth(identification: $identification, password: $password) {
				token
				refreshToken
				user {
					id
					identification
					name
					isAdmin
					group
					subcontractor {
						name
					}
				}
			}
		}
	`;

	static deleteTokenCookie = gql`
		mutation DeleteTokenCooke {
			deleteTokenCookie {
				deleted
			}
		}
	`;

	static checkIsAdmin = gql`
		mutation CheckIsAdmin {
			checkIsAdmin {
				success
			}
		}
	`;

	static checkIsTa = gql`
		mutation CheckIsTa {
			checkIsTa {
				success
			}
		}
	`;
}
