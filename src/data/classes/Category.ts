export interface Category {
	name: string;
}

export default class ParentCategory implements Category {
	name: string;
	children: Category[];
	constructor({ name, children }: { name: string; children: Category[] }) {
		this.name = name;
		this.children = children;
	}
}
