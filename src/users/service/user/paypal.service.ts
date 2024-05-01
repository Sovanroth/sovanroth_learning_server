import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { UserService } from './user.service';

@Injectable()
export class PaypalService {
  constructor(private userService: UserService) {}

  async generateAccessToken(): Promise<string> {
    try {
      const PAYPAL_CLIENT_ID =
        'AfQs3EajJQSsLZYx85rfuBraq-IVWmB89f1T7vz2gKqWTLheWUep1RaH-ZG1IP9_zUqBnZhxBZGd0v6f';
      const PAYPAL_CLIENT_SECRET =
        'EKXOEJR3PoewglLffHXJoLvgQbYhxVYF5kh084_A2k-S2Y5B-PLG6Id2wclqJN5Jj1kfXVGLIf4vwSIL';
      if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error('MISSING_API_CREDENTIALS');
      }
      const auth = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
      ).toString('base64');
      const response = await fetch(
        'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        {
          method: 'POST',
          body: 'grant_type=client_credentials',
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      );
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Failed to generate Access Token:', error);
      throw new Error(`Failed to generate Access Token: ${error.message}`);
    }
  }

  async createOrder(
    amount: number,
    courseId: number,
    userId: number,
  ): Promise<any> {
    try {
      const accessToken = await this.generateAccessToken();
      const url = 'https://api-m.sandbox.paypal.com/v2/checkout/orders';
      const payload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount,
            },
          },
        ],
        application_context: {
          return_url: `http://localhost:3001/paid-success?CourseID=${courseId}&UserId=${userId}`,
        },
      };
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.error('Failed to create PayPal order:', error);
      throw new Error(`Failed to create PayPal order: ${error.message}`);
    }
  }

  async captureOrder(orderID: string): Promise<any> {
    try {
      const accessToken = await this.generateAccessToken();
      const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.error('Failed to capture PayPal order:', error);
      throw new Error(`Failed to capture PayPal order: ${error.message}`);
    }
  }
}
