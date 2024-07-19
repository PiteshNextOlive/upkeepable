export interface IStripeSubscriptionDetailViewModal{
    subscriptionId: string,
    nextPaymentDate: Date,
    status: string,
    plan_Interval: string,
    plan_IntervalCount: number,
    plan_Amount: number,
    //stripeInvoiceDetailList: IStripeInvoiceDetailViewModal[]
}

export interface IStripeInvoiceDetailViewModal{
    invoiceDate: Date,
    amount: number,
    status: string, 
    id: string
}

export interface IFilterTransactionViewModal{
    monthYear: any
}