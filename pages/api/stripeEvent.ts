// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';
import { buffer } from 'micro';
import { createPaymentData } from '../../lib/donations';
import ablyClient from '../../lib/ably';
import type { Stripe } from 'stripe';
import PaymentModel from '../../db/models/payment.model';
import dbConnect from '../../db/connect';
import { processSubscriptionChange } from '../../lib/subscription';

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
        const { amount, created, billing_details } = charge;
        const calculatedAmount = amount / 100;
        const name = billing_details?.name || undefined;
        const email = billing_details?.email || undefined;
        const fName = name ? name.split(' ')[0] : 'Anonymous';

        await createPaymentData({
          amount: calculatedAmount,
          dateCreated: created,
          donationType: currentCampaign.title,
          name,
          email,
        });

        await res.revalidate('/');
        await res.revalidate('/live');

        await channel.publish('newPayment', {
          amount: calculatedAmount,
          user: fName,
          timestamp: new Date().toISOString(),
          donationType: currentCampaign.title
        });
        break;

      case 'customer.subscription.created':
        const createdSubscription = event.data.object as Stripe.Subscription;
        // console.log('Processing subscription.created event:', {
        //   id: createdSubscription.id,
        //   status: createdSubscription.status,
        //   customer: createdSubscription.customer
        // });

        // Track the subscription in our database
        await processSubscriptionChange(createdSubscription);

        // The rest of the function can remain the same
        // as it processes the checkout session
        const session = event.data.object as Stripe.Checkout.Session;
        // console.log('Processing checkout.session.completed event:', {
        //   id: session.id,
        //   customerId: session.customer,
        //   amount_total: session.amount_total,
        //   payment_status: session.payment_status,
        //   subscription: session.subscription
        // });

        // Only process completed subscription checkouts
        if (session.subscription && session.payment_status === 'paid') {
          try {
            const subscriptionId = session.subscription as string;
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const checkoutAmount = (session.amount_total || 0) / 100;

            // console.log('Retrieved subscription details:', {
            //   subscriptionId,
            //   status: subscription.status,
            //   metadata: subscription.metadata
            // });

            // Get customer details
            const customer = await stripe.customers.retrieve(session.customer as string) as Stripe.Customer;
            // console.log('Retrieved customer details:', {
            //   customerId: customer.id,
            //   email: customer.email,
            //   name: customer.name
            // });

            // Get donation campaign information
            let donationType = subscription.metadata.campaign_title;

            // If not found, try to get from campaign key (backward compatibility)
            if (!donationType && subscription.metadata.campaign) {
              const campaignKey = subscription.metadata.campaign;
              const campaignData = current_Diffrent_campaigns[campaignKey];
              donationType = campaignData ? campaignData.title : 'Unknown Campaign';
            }

            // Fallback to default if we still don't have a campaign
            if (!donationType) {
              donationType = current_Diffrent_campaigns.JESUS_MARCH_2025_MIAMI.title;
            }

            // console.log('Using donation type for session payment:', donationType);

            // Connect to database
            await dbConnect();
            // console.log('Database connected');

            // Always store the payment - no need to check for duplicates
            // console.log('Saving checkout session payment:', {
            //   amount: checkoutAmount,
            //   donationType,
            //   customer: customer.email,
            //   referenceId: session.id
            // });

            // Store the payment with session ID as reference
            try {
              const paymentData = {
                amount: checkoutAmount,
                dateCreated: session.created,
                donationType,
                name: customer.name || undefined,
                email: customer.email || undefined,
                referenceId: session.id,
              };

              const savedPayment = await createPaymentData(paymentData);
              // console.log('Payment successfully created in database:', savedPayment ? savedPayment._id : 'unknown');

              const customerName = customer.name || 'Anonymous';
              const firstName = customerName.split(' ')[0];

              await channel.publish('newPayment', {
                amount: checkoutAmount,
                user: firstName,
                timestamp: new Date().toISOString(),
                donationType,
                isSubscription: true
              });
            } catch (createError) {
              console.error('Error creating payment in database:', createError);
            }

            // console.log('Checkout payment successfully stored in database');

            await res.revalidate('/');
            await res.revalidate('/live');
          } catch (error) {
            console.error('Error processing checkout session payment:', error);
          }
        } else {
          console.log('Skipping non-paid or non-subscription checkout session');
        }
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        // console.log('Processing subscription.updated event:', {
        //   id: updatedSubscription.id,
        //   status: updatedSubscription.status,
        //   current_period_start: updatedSubscription.current_period_start,
        //   current_period_end: updatedSubscription.current_period_end
        // });

        // Update subscription status in our database
        await processSubscriptionChange(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        // console.log('Processing subscription.deleted event:', {
        //   id: deletedSubscription.id,
        //   status: deletedSubscription.status,
        //   canceled_at: deletedSubscription.canceled_at
        // });

        // Update subscription status in our database
        await processSubscriptionChange(deletedSubscription);
        break;

      case 'invoice.created':
        const createdInvoice = event.data.object as Stripe.Invoice;
        // console.log('Processing invoice.created event:', {
        //   id: createdInvoice.id,
        //   subscription: createdInvoice.subscription,
        //   amount_due: createdInvoice.amount_due,
        //   customer: createdInvoice.customer,
        //   status: createdInvoice.status
        // });

        // If we want to store invoice information in the database when it's created,
        // even before it's paid, we can do that here
        if (createdInvoice.subscription) {
          try {
            // console.log('Retrieving subscription details for invoice.created...');
            const subscriptionId = typeof createdInvoice.subscription === 'string'
              ? createdInvoice.subscription
              : createdInvoice.subscription.id;

            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const invoiceAmount = createdInvoice.amount_due / 100;
            const customer = await stripe.customers.retrieve(createdInvoice.customer as string) as Stripe.Customer;

            // Get donation campaign information from subscription metadata
            let donationType = subscription.metadata.campaign_title;

            // If not found, try to get from campaign key (backward compatibility)
            if (!donationType && subscription.metadata.campaign) {
              const campaignKey = subscription.metadata.campaign;
              const campaignData = current_Diffrent_campaigns[campaignKey];
              donationType = campaignData ? campaignData.title : 'Unknown Campaign';
            }

            // Fallback to default if we still don't have a campaign
            if (!donationType) {
              donationType = current_Diffrent_campaigns.JESUS_MARCH_2025_MIAMI.title;
            }

            // Connect to database
            await dbConnect();

            // Store the invoice creation with reference ID
            const paymentData = {
              amount: invoiceAmount,
              dateCreated: createdInvoice.created,
              donationType: donationType,
              name: customer.name || undefined,
              email: customer.email || undefined,
              referenceId: createdInvoice.id,
            };

            // Store in database only if the invoice is not already paid
            // This ensures we don't create duplicate entries when an invoice is immediately paid
            if (createdInvoice.status !== 'paid') {
              // console.log('Saving invoice creation record:', paymentData);
              try {
                const savedPayment = await createPaymentData(paymentData);
                // console.log('Invoice creation record stored in database:', savedPayment?._id);
              } catch (saveError) {
                console.error('Error saving invoice creation record:', saveError);
              }
            } else {
              console.log('Skipping invoice creation record since invoice is already paid');
            }
          } catch (error) {
            console.error('Error processing invoice creation:', error);
          }
        }
        break;

      case 'invoice.paid':
      case 'invoice.payment_succeeded':
        const paidInvoice = event.data.object as Stripe.Invoice;
        // console.log('Processing invoice payment event:', {
        //   id: paidInvoice.id,
        //   subscription: paidInvoice.subscription,
        //   amount_paid: paidInvoice.amount_paid,
        //   customer: paidInvoice.customer,
        //   status: paidInvoice.status
        // });

        // Check if this is a subscription invoice that we should process
        if (paidInvoice.subscription && paidInvoice.status === 'paid') {
          try {
            // console.log('Retrieving subscription details...');
            const subscriptionId = typeof paidInvoice.subscription === 'string'
              ? paidInvoice.subscription
              : paidInvoice.subscription.id;

            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const subscriptionAmount = paidInvoice.amount_paid / 100;
            const customer = await stripe.customers.retrieve(paidInvoice.customer as string) as Stripe.Customer;

            // console.log('Retrieved subscription details:', {
            //   subscriptionId,
            //   status: subscription.status,
            //   currentPeriodStart: subscription.current_period_start,
            //   currentPeriodEnd: subscription.current_period_end
            // });

            // Get campaign from subscription metadata
            let donationType = subscription.metadata.campaign_title;

            // If not found, try to get from campaign key (backward compatibility)
            if (!donationType && subscription.metadata.campaign) {
              const campaignKey = subscription.metadata.campaign;
              const campaignData = current_Diffrent_campaigns[campaignKey];
              donationType = campaignData ? campaignData.title : 'Unknown Campaign';
            }

            // Fallback to default if we still don't have a campaign
            if (!donationType) {
              donationType = current_Diffrent_campaigns.JESUS_MARCH_2025_MIAMI.title;
            }

            // Connect to database
            await dbConnect();

            // Check if we already have a payment for this invoice
            const existingPayment = await PaymentModel.findOne({
              referenceId: paidInvoice.id
            });

            if (existingPayment) {
              // console.log(`Payment for invoice ${paidInvoice.id} already exists, updating status`);
            } else {
              // Create a new payment record for the paid invoice
              const paymentData = {
                amount: subscriptionAmount,
                dateCreated: paidInvoice.created,
                donationType: donationType,
                name: customer.name || undefined,
                email: customer.email || undefined,
                referenceId: paidInvoice.id,
              };

              // console.log('Saving new payment for paid invoice:', paymentData);

              // Store the payment with reference ID
              try {
                const savedPayment = await createPaymentData(paymentData);
                // console.log('Subscription payment successfully stored in database:', savedPayment?._id);

                const customerName = customer.name || 'Anonymous';
                const firstName = customerName.split(' ')[0];

                await channel.publish('newPayment', {
                  amount: subscriptionAmount,
                  user: firstName,
                  timestamp: new Date().toISOString(),
                  donationType: donationType,
                  isSubscription: true
                });

                // console.log('Payment event published to channel');
              } catch (saveError) {
                console.error('Error saving invoice payment to database:', saveError);
              }
            }

            await res.revalidate('/');
            await res.revalidate('/live');
          } catch (error) {
            console.error('Error processing subscription payment:', error);
          }
        } else {
          console.log('Skipping non-subscription or non-paid invoice');
        }
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Processing payment_intent.succeeded event:', {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          invoice: paymentIntent.invoice,
          metadata: paymentIntent.metadata,
          customerId: paymentIntent.customer
        });

        // Only process payment intents that are not already associated with invoices
        // (invoices are handled by the invoice.paid handler)
        if (!paymentIntent.invoice) {
          try {
            // Check if payment intent has already been processed
            await dbConnect();
            // console.log('Database connected for payment intent');

            const existingPIPayment = await PaymentModel.findOne({
              referenceId: paymentIntent.id
            });

            // console.log('Existing payment intent check result:', existingPIPayment ? 'Found' : 'Not found');

            if (existingPIPayment) {
              console.log(`Payment intent ${paymentIntent.id} already processed. Skipping.`);
            } else {
              // Get customer info if available
              let customerName;
              let customerEmail;

              if (paymentIntent.customer) {
                const customer = await stripe.customers.retrieve(paymentIntent.customer as string) as Stripe.Customer;
                customerName = customer.name;
                customerEmail = customer.email;
                // console.log('Retrieved customer details:', {
                //   customerId: customer.id,
                //   email: customerEmail,
                //   name: customerName
                // });
              }

              // Determine campaign/donation type from metadata
              let donationType = currentCampaign.title;
              if (paymentIntent.metadata.campaign && paymentIntent.metadata.campaign !== 'unknown') {
                const campaignKey = paymentIntent.metadata.campaign;
                const campaignData = current_Diffrent_campaigns[campaignKey];
                if (campaignData) {
                  donationType = campaignData.title;
                }
              }

              // console.log('Using donation type for payment intent:', donationType);

              const paymentData = {
                amount: paymentIntent.amount / 100,
                dateCreated: paymentIntent.created,
                donationType,
                name: customerName || undefined,
                email: customerEmail || undefined,
                referenceId: paymentIntent.id
              };

              // console.log('Saving payment intent payment:', paymentData);

              // Store the payment
              try {
                const savedPayment = await createPaymentData(paymentData);
                // console.log('Payment intent payment successfully stored in database:', savedPayment ? savedPayment._id : 'unknown');

                const displayName = customerName || 'Anonymous';
                const firstName = displayName.split(' ')[0];

                await channel.publish('newPayment', {
                  amount: paymentIntent.amount / 100,
                  user: firstName,
                  timestamp: new Date().toISOString(),
                  donationType
                });

                // console.log('Payment event published to channel');

                await res.revalidate('/');
                await res.revalidate('/live');
                console.log('Pages revalidated');
              } catch (saveError) {
                console.error('Error saving payment intent to database:', saveError);
              }
            }
          } catch (error) {
            console.error('Error processing payment intent payment:', error);
          }
        } else {
          console.log('Skipping payment intent with invoice (handled by invoice.paid event)');
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