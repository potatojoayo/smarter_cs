import type { ButtonColor } from '$data/enums/ButtonColor';

export default class ModalButton {
	color: ButtonColor;
	onClick: () => void;
	title: string;

	constructor({
		color,
		onClick,
		title
	}: {
		color: ButtonColor;
		onClick: () => void;
		title: string;
	}) {
		this.color = color;
		this.onClick = onClick;
		this.title = title;
	}
}
