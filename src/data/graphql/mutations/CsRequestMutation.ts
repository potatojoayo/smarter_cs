import { gql } from 'graphql-request';

export default class CsRequestMutation {
	static CreateCsRequest = gql`
		mutation CreateCsRequest(
			$orderMasterId: Int
			$category: String!
			$gymId: Int!
			$reason: String
			$contents: String
			$memo: String
		) {
			createCsRequest(
				orderMasterId: $orderMasterId
				category: $category
				gymId: $gymId
				reason: $reason
				contents: $contents
				memo: $memo
			) {
				success
				csRequestId
			}
		}
	`;

	static UpdateCsRequest = gql`
		mutation UpdateCsRequest(
			$id: Int
			$category: String
			$reason: String
			$memo: String
			$csState: String
			$orderMasterId: Int
		) {
			updateCsRequest(
				csRequestId: $id
				reason: $reason
				category: $category
				memo: $memo
				csState: $csState
				orderMasterId: $orderMasterId
			) {
				success
			}
		}
	`;

	static DeleteCsRequestContents = gql`
		mutation DeleteCsRequestContents($id: Int) {
			deleteCsRequestContents(csRequestContentId: $id) {
				success
				csRequestContents {
					id
					dateCreated
					csRequestContentId
					contents
				}
			}
		}
	`;

	// static DeleteCsRequestMemo = gql`
	// 	mutation DeleteCsRequestMemo($id: Int) {
	// 		deleteCsRequestMemo(csRequestMemoId: $id) {
	// 			success
	// 			csRequestMemos {
	// 				id
	// 				dateCreated
	// 				contents
	// 			}
	// 		}
	// 	}
	// `;

	static CreateCsRequestContents = gql`
		mutation CreateCsRequestContents($id: Int, $contents: String) {
			createCsRequestContents(csRequestId: $id, contents: $contents) {
				success
				csRequestContents {
					id
					dateCreated
					csRequestContentId
					contents
					replies {
						id
						dateCreated
						csRequestContentId
						contents
					}
				}
			}
		}
	`;

	static UpdateCsRequestContents = gql`
		mutation UpdateCsRequestContents($contentId: Int, $contents: String) {
			updateCsRequestContents(contentId: $contentId, contents: $contents) {
				success
				csRequestContents {
					id
					dateCreated
					csRequestContentId
					contents
					replies {
						id
						dateCreated
						csRequestContentId
						contents
					}
				}
			}
		}
	`;

	static UpdateContentReply = gql`
		mutation UpdateContentReply($replyId: Int, $contents: String) {
			updateContentReply(replyId: $replyId, contents: $contents) {
				success
				reply {
					id
					dateCreated
					csRequestContentId
					contents
					replies {
						id
						dateCreated
						csRequestContentId
						contents
					}
				}
			}
		}
	`;

	static CreateContentReply = gql`
		mutation CreateContentReply($contents: String, $parentId: Int) {
			createContentReply(contents: $contents, parentId: $parentId) {
				success
				reply {
					id
					dateCreated
					contents
				}
			}
		}
	`;

	static DeleteContentReply = gql`
		mutation DeleteContentReply($contentId: Int) {
			deleteContentReply(contentId: $contentId) {
				success
			}
		}
	`;

	static CreateCsRequestMemo = gql`
		mutation CreateCsRequestMemo($id: Int, $memo: String) {
			createCsRequestMemo(csRequestId: $id, memo: $memo) {
				success
				csRequestMemos {
					id
					dateCreated
					contents
				}
			}
		}
	`;

	static UpdateNewDraft = gql`
		mutation UpdateNewDraft($draftId: Int!, $draft: NewDraftInputType!, $file: Upload, $sizes:[DraftSizeInputType]) {
			updateNewDraft(draftId: $draftId, draft: $draft, file: $file, sizes:$sizes) {
				success
			}
		}
	`;

	static CreateNewDraft = gql`
		mutation CreateNewDraft(
			$draft: NewDraftInputType!
			$file: Upload
			$userId: Int
			$subcategoryName: String
			$sizes: [DraftSizeInputType]
		) {
			createNewDraft(
				draft: $draft
				file: $file
				userId: $userId
				subcategoryName: $subcategoryName
				sizes: $sizes
			) {
				success
				
			}
		}
	`;
}
