export default class DeliveryAgency {
	name: string;
	id: number;

	constructor({ name, id }: { name: string; id: number }) {
		this.name = name;
		this.id = id;
	}
}
