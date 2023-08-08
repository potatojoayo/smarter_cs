export enum InquiryType {
	general,
	order,
	delivery,
	draft,
	smarterMoney,
	address
}

export function getInquiryType({ category }: { category: string }): InquiryType {
	switch (category) {
		case '일반문의':
			return InquiryType.general;
		case '로고시안':
			return InquiryType.draft;
		case '스마터머니':
			return InquiryType.smarterMoney;
		case '배송지':
			return InquiryType.address;
		default:
			return InquiryType.order;
	}
}
