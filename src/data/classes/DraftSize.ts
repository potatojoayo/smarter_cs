import DraftService from '$data/services/DraftService';

export default class DraftSize {
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
	isSelected?: boolean;

	constructor({
		id,
		name,
		backWidth,
		backHeight,
		heapHeight,
		heapWidth,
		flagWidth,
		leftChestWidth,
		leftChestHeight,
		leftShoulderHeight,
		leftShoulderWidth,
		rightChestHeight,
		rightChestWidth,
		leftPantLowHeight,
		leftPantMiddleHeight,
		leftPantMiddleWidth,
		leftPantLowWidth,
		rightPantLowHeight,
		rightPantLowWidth,
		rightPantMiddleHeight,
		rightShoulderHeight,
		rightShoulderWidth,
		rightPantMiddleWidth,
		flagHeight
	}: {
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
	}) {
		this.id = id;
		this.name = name;
		this.backWidth = backWidth;
		this.backHeight = backHeight;
		this.leftChestWidth = leftChestWidth;
		this.leftChestHeight = leftChestHeight;
		this.rightChestWidth = rightChestWidth;
		this.rightChestHeight = rightChestHeight;
		this.leftShoulderWidth = leftShoulderWidth;
		this.leftShoulderHeight = leftShoulderHeight;
		this.rightShoulderWidth = rightShoulderWidth;
		this.rightShoulderHeight = rightShoulderHeight;
		this.heapWidth = heapWidth;
		this.heapHeight = heapHeight;
		this.leftPantMiddleWidth = leftPantMiddleWidth;
		this.leftPantMiddleHeight = leftPantMiddleHeight;
		this.rightPantMiddleWidth = rightPantMiddleWidth;
		this.rightPantMiddleHeight = rightPantMiddleHeight;
		this.leftPantLowWidth = leftPantLowWidth;
		this.leftPantLowHeight = leftPantLowHeight;
		this.rightPantLowWidth = rightPantLowWidth;
		this.rightPantLowHeight = rightPantLowHeight;
		this.flagWidth = flagWidth;
		this.flagHeight = flagHeight;
	}
	static new(name: string): DraftSize {
		return new DraftSize({
			id: -1,
			name: name,
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
		});
	}
}
