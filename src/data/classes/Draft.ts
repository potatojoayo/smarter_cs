import DraftService from '$data/services/DraftService';
import DraftSize from './DraftSize';
import NewDraftService from '../services/NewDraftService';

export default class Draft {
	id: number;
	categoryName?: string;
	subCategoryName?: string;
	priceWork: number;
	priceWorkLabor: number;
	printing?: string;
	font?: string;
	threadColor?: string;
	dateCreated?: Date;
	memo?: string;
	image?: string;

	sizes: DraftSize[];

	isSelected?: boolean;

	constructor({
		id,
		categoryName,
		subCategoryName,
		font,
		memo,
		priceWorkLabor,
		priceWork,
		printing,
		threadColor,
		dateCreated,
		image,
		sizes
	}: {
		id: number;
		categoryName?: string;
		subCategoryName?: string;
		priceWork: number;
		priceWorkLabor: number;
		printing?: string;
		font?: string;
		threadColor?: string;
		dateCreated?: Date;
		memo?: string;
		image?: string;
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
	}) {
		this.id = id;
		this.categoryName = categoryName;
		this.subCategoryName = subCategoryName;
		this.font = font;
		this.memo = memo;
		this.priceWorkLabor = priceWorkLabor;
		this.priceWork = priceWork;
		this.printing = printing;
		this.threadColor = threadColor;
		this.dateCreated = dateCreated;
		this.image = image;
		this.sizes = sizes?.map((d) => new DraftSize(d));
	}

	static new(): Draft {
		const sizesArray = [];
		for (let i = 0; i < 6; i++) {
			sizesArray.push(
				new DraftSize({
					id: -1,
					name: `사이즈 ${i + 1}`,
					backWidth: 0,
					backHeight: 0,
					heapHeight: 0,
					heapWidth: 0,
					flagWidth: 0,
					leftChestWidth: 0,
					leftChestHeight: 0,
					leftShoulderHeight: 0,
					leftShoulderWidth: 0,
					rightChestHeight: 0,
					rightChestWidth: 0,
					leftPantLowHeight: 0,
					leftPantMiddleHeight: 0,
					leftPantMiddleWidth: 0,
					leftPantLowWidth: 0,
					rightPantLowHeight: 0,
					rightPantLowWidth: 0,
					rightPantMiddleHeight: 0,
					rightShoulderHeight: 0,
					rightShoulderWidth: 0,
					rightPantMiddleWidth: 0,
					flagHeight: 0
				})
			);
		}
		return new Draft({
			id: -1,
			priceWork: 0,
			priceWorkLabor: 0,
			sizes: sizesArray
		});
	}
	static async fromId(id: number): Promise<Draft> {
		return await DraftService.getDraft({ id });
	}
	async save({ file, userId }: { file?: File; userId?: number }) {
		let result;
		if (this.id > 0) {
			result = await NewDraftService.updateNewDraft({
				draftId: this.id,
				file,
				draft: {
					priceWork: this.priceWork,
					printing: this.printing,
					threadColor: this.threadColor,
					priceWorkLabor: this.priceWorkLabor,
					font: this.font,
					memo: this.memo
				},
				sizes: this.sizes.map((d) => {
					return {
						id: d.id,
						name: d.name,
						backWidth: d.backWidth,
						backHeight: d.backHeight,
						leftChestWidth: d.leftChestWidth,
						leftChestHeight: d.leftChestHeight,
						rightChestWidth: d.rightChestWidth,
						rightChestHeight: d.rightChestHeight,
						leftShoulderWidth: d.leftShoulderWidth,
						leftShoulderHeight: d.leftShoulderHeight,
						rightShoulderWidth: d.rightShoulderWidth,
						rightShoulderHeight: d.rightShoulderHeight,
						heapWidth: d.heapWidth,
						heapHeight: d.heapHeight,
						leftPantMiddleWidth: d.leftPantMiddleWidth,
						leftPantMiddleHeight: d.leftPantMiddleHeight,
						rightPantMiddleWidth: d.rightPantMiddleWidth,
						rightPantMiddleHeight: d.rightPantMiddleHeight,
						leftPantLowWidth: d.leftPantLowWidth,
						leftPantLowHeight: d.leftPantLowHeight,
						rightPantLowWidth: d.rightPantLowWidth,
						rightPantLowHeight: d.rightPantLowHeight,
						flagWidth: d.flagWidth,
						flagHeight: d.flagHeight
					};
				})
			});
			return {
				success: result
			};
		} else {
			result = await NewDraftService.createNewDraft({
				userId: userId!,
				file: file!,
				subcategoryName: this.subCategoryName!,
				draft: {
					priceWork: this.priceWork,
					priceWorkLabor: this.priceWorkLabor,
					printing: this.printing,
					font: this.font,
					threadColor: this.threadColor,
					memo: this.memo
				},
				sizes: this.sizes.map((d) => {
					return {
						name: d.name,
						backWidth: d.backWidth,
						backHeight: d.backHeight,
						leftChestWidth: d.leftChestWidth,
						leftChestHeight: d.leftChestHeight,
						rightChestWidth: d.rightChestWidth,
						rightChestHeight: d.rightChestHeight,
						leftShoulderWidth: d.leftShoulderWidth,
						leftShoulderHeight: d.leftShoulderHeight,
						rightShoulderWidth: d.rightShoulderWidth,
						rightShoulderHeight: d.rightShoulderHeight,
						heapWidth: d.heapWidth,
						heapHeight: d.heapHeight,
						leftPantMiddleWidth: d.leftPantMiddleWidth,
						leftPantMiddleHeight: d.leftPantMiddleHeight,
						rightPantMiddleWidth: d.rightPantMiddleWidth,
						rightPantMiddleHeight: d.rightPantMiddleHeight,
						leftPantLowWidth: d.leftPantLowWidth,
						leftPantLowHeight: d.leftPantLowHeight,
						rightPantLowWidth: d.rightPantLowWidth,
						rightPantLowHeight: d.rightPantLowHeight,
						flagWidth: d.flagWidth,
						flagHeight: d.flagHeight
					};
				})
			});
		}
		return {
			success: result.success
			// draft: result.draft
		};
	}
}
