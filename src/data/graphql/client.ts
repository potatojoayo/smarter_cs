import { GraphQLClient } from 'graphql-request';
import type { Variables } from 'graphql-request';
import { gql } from 'graphql-request';

const VerifyToken = gql`
	mutation VerifyToken($token: String) {
		verifyToken(token: $token) {
			payload
		}
	}
`;

class HttpClient {
	private static instance: HttpClient;
	private client = new GraphQLClient(import.meta.env.VITE_GRAPHQL_ENDPOINT, {
		credentials: 'include'
	});

	public static getInstance(): HttpClient {
		if (!HttpClient.instance) {
			HttpClient.instance = new HttpClient();
		}
		return HttpClient.instance;
	}

	request = async (query: string, variables?: Variables) => {
		return await this.client.request(query, variables);
	};

	async checkAuth(token?: string) {
		await this.client.request(VerifyToken, { token });
	}
}

export default HttpClient;
