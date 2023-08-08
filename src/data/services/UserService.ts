import HttpClient from '$data/graphql/client';
import UserMutations from '$data/graphql/mutations/UserMutations';
import { goto } from '$app/navigation';

export default class UserService {
	static async getAdminToken({ id, password }: { id: string; password: string }) {
		const client = HttpClient.getInstance();
		try {
			const result = (await client.request(UserMutations.getToken, {
				identification: id,
				password
			})) as {
				tokenAuth: {
					token: string;
					refreshToken: string;
				};
			};

			const {
				checkIsAdmin: { success }
			} = (await client.request(UserMutations.checkIsAdmin)) as {
				checkIsAdmin: {
					success: boolean;
				};
			};

			if (success) {
				await goto('/');
			} else {
				await this.deleteTokenCookies();
				alert('권한이 없습니다.');
			}
		} catch (e) {
			alert('아이디와 비밀번호를 다시 확인해 주세요.');
		}
	}

	static async getTaToken({ id, password }: { id: string; password: string }) {
		const client = HttpClient.getInstance();
		try {
			await client.request(UserMutations.getToken, {
				identification: id,
				password
			});

			const {
				checkIsTa: { success }
			} = (await client.request(UserMutations.checkIsTa)) as {
				checkIsTa: {
					success: boolean;
				};
			};

			if (success) {
				await goto('/ta/order');
			} else {
				await this.deleteTokenCookies();
				alert('권한이 없습니다.');
			}
		} catch (e) {
			alert('아이디와 비밀번호를 다시 확인해 주세요.');
		}
	}

	static async deleteTokenCookies() {
		const client = HttpClient.getInstance();
		const result = (await client.request(UserMutations.deleteTokenCookie)) as {
			deleteTokenCookie: {
				deleted: boolean;
			};
		};
		return result.deleteTokenCookie.deleted;
	}
}
