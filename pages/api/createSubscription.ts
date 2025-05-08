// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';
import CustomerModel from '../../db/models/customer.model';
import dbConnect from '../../db/connect';
import type { Stripe } from 'stripe';
import { createPaymentData } from '../../lib/donations';
import ablyClient from '../../lib/ably';
import { current_Diffrent_campaigns } from './stripeEvent';

const CHANNEL_NAME = 'payments';
const channel = ablyClient.channels.get(CHANNEL_NAME);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { email, name, address, utm, campaign, priceId, donationType } = req.body;

      // Log request data for debugging
      console.log('Creating subscription with data:', {
        email,
        name,
        campaign,
        priceId,
        donationType
      });

      // Get campaign details - with intelligent matching or use the provided donationType directly
      let campaignTitle = '';
      let campaignKey = '';

      if (campaign && current_Diffrent_campaigns[campaign]) {
        // Use provided campaign key if it exists
        campaignKey = campaign;
        campaignTitle = current_Diffrent_campaigns[campaign].title;
        console.log(`Using provided campaign key: ${campaignKey}, title: ${campaignTitle}`);
      } else if (donationType) {
        // Use the provided donationType directly
        campaignTitle = donationType;

        // Try to find a matching campaign key for backward compatibility
        for (const [key, value] of Object.entries(current_Diffrent_campaigns)) {
          if (value.title === donationType) {
            campaignKey = key;
            break;
          }
        }

        if (!campaignKey) {
          campaignKey = 'custom'; // Fallback if no matching key found
        }

        console.log(`Using provided donationType: ${campaignTitle}, mapped to key: ${campaignKey}`);
      } else {
        // Fallback to default campaign
        campaignKey = 'JESUS_MARCH_2025_MIAMI';
        campaignTitle = current_Diffrent_campaigns.JESUS_MARCH_2025_MIAMI.title;
        console.log(`Using default campaign: ${campaignTitle}`);
      }

      // Connect to database
      await dbConnect();

      // Check if customer exists first
      let customerId;
      const foundCustomer = await CustomerModel.findOne({ email });

      if (foundCustomer) {
        customerId = foundCustomer?.stripeCustomer;
      } else {
        const customer = await stripe.customers.create({
          email,
          name,
          address,
          metadata: {
            utm_source: utm ? utm : 'unknown',
            campaign: campaignKey,
            campaign_title: campaignTitle
          }
        });

        if (!customer) {
          res.status(500).json({ error: 'Could not create customer' });
          return;
        }

        const c = new CustomerModel({
          email,
          name,
          stripeCustomer: customer.id,
        });
        customerId = customer.id;
        await c.save();
      }

      // Fetch available prices
      const prices = await stripe.prices.list({
        active: true,
        type: 'recurring',
        limit: 100,
      });

      // Find the price with the matching ID
      const selectedPrice = prices.data.find(price => price.id === priceId);

      if (!selectedPrice) {
        console.error('Invalid price ID:', priceId, 'Available prices:', prices.data.length);
        return res.status(400).json({
          error: `Invalid price ID. Please select a valid subscription tier.`
        });
      }

      try {
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          metadata: {
            utm_source: utm ? utm : 'unknown',
            campaign: campaignKey,
            campaign_title: campaignTitle
          },
          items: [
            {
              price: selectedPrice.id,
              metadata: {
                utm_source: utm ? utm : 'unknown',
                campaign: campaignKey,
                campaign_title: campaignTitle
              },
            },
          ],
          payment_behavior: 'default_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          expand: ['latest_invoice.payment_intent'],
        }) as Stripe.Subscription & {
          latest_invoice: Stripe.Invoice & {
            payment_intent: Stripe.PaymentIntent;
          };
        };

        // Note: The initial payment will be captured by the webhook via invoice.paid event
        // So we don't need to store the payment here

        // Send the invoice URL to client
        res.send({
          url: subscription.latest_invoice.hosted_invoice_url,
        });
      } catch (error: any) {
        console.error('Stripe subscription creation error:', error);
        return res.status(400).send({ error: { message: error.message } });
      }
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
