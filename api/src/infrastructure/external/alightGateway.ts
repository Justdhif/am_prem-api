import crypto from 'crypto';
import axios, { AxiosError } from 'axios';
import { IAlightGateway, ActivateSubscriptionResult } from '../../domain/gateways/IAlightGateway.js';
import { config } from '../config/index.js';
import { withSpoofedIpHeaders } from './ipSpoofer.js';

export class AlightGateway implements IAlightGateway {
  private readonly defaultH2Headers: Record<string, string> = {
    'content-type': 'application/json; charset=utf-8',
    'user-agent': config.alightMotion.okhttpUserAgent,
    'accept-encoding': 'gzip',
  };

  private extractErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError;
      const data = axiosErr.response?.data;
      if (data) {
        return typeof data === 'object' ? JSON.stringify(data) : String(data);
      }
      return axiosErr.message || 'Unknown network error';
    }
    if (err instanceof Error) {
      return err.message;
    }
    return String(err);
  }

  public async activateProSubscription(idToken: string): Promise<ActivateSubscriptionResult> {
    const orderId = 'neo-' + crypto.randomBytes(6).toString('hex');
    const body = {
      data: {
        productId: config.alightMotion.productId,
        token: config.alightMotion.purchaseToken,
        skuType: 'subs',
        orderId: orderId,
      },
    };

    const headers = withSpoofedIpHeaders({
      ...this.defaultH2Headers,
      authorization: 'Bearer ' + idToken,
      'firebase-instance-id-token': config.firebase.instanceIdToken,
    });

    try {
      const response = await axios.post(config.alightMotion.verifyUrl, body, {
        headers,
        timeout: 20000,
      });
      return { ok: true, orderId, responseData: response.data };
    } catch (e) {
      return { ok: false, why: this.extractErrorMessage(e) };
    }
  }
}
