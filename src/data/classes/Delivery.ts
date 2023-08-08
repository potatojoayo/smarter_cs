import type DeliveryAgency from './DeliveryAgency';

export default class Delivery {
	deliveryAgency?: DeliveryAgency;
	trackingNumber?: string;
	photo?: string;

	constructor({
		deliveryAgency,
		trackingNumber,
		photo
	}: {
		deliveryAgency?: DeliveryAgency;
		trackingNumber?: string;
		photo?: string;
	}) {
		this.deliveryAgency = deliveryAgency;
		this.trackingNumber = trackingNumber;
		this.photo = photo;
	}
}
