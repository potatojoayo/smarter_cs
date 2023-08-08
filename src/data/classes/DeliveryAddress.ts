import CustomerService from '$data/services/CustomerService';
import { page } from '$app/stores';

export default class DeliveryAddress {
	id: number;
	name: string;
	receiver: string;
	address: string;
	detailAddress: string;
	isDefault: boolean;
	phone: string;
	zipCode: string;
	deliveryMemo?: string;

	constructor({
		id,
		name,
		receiver,
		address,
		detailAddress,
		isDefault,
		deliveryMemo,
		zipCode,
		phone
	}: {
		id: number;
		name: string;
		receiver: string;
		address: string;
		detailAddress: string;
		isDefault: boolean;
		phone: string;
		zipCode: string;
		deliveryMemo?: string;
	}) {
		this.id = id;
		this.name = name;
		this.receiver = receiver;
		this.address = address;
		this.deliveryMemo = deliveryMemo;
		this.detailAddress = detailAddress;
		this.isDefault = isDefault;
		this.zipCode = zipCode;
		this.phone = phone;
	}

	async save() {
		let currentPage;
		page.subscribe((p) => {
			currentPage = p.url.searchParams.get('deliveryAddressPage');
		});
		if (currentPage) {
			currentPage = +currentPage;
		} else {
			currentPage = 1;
		}
		const result = await CustomerService.updateAddress({ page: currentPage, ...this });
		const { success, addresses } = result;
		return { success, addresses };
	}

	static async create(variables: {
		gymId: number;
		name: string;
		receiver: string;
		address: string;
		detailAddress: string;
		isDefault: boolean;
		phone: string;
		zipCode: string;
		deliveryMemo?: string;
	}) {
		const result = await CustomerService.createAddress(variables);
		const { success } = result;
		return success;
	}

	async delete() {
		return await CustomerService.deleteAddress({ addressId: this.id });
	}
}
