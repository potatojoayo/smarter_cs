export default class ReturnRequests {
	id: number;
	csRequestNumber: string;
	csRequestId: number;
	orderNumber: string;
	gymName: string;
	returnReason: string;
	returnProductsName: string;
	totalReturnPrice: number;
	totalProductsPrice: number;
	state: string;
	dateCreated: Date;

	constructor({
		id,
		csRequestNumber,
		orderNumber,
		gymName,
		returnReason,
		returnProductsName,
		totalReturnPrice,
		totalProductsPrice,
		state,
		dateCreated,
		csRequest
	}: {
		id: number;
		csRequest?: {
			id: number;
		};
		csRequestNumber: string;
		orderNumber: string;
		gymName: string;
		returnReason: string;
		returnProductsName: string;
		totalReturnPrice: number;
		totalProductsPrice: number;
		state: string;
		dateCreated: Date;
	}) {
		this.id = id;
		if(csRequestNumber){
			this.csRequestNumber = csRequestNumber;
		}
		this.orderNumber = orderNumber;
		this.gymName = gymName;
		this.returnReason = returnReason;
		if(csRequest) {
			this.csRequestId = csRequest.id;
		}
		this.returnProductsName = returnProductsName;
		this.totalReturnPrice = totalReturnPrice;
		this.totalProductsPrice = totalProductsPrice;
		this.state = state;
		this.dateCreated = dateCreated;
	}
}
