// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';
import { buffer } from 'micro';
import { createPaymentData } from '../../lib/donations';
import ablyClient from '../../lib/ably';
import type { Stripe } from 'stripe';

const CHANNEL_NAME = 'payments';

const endpointSecret = process.env.STRIPE_HOOK_SECRET as string;

const channel = ablyClient.channels.get(CHANNEL_NAME);

export const config = {
  api: {
    bodyParser: false,
  },
};

// interface ICampaign {
//   title: string;
//   goal?: number;
// }
const campaigns = {
  JESUS_MARCH_2024: {
    title: 'Jesus March 2024',
    goal: 294570,
  },
  PHOENIX_START: {
    title: 'Phoenix Donations',
    goal: 40000,
  },
  MAY_2024: {
    title: 'May 2024',
    goal: 60000,
  },
  JESUS_MARCH_2024_MINNEAPOLIS: {
    title: 'Jesus March 2024 - Minneapolis',
    goal: 15000,
  },
  JESUS_MARCH_2024_SAN_DIEGO: {
    title: 'Jesus March 2024 - San Diego',
    goal: 15000,
  },
  JESUS_MARCH_2024_PORTLAND: {
    title: 'Jesus March 2024 - Portland',
    goal: 15000,
  },
  JESUS_MARCH_2024_SEATTLE: {
    title: 'Jesus March 2024 - Seattle',
    goal: 15000,
  },
  JESUS_MARCH_2024_CHICAGO: {
    title: 'Jesus March 2024 - Chicago',
    goal: 8000,
  },
  JESUS_MARCH_2024_DC: {
    title: 'Jesus March 2024 - DC',
    goal: 15000,
  },
  JESUS_MARCH_2024_DC_MARCH: {
    title: 'Jesus March 2024 - DC March',
    goal: 35000,
  },
  JESUS_MARCH_2024_SACRAMENTO: {
    title: 'Jesus March 2024 - Sacramento',
    goal: 12000,
  },
  JESUS_MARCH_2025: {
    title: 'Jesus March 2025',
    goal: 25000,
  },
  JESUS_MARCH_2025_MIAMI: {
    title: 'Jesus March 2025 - Miami- new',
    goal: 20000,
  },
  JESUS_MARCH_2025_BOSTON: {
    title: 'Jesus March 2025 - Boston',
    goal: 20000,
  },
  JESUS_MARCH_2025_NYC: {
    title: 'Jesus March 2025 - New York City',
    goal: 20000,
  },
  JESUS_MARCH_2025_ATL: {
    title: 'Jesus March 2025 - Atlanta',
    goal: 20000,
  },
  JESUS_MARCH_2025_DENVER: {
    title: 'Jesus March 2025 - Denver',
    goal: 20000,
  },
  JESUS_MARCH_2025_HOUSTON: {
    title: 'Jesus March 2025 - Houston',
    goal: 20000,
  },
  JESUS_MARCH_2025_HUNTINGTON_BEACH: {
    title: 'Jesus March 2025 - Huntington Beach',
    goal: 20000,
  },
  JESUS_MARCH_2025_SACRAMENTO: {
    title: 'Jesus March 2025 - Sacramento',
    goal: 20000,
  },
  JESUS_MARCH_2025_WASHINGTON_DC: {
    title: 'Jesus March 2025 - Washington DC',
    goal: 20000,
  }
};

