import CsRequestService from '$data/services/CsRequestService';
import { getInquiryType, InquiryType } from '$data/enums/InqueryType';
import OrderService from '$data/services/OrderService';

export interface CsRequestContents {
	contents: string;
	dateCreated?: Date;
	id?: number;
	replies?: CsRequestContents[];
}

export interface CsRequestMemo {
	contents: string;
	dateCreated: Date;
	id: number;
}

export default class CsRequest {
	id: number;
	requestNumber?: string;
	dateRequested?: Date;
	gymName?: string;
	category: string;
	csState = '미처리';
	reason?: string;
	orderState?: string;
	requestMemos: CsRequestMemo[] = [];
	dateCompleted?: Date;
	requestContents: CsRequestContents[] = [];
	orderMasterId?: number;
	gymId: number;
	orderNumber?: string;

	constructor({
		id,
		requestNumber,
		dateRequested,
		gymName,
		category,
		csState,
		reason,
		orderState,
		requestMemos = [],
		dateCompleted,
		requestContents = [],
		orderMasterId,
		gymId,
		orderNumber
	}: {
		id: number;
		requestNumber?: string;
		dateRequested?: Date;
		gymName?: string;
		category: string;
		csState?: string;
		reason?: string;
		orderState?: string;
		requestMemos?: CsRequestMemo[];
		dateCompleted?: Date;
		requestContents?: CsRequestContents[];
		orderMasterId?: number;
		gymId: number;
		orderNumber?: string;
	}) {
		this.id = id;
		this.gymId = gymId;
		this.requestNumber = requestNumber;
		this.dateRequested = dateRequested;
		this.gymName = gymName;
		this.category = category;
		this.orderMasterId = orderMasterId;
		this.reason = reason;
		if (csState) this.csState = csState;
		this.dateCompleted = dateCompleted;
		this.orderState = orderState;
		this.orderNumber = orderNumber;
		this.requestMemos = requestMemos;
		if (requestContents) this.requestContents = requestContents;
		else
			this.requestContents = [
				{
					contents: ''
				}
			];
	}

	static async create({
		gymId,
		category,
		orderMasterId,
		reason,
		memo,
		contents
	}: {
		gymId: number;
		category: string;
		orderMasterId?: number;
		reason?: string;
		memo: string;
		contents: string;
	}): Promise<{ success: boolean; csRequestId?: number }> {
		if (!contents) {
			alert('문의내용을 작성해주세요.');
			return { success: false };
		}
		if (getInquiryType({ category }) === InquiryType.order) {
			if (!orderMasterId) {
				alert('주문을 선택해주세요.');
				return { success: false };
			}
		}
		const result = (await CsRequestService.createCsRequest({
			category,
			gymId,
			orderMasterId,
			reason,
			memo,
			contents
		})) as {
			success: boolean;
			csRequestId?: number;
		};
		return {
			success: result.success,
			csRequestId: result.csRequestId
		};
	}

	async update(variables: {
		category?: string;
		reason?: string;
		memo?: string;
		csState?: string;
		orderMasterId?: number;
	}) {
		return await CsRequestService.updateCsRequest({
			id: this.id,
			...variables
		});
	}

	async deleteContents(variables: { id: number }) {
		return await CsRequestService.deleteCsRequestContents(variables);
	}

	// async deleteMemo(variables: { id: number }) {
	// 	return await CsRequestService.deleteCsRequestMemo(variables);
	// }

	async createContents(variables: { contents: string }) {
		return await CsRequestService.createCsRequestContents({ id: this.id, ...variables });
	}

	async updateContents(variables: { contentId: number; contents: string }) {
		return await CsRequestService.updateCsRequestContents(variables);
	}

	async updateReply(variables: { replyId: number; contents: string }) {
		return await CsRequestService.UpdateContentReply(variables);
	}

	// async createMemo(variables: { memo: string }) {
	// 	return await CsRequestService.createCsRequestMemo({ id: this.id, ...variables });
	// }

	async createReply(parentId: number, contents: string) {
		return await CsRequestService.createCsRequestReply({ parentId, contents });
	}

	async deleteReply(contentId: number) {
		return await CsRequestService.deleteCsRequestReply({ contentId });
	}

	async cancelOrder() {
		return await OrderService.cancelOrder({ csRequestId: this.id });
	}

	async partialCancelOrders({ orderDetailIds }: { orderDetailIds: number[] }) {
		return await OrderService.partialCancelOrders({ csRequestId: this.id, orderDetailIds });
	}
}
