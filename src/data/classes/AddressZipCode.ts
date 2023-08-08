export class ParentAddressZipCode implements AddressZipCodeType {
	id: number;
	siDo: string;
	siGunGu?: string;
	children: AddressZipCode[];

	constructor({
		id,
		siDo,
		siGunGu,
		children
	}: AddressZipCodeType & {
		children: AddressZipCodeType[];
	}) {
		this.id = id;
		this.siDo = siDo;
		this.siGunGu = siGunGu;
		this.children = children.map((c) => new AddressZipCode(c));
	}
}

export class AddressZipCode implements AddressZipCodeType {
	id: number;
	siDo: string;
	siGunGu?: string;
	constructor({ id, siDo, siGunGu }: AddressZipCodeType) {
		this.id = id;
		this.siDo = siDo;
		this.siGunGu = siGunGu;
	}
}

export interface AddressZipCodeType {
	id: number;
	siDo: string;
	siGunGu?: string;
}
