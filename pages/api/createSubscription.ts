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

      // Get campaign details - with intelligent matching or use the provided donationType directly
      let campaignTitle = '';
      let campaignKey = '';

      // First try: Use the campaign key directly if exists in current_Diffrent_campaigns
      if (campaign && current_Diffrent_campaigns[campaign]) {
        campaignKey = campaign;
        campaignTitle = current_Diffrent_campaigns[campaign].title;
      }
      // Second try: If donationType is provided, use it directly
      else if (donationType) {
        campaignTitle = donationType;
        campaignKey = 'CUSTOM_CAMPAIGN';
      }
      // Third try: Find closest match by title
      else if (campaign) {
        // Try to find the closest campaign by fuzzy matching
        const allCampaigns = Object.entries(current_Diffrent_campaigns);

        // First check if there's a campaign whose title contains our campaign string
        for (const [key, value] of allCampaigns) {
          if (value.title.toLowerCase().includes((campaign || '').toLowerCase().replace(/_/g, ' ').replace(/-/g, ' '))) {
            campaignKey = key;
            campaignTitle = value.title;
            break;
          }
        }

        // If still not found, use the campaign string as a title
        if (!campaignTitle) {
          campaignTitle = campaign.replace(/_/g, ' ').replace(/-/g, ' '); // Convert to readable format
          campaignKey = 'CUSTOM_CAMPAIGN';
        }
      }
      // Default: Use Miami campaign as fallback
      else {
        campaignKey = 'JESUS_MARCH_2025_MIAMI';
        campaignTitle = current_Diffrent_campaigns[campaignKey].title;
      }

     

      await dbConnect();

      // Find or create customer
      const foundCustomer = await CustomerModel.findOne({ email });

      let customerId: any = null;
      if (foundCustomer) {
        customerId = foundCustomer?.stripeCustomer;
      } else {
        const customer = await stripe.customers.create({
          email,
          name,
          address,
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


        // Store the payment directly like one-time payments
        const amount = (selectedPrice.unit_amount || 0) / 100;

        // Store the payment in the database
        await createPaymentData({
          amount,
          dateCreated: Date.now(),
          donationType: campaignTitle,
          name: name || undefined,
          email: email || undefined,
          referenceId: subscription.latest_invoice.id,
        });

        // Publish payment to channel
        const firstName = name ? name.split(' ')[0] : 'Anonymous';
        await channel.publish('newPayment', {
          amount,
          user: firstName,
          timestamp: new Date().toISOString(),
          donationType: campaignTitle,
          isSubscription: true
        });

        // Send the invoice URL to client
        res.send({
          url: subscription.latest_invoice.hosted_invoice_url,
        });
      } catch (error: any) {
        console.error('Stripe subscription creation error:', error);
        return res.status(400).send({ error: { message: error.message } });
      }
    } catch (error: any) {
      console.error('API handler error:', error);
      return res.status(500).send({ error: { message: error.message || 'Unknown error occurred' } });
    }
  } else {
    throw new Error(`${req.method} is not supported for this route`);
  }
}
