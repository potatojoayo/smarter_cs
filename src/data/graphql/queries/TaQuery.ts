import { gql } from 'graphql-request';

export default class TaQuery {
	static Categories = gql`
		query Categories {
			categories {
				id
				name
				children {
					id
					name
				}
			}
		}
	`;
}
