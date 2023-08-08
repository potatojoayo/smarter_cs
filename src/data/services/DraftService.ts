import HttpClient from '$data/graphql/client';
import DraftQuery from '$data/graphql/queries/DraftQuery';
import Draft from '$data/classes/Draft';
import CsRequestMutation from '$data/graphql/mutations/CsRequestMutation';

export default class DraftService {
	static async getDraft(variables: { id: number }) {
		const client = HttpClient.getInstance();
		const result = (await client.request(DraftQuery.Draft, variables)) as {
			draft: {
				id: number;
				categoryName: string;
				subCategoryName: string;
				priceWork: number;
				priceWorkLabor: number;
				printing?: string;
				font?: string;
				threadColor?: string;
				dateCreated: Date;
				memo?: string;
				image: string;
				sizes: {
					id: number;
					name: string;
					backWidth?: number;
					backHeight?: number;
					leftChestWidth?: number;
					leftChestHeight?: number;
					rightChestWidth?: number;
					rightChestHeight?: number;
					leftShoulderWidth?: number;
					leftShoulderHeight?: number;
					rightShoulderWidth?: number;
					rightShoulderHeight?: number;
					heapWidth?: number;
					heapHeight?: number;
					leftPantMiddleWidth?: number;
					leftPantMiddleHeight?: number;
					rightPantMiddleWidth?: number;
					rightPantMiddleHeight?: number;
					leftPantLowWidth?: number;
					leftPantLowHeight?: number;
					rightPantLowWidth?: number;
					rightPantLowHeight?: number;
					flagWidth?: number;
					flagHeight?: number;
				}[];
			};
		};
		return new Draft(result.draft);
	}

	static async updateDraft(variables: {
		draftId: number;
		file?: File;
		draft: {
			priceWork: number;
			priceWorkLabor: number;
			printing?: string;
			font?: string;
			threadColor?: string;
			memo?: string;
			backWidth?: number;
			backHeight?: number;
			leftChestWidth?: number;
			leftChestHeight?: number;
			rightChestWidth?: number;
			rightChestHeight?: number;
			leftShoulderWidth?: number;
			leftShoulderHeight?: number;
			rightShoulderWidth?: number;
			rightShoulderHeight?: number;
			heapWidth?: number;
			heapHeight?: number;
			leftPantMiddleWidth?: number;
			leftPantMiddleHeight?: number;
			rightPantMiddleWidth?: number;
			rightPantMiddleHeight?: number;
			leftPantLowWidth?: number;
			leftPantLowHeight?: number;
			rightPantLowWidth?: number;
			rightPantLowHeight?: number;
			flagWidth?: number;
			flagHeight?: number;
		};
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CsRequestMutation.UpdateNewDraft, variables)) as {
			updateNewDraft: {
				success: boolean;
			};
		};
		const { success } = result.updateNewDraft;

		return success;
	}

	static async createDraft(variables: {
		userId: number;
		file: File;
		subcategoryName: string;
		draft: {
			priceWork: number;
			priceWorkLabor: number;
			printing?: string;
			font?: string;
			threadColor?: string;
			memo?: string;
			backWidth?: number;
			backHeight?: number;
			leftChestWidth?: number;
			leftChestHeight?: number;
			rightChestWidth?: number;
			rightChestHeight?: number;
			leftShoulderWidth?: number;
			leftShoulderHeight?: number;
			rightShoulderWidth?: number;
			rightShoulderHeight?: number;
			heapWidth?: number;
			heapHeight?: number;
			leftPantMiddleWidth?: number;
			leftPantMiddleHeight?: number;
			rightPantMiddleWidth?: number;
			rightPantMiddleHeight?: number;
			leftPantLowWidth?: number;
			leftPantLowHeight?: number;
			rightPantLowWidth?: number;
			rightPantLowHeight?: number;
			flagWidth?: number;
			flagHeight?: number;
		};
	}) {
		const client = HttpClient.getInstance();
		const result = (await client.request(CsRequestMutation.CreateNewDraft, variables)) as {
			createNewDraft: {
				success: boolean;
				draft: Draft;
			};
		};
		const { success, draft } = result.createNewDraft;

		return { success, draft: new Draft(draft) };
	}
}
