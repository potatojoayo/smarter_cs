export default class CancelRequest {
    requestNumber: string;
    orderNumber: string;
    gymName: string;
    reason: string;
    orderAmount: number;
    serviceFee: number;
    shippingFee: number;
    totalAmount: number;
    csState: string;
    dateRequested: Date;

    constructor({
        requestNumber,
        orderNumber,
        gymName,
        reason,
        orderAmount,
        serviceFee,
        shippingFee,
        totalAmount,
        csState,
        dateRequested
    }: {
        requestNumber: string;
        orderNumber: string;
        gymName: string;
        reason: string;
        orderAmount: number;
        serviceFee: number;
        shippingFee: number;
        totalAmount: number;
        csState: string;
        dateRequested: Date;
    }) {
        this.requestNumber = requestNumber;
        this.orderNumber = orderNumber;
        this.gymName = gymName;
        this.reason = reason;
        this.orderAmount = orderAmount;
        this.serviceFee = serviceFee;
        this.shippingFee = shippingFee;
        this.totalAmount = totalAmount;
        this.csState = csState;
        this.dateRequested = dateRequested;
    }

}