export const currentCampaign = campaigns.JESUS_MARCH_2025_MIAMI;
export const current_Diffrent_campaigns = campaigns;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    const signature = req.headers['stripe-signature'];

    if (!signature || !endpointSecret) {
      throw new Error('Missing stripe signature or endpoint secret');
    }

    event = stripe.webhooks.constructEvent(buf, signature, endpointSecret);
    console.log('Received Stripe webhook event:', event.type);
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'charge.succeeded':
        const charge = event.data.object as Stripe.Charge;
        const {
          amount,
          created,
          billing_details,
          customer: customerId,
          invoice: invoiceId,
          payment_intent: paymentIntentId
        } = charge;
        const calculatedAmount = amount / 100;

        // Initialize name and email from billing_details
        let name = billing_details?.name || undefined;
        let email = billing_details?.email || undefined;
        let donationType: string | undefined = undefined;

        // First check payment intent metadata for campaign information
        if (paymentIntentId) {
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string);
            if (paymentIntent.metadata?.campaign) {
              donationType = paymentIntent.metadata.campaign_title || paymentIntent.metadata.campaign;
            }
          } catch (error) {
            console.error('Error retrieving payment intent info:', error);
          }
        }

        // Try to get customer info from different sources if we still don't have campaign info
        if (customerId && !donationType) {
          try {
            const customer = await stripe.customers.retrieve(customerId as string) as Stripe.Customer;

            // Only use these values if not already set from billing_details
            if (!email) email = customer.email || undefined;
            if (!name) name = customer.name || undefined;

            // Get campaign from customer metadata
            if (customer.metadata?.campaign_title) {
              donationType = customer.metadata.campaign_title;
            }

            // If metadata has user info, use that as a last resort
            if (!name && customer.metadata && customer.metadata.name) {
              name = customer.metadata.name;
            }
          } catch (error) {
            console.error('Error retrieving customer info:', error);
          }
        }

        // If we have an invoice ID, this is likely a subscription payment
        // Let's skip processing here if it's a subscription, as it will be handled by invoice.paid
        if (invoiceId) {
          try {
            const invoice = await stripe.invoices.retrieve(invoiceId as string);

            // If this is a subscription invoice, skip processing as it will be handled by invoice.paid
            if (invoice.subscription) {
              console.log('Skipping charge.succeeded for subscription payment, will be handled by invoice.paid');
              break;
            }

            // If not a subscription, look for customer name in invoice metadata or customer name
            if (!name) {
              if (invoice.metadata && invoice.metadata.name) {
                name = invoice.metadata.name;
              } else if (invoice.customer_name) {
                name = invoice.customer_name;
              }
            }

            // Look for customer email
            if (!email && invoice.customer_email) {
              email = invoice.customer_email;
            }

            // Get campaign from invoice metadata
            if (!donationType && invoice.metadata?.campaign_title) {
              donationType = invoice.metadata.campaign_title;
            }
          } catch (error) {
            console.error('Error retrieving invoice info:', error);
          }
        }

        // If we still don't have a campaign, use default
        if (!donationType) {
          donationType = currentCampaign.title;
        }

        // Extract just the first name for display
        const fName = name ? name.split(' ')[0] : 'Anonymous';

        // Fix: For Stripe subscriptions created via the Subscription UI, try to extract
        // name from the email address since the name wasn't provided
        if (!name && email && email.includes('@')) {
          // Generate a name from the email prefix
          const emailPrefix = email.split('@')[0];
          // Capitalize the first letter of each part
          name = emailPrefix
            .split(/[._-]/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
        }

        // Store the payment in database
        await createPaymentData({
          amount: calculatedAmount,
          email,
          name,
          donationType,
          dateCreated: Date.now(),
          anonymous: !name || name.trim() === '',
        });

        await res.revalidate('/');
        await res.revalidate('/live');

        await channel.publish('newPayment', {
          amount: calculatedAmount,
          user: fName,
          timestamp: new Date().toISOString(),
          donationType
        });
        break;

      case 'invoice.paid':
        const paidInvoice = event.data.object as Stripe.Invoice;

        // Only process if this is a subscription invoice
        if (paidInvoice.subscription && paidInvoice.status === 'paid') {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              typeof paidInvoice.subscription === 'string' ? paidInvoice.subscription : paidInvoice.subscription.id
            );

            // Get campaign from subscription metadata (first priority)
            let donationType = subscription.metadata?.campaign_title;

            // If not found in subscription metadata and there's a payment intent, check there
            if (!donationType && paidInvoice.payment_intent) {
              const paymentIntentId = typeof paidInvoice.payment_intent === 'string'
                ? paidInvoice.payment_intent
                : paidInvoice.payment_intent.id;

              const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
              if (paymentIntent.metadata?.campaign_title) {
                donationType = paymentIntent.metadata.campaign_title;
              } else if (paymentIntent.metadata?.campaign) {
                donationType = paymentIntent.metadata.campaign;
              }
            }

            // If not found in payment intent, try customer metadata
            if (!donationType && paidInvoice.customer) {
              const customer = await stripe.customers.retrieve(paidInvoice.customer as string) as Stripe.Customer;
              if (customer.metadata?.campaign_title) {
                donationType = customer.metadata.campaign_title;
              } else if (customer.metadata?.campaign) {
                donationType = customer.metadata.campaign;
              }
            }

            // If still no campaign found, use default
            if (!donationType) {
              donationType = currentCampaign.title;
            }

            console.log('Invoice paid event: Using campaign title:', donationType);

            // Store the payment
            let name = paidInvoice.customer_name || undefined;
            let email = paidInvoice.customer_email || undefined;

            // If we don't have a name but have an email, generate a name from email
            if (!name && email && email.includes('@')) {
              // Generate a name from the email prefix
              const emailPrefix = email.split('@')[0];
              // Capitalize the first letter of each part
              name = emailPrefix
                .split(/[._-]/)
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ');
            }

            await createPaymentData({
              amount: paidInvoice.amount_paid / 100,
              email,
              name,
              donationType,
              dateCreated: new Date(paidInvoice.created * 1000),
              anonymous: !name || name.trim() === '',
            });

            await channel.publish('newPayment', {
              amount: paidInvoice.amount_paid / 100,
              user: name ? name.split(' ')[0] : 'Anonymous',
              timestamp: new Date().toISOString(),
              donationType,
              isSubscription: true
            });

            await res.revalidate('/');
            await res.revalidate('/live');
          } catch (error) {
            console.error('Error processing subscription payment:', error);
          }
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (err: any) {
    console.error('Error processing webhook:', err);
    return res.status(500).json({ error: 'Error processing webhook' });
  }
}