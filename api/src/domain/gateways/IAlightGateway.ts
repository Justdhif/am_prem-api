export interface ActivateSubscriptionResult {
  ok: boolean;
  orderId?: string;
  responseData?: any;
  why?: string;
}

export interface IAlightGateway {
  activateProSubscription(idToken: string): Promise<ActivateSubscriptionResult>;
}
