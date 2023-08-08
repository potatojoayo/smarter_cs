export default class Directions {
	userRequest: string;
	draftId: number;
	draftImage: string;
	draftMemo: string;
	draftFont: string;
	draftPriceWork: number;
	draftPrinting: string;
	draftThreadColor: string;
	draftSubCategoryName: string;
	productName: string;
	productColor: string;
	productSize: string;
	productMasterThumbnail: string;
	quantity: number;
	state: string;
	orderMasterUserPhone: string;
	orderMasterUserName: string;
	orderMasterUserGymName: string;
	studentNames: string[];

	constructor({
		userRequest,
		draft,
		product,
		productMaster,
		quantity,
		state,
		orderMaster,
		studentNames
	}: {
		userRequest: string;
		draft: {
			id: number;
			image: string;
			memo: string;
			font: string;
			priceWork: number;
			printing: string;
			priceWorkLabor: number;
			threadColor: string;
			subCategory: {
				name: string;
			};
		};
		product: {
			name: string;
			color: string;
			size: string;
		};
		productMaster: {
			thumbnail: string;
		};
		quantity: number;
		state: string;
		orderMaster: {
			user: {
				phone: string;
				name: string;
				gym: {
					name: string;
				};
			};
		};
		studentNames: string[];
	}) {
		this.userRequest = userRequest;
		this.draftId = draft.id;
		this.draftImage = draft.image;
		this.draftMemo = draft.memo;
		this.draftFont = draft.font;
		this.draftPriceWork = draft.priceWork;
		this.draftPrinting = draft.printing;
		this.draftThreadColor = draft.threadColor;
		this.draftSubCategoryName = draft.subCategory.name;
		this.productName = product.name;
		this.productColor = product.color;
		this.productSize = product.size;
		this.productMasterThumbnail = productMaster.thumbnail;
		this.quantity = quantity;
		this.state = state;
		this.orderMasterUserPhone = orderMaster.user.phone;
		this.orderMasterUserName = orderMaster.user.name;
		this.orderMasterUserGymName = orderMaster.user.gym.name;
		this.studentNames = studentNames;
	}
}
