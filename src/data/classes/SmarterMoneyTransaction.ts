export default class SmarterMoneyTransaction {
	dateCreated: Date;
	transactionType: string;
	description: string;
	amount: number;
	orderNumber?: string;

	constructor({
		dateCreated,
		transactionType,
		description,
		amount,
		orderNumber
	}: {
		dateCreated: Date;
		transactionType: string;
		description: string;
		amount: number;
		orderNumber?: string;
	}) {
		this.description = description;
		this.dateCreated = dateCreated;
		this.transactionType = transactionType;
		this.amount = amount;
		this.orderNumber = orderNumber;
	}
}
