// paypal.service.ts

import { Injectable } from '@nestjs/common';
import * as paypal from 'paypal-rest-sdk';

@Injectable()
export class PaypalService {
  constructor() {
    paypal.configure({
      mode: 'sandbox', // Change to 'live' for production
      client_id:
        'ARrHT9IrVo9eqPiyx9cZMQcCf9T-n_y57Pe-xPbux8tbwBITzempMtQgTA4CGHifplZzvkMVTSJObOMn',
      client_secret:
        'EDoKmfoyesfKr1COUU31MM4grGook7zJrCW5bsb54yv8trrl4mhUFOiZUm5V4Yay_rnK5f_Cqhepaz2s',
    });
  }

  async createOrder(amount: number): Promise<any> {
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: 'https://sukulpf.sovanrothnath.site/',
        cancel_url: 'https://sukulpf.sovanrothnath.site/',
      },
      transactions: [
        {
          amount: {
            total: amount,
            currency: 'USD',
          },
        },
      ],
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });
  }
  catch(error) {
    throw new Error(`Failed to create PayPal order: ${error.message}`);
  }
}
