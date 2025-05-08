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
        let donationType = currentCampaign.title; // Default campaign

        // Try to get customer info from different sources
        if (customerId) {
          try {
            const customer = await stripe.customers.retrieve(customerId as string) as Stripe.Customer;

            // Only use these values if not already set from billing_details
            if (!email) email = customer.email || undefined;
            if (!name) name = customer.name || undefined;

            // If metadata has user info, use that as a last resort
            if (!name && customer.metadata && customer.metadata.name) {
              name = customer.metadata.name;
            }

          } catch (error) {
            console.error('Error retrieving customer info:', error);
          }
        }

        // If we have an invoice ID, try to get more info from there
        if (invoiceId && (!name || !email)) {
          try {
            const invoice = await stripe.invoices.retrieve(invoiceId as string);

            // Look for customer name in invoice metadata or customer name
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

          } catch (error) {
            console.error('Error retrieving invoice info:', error);
          }
        }

        // If we have a payment intent ID, try to get more info from there
        if (paymentIntentId) {
          try {
            const piId = typeof paymentIntentId === 'string'
              ? paymentIntentId
              : paymentIntentId.id;

            const paymentIntent = await stripe.paymentIntents.retrieve(piId);

            // Check payment intent metadata
            if (!name && paymentIntent.metadata && paymentIntent.metadata.name) {
              name = paymentIntent.metadata.name;
            }

            // Check shipping info
            if (!name && paymentIntent.shipping && paymentIntent.shipping.name) {
              name = paymentIntent.shipping.name;
            }

            // Get the campaign from metadata
            if (paymentIntent.metadata && paymentIntent.metadata.campaign) {
              const campaignValue = paymentIntent.metadata.campaign;
              // If the campaign value is a direct match with any campaign title, use it
              const matchingCampaign = Object.values(campaigns).find(c => c.title === campaignValue);
              if (matchingCampaign) {
                donationType = matchingCampaign.title;
              }
            }

          } catch (error) {
            console.error('Error retrieving payment intent info:', error);
          }
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

        await createPaymentData({
          amount: calculatedAmount,
          email,
          name,
          donationType: donationType,
          dateCreated: Date.now(),
          anonymous: !name || name.trim() === '',
        });

        await res.revalidate('/');
        await res.revalidate('/live');

        await channel.publish('newPayment', {
          amount: calculatedAmount,
          user: fName,
          timestamp: new Date().toISOString(),
          donationType: donationType
        });
        break;

      // case 'payment_intent.created':
      //   const createdPaymentIntent = event.data.object as Stripe.PaymentIntent;
      //   console.log('Processing payment_intent.created event:', {
      //     id: createdPaymentIntent.id,
      //     amount: createdPaymentIntent.amount,
      //     customer: createdPaymentIntent.customer,
      //     metadata: createdPaymentIntent.metadata
      //   });

      //   // We don't need to store anything in the database at this point,
      //   // as this is just the initial creation of the payment intent.
      //   // The payment_intent.succeeded event will handle actually storing the payment.
      //   break;

      // case 'customer.subscription.created':
      //   const createdSubscription = event.data.object as Stripe.Subscription;
      //   console.log('Processing subscription.created event:', {
      //     id: createdSubscription.id,
      //     status: createdSubscription.status,
      //     customer: createdSubscription.customer
      //   });

      //   // Track the subscription in our database - this only tracks the subscription status,
      //   // not the payment which will be handled by invoice.paid events
      //   await processSubscriptionChange(createdSubscription);

      //   // NOTE: We don't need to store a payment record here, as the payment will be 
      //   // handled by the invoice.paid or invoice.payment_succeeded events

      //   // Uncomment the following if you need to extract subscription metadata or details,
      //   // but DO NOT create a payment record at this point
      //   /*
      //   if (createdSubscription && createdSubscription.customer) {
      //     try {
      //       const customer = await stripe.customers.retrieve(createdSubscription.customer as string) as Stripe.Customer;
      //       console.log('Retrieved customer details for subscription.created:', {
      //         customerId: customer.id,
      //         email: customer.email,
      //         name: customer.name
      //       });
      //     } catch (error) {
      //       console.error('Error retrieving customer details:', error);
      //     }
      //   }
      //   */

      //   break;

      // case 'customer.subscription.updated':
      //   const updatedSubscription = event.data.object as Stripe.Subscription;
      //   // console.log('Processing subscription.updated event:', {
      //   //   id: updatedSubscription.id,
      //   //   status: updatedSubscription.status,
      //   //   current_period_start: updatedSubscription.current_period_start,
      //   //   current_period_end: updatedSubscription.current_period_end
      //   // });

      //   // Update subscription status in our database
      //   await processSubscriptionChange(updatedSubscription);
      //   break;

      // case 'customer.subscription.deleted':
      //   const deletedSubscription = event.data.object as Stripe.Subscription;
      //   // console.log('Processing subscription.deleted event:', {
      //   //   id: deletedSubscription.id,
      //   //   status: deletedSubscription.status,
      //   //   canceled_at: deletedSubscription.canceled_at
      //   // });

      //   // Update subscription status in our database
      //   await processSubscriptionChange(deletedSubscription);
      //   break;

      // case 'invoice.created':
      //   const createdInvoice = event.data.object as Stripe.Invoice;
      //   // console.log('Processing invoice.created event:', {
      //   //   id: createdInvoice.id,
      //   //   subscription: createdInvoice.subscription,
      //   //   amount_due: createdInvoice.amount_due,
      //   //   customer: createdInvoice.customer,
      //   //   status: createdInvoice.status
      //   // });

      //   // If we want to store invoice information in the database when it's created,
      //   // even before it's paid, we can do that here
      //   if (createdInvoice.subscription) {
      //     try {
      //       // console.log('Retrieving subscription details for invoice.created...');
      //       const subscriptionId = typeof createdInvoice.subscription === 'string'
      //         ? createdInvoice.subscription
      //         : createdInvoice.subscription.id;

      //       const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      //       const invoiceAmount = createdInvoice.amount_due / 100;
      //       const customer = await stripe.customers.retrieve(createdInvoice.customer as string) as Stripe.Customer;

      //       // Get donation campaign information from subscription metadata
      //       let donationType = subscription.metadata.campaign_title;

      //       // If not found, try to get from campaign key (backward compatibility)
      //       if (!donationType && subscription.metadata.campaign) {
      //         const campaignKey = subscription.metadata.campaign;
      //         const campaignData = current_Diffrent_campaigns[campaignKey];
      //         donationType = campaignData ? campaignData.title : 'Unknown Campaign';
      //       }

      //       // Fallback to default if we still don't have a campaign
      //       if (!donationType) {
      //         donationType = current_Diffrent_campaigns.JESUS_MARCH_2025_MIAMI.title;
      //       }

      //       // Connect to database
      //       await dbConnect();

      //       // Store the invoice creation with reference ID
      //       const paymentData = {
      //         amount: invoiceAmount,
      //         dateCreated: createdInvoice.created,
      //         donationType: donationType,
      //         name: customer.name || undefined,
      //         email: customer.email || undefined,
      //         referenceId: createdInvoice.id,
      //       };

      //       // Store in database only if the invoice is not already paid
      //       // This ensures we don't create duplicate entries when an invoice is immediately paid
      //       if (createdInvoice.status !== 'paid') {
      //         // console.log('Saving invoice creation record:', paymentData);
      //         try {
      //           const savedPayment = await createPaymentData(paymentData);
      //           // console.log('Invoice creation record stored in database:', savedPayment?._id);
      //         } catch (saveError) {
      //           console.error('Error saving invoice creation record:', saveError);
      //         }
      //       } else {
      //         console.log('Skipping invoice creation record since invoice is already paid');
      //       }
      //     } catch (error) {
      //       console.error('Error processing invoice creation:', error);
      //     }
      //   }
      //   break;

      // case 'invoice.updated':
      //   const updatedInvoice = event.data.object as Stripe.Invoice;
      //   console.log('Processing invoice.updated event:', {
      //     id: updatedInvoice.id,
      //     subscription: updatedInvoice.subscription,
      //     status: updatedInvoice.status,
      //     paid: updatedInvoice.paid
      //   });

      //   // No special action needed, just acknowledge the event
      //   // The invoice.paid event will handle payment recording if needed
      //   break;

      // case 'invoice.finalized':
      //   const finalizedInvoice = event.data.object as Stripe.Invoice;
      //   console.log('Processing invoice.finalized event:', {
      //     id: finalizedInvoice.id,
      //     subscription: finalizedInvoice.subscription,
      //     amount_due: finalizedInvoice.amount_due,
      //     customer: finalizedInvoice.customer,
      //     status: finalizedInvoice.status
      //   });

      //   // We don't need to take any special action here because the invoice.paid
      //   // or invoice.payment_succeeded events will handle storing the payment record.
      //   // This handler is just to log and acknowledge the event.
      //   break;

      // case 'invoice.paid':
      // case 'invoice.payment_succeeded':
      //   const paidInvoice = event.data.object as Stripe.Invoice;
      //   console.log('Processing invoice payment event:', {
      //     id: paidInvoice.id,
      //     type: event.type,
      //     subscription: paidInvoice.subscription,
      //     amount_paid: paidInvoice.amount_paid,
      //     customer: paidInvoice.customer,
      //     status: paidInvoice.status
      //   });

      //   // Check if this is a subscription invoice that we should process
      //   if (paidInvoice.subscription && paidInvoice.status === 'paid') {
      //     try {
      //       // Connect to database first to check for existing payment
      //       await dbConnect();

      //       // Check for duplicate payment in multiple ways:
      //       // 1. Direct match on invoice ID
      //       // 2. Or check for payments with the same amount, date, and customer
      //       const existingPaymentByInvoice = await PaymentModel.findOne({
      //         referenceId: paidInvoice.id
      //       });

      //       // Also check for existing payment by payment intent
      //       let existingPaymentByIntent = null;
      //       if (paidInvoice.payment_intent) {
      //         const paymentIntentId = typeof paidInvoice.payment_intent === 'string'
      //           ? paidInvoice.payment_intent
      //           : paidInvoice.payment_intent.id;

      //         existingPaymentByIntent = await PaymentModel.findOne({
      //           referenceId: paymentIntentId
      //         });
      //       }

      //       // Check if there's any existing payment
      //       if (existingPaymentByInvoice || existingPaymentByIntent) {
      //         console.log(`Payment for invoice ${paidInvoice.id} already exists in database (found by ${existingPaymentByInvoice ? 'invoice ID' : 'payment intent ID'}), skipping`);
      //         break; // Skip the rest of the processing
      //       }

      //       // Continue processing only if no existing payment was found
      //       console.log('Retrieving subscription details...');
      //       const subscriptionId = typeof paidInvoice.subscription === 'string'
      //         ? paidInvoice.subscription
      //         : paidInvoice.subscription.id;

      //       const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      //       const subscriptionAmount = paidInvoice.amount_paid / 100;
      //       const customer = await stripe.customers.retrieve(paidInvoice.customer as string) as Stripe.Customer;

      //       console.log('Retrieved subscription details:', {
      //         subscriptionId,
      //         status: subscription.status,
      //         currentPeriodStart: subscription.current_period_start,
      //         currentPeriodEnd: subscription.current_period_end
      //       });

      //       // Get campaign from subscription metadata
      //       let donationType = subscription.metadata.campaign_title;

      //       // If not found, try to get from campaign key (backward compatibility)
      //       if (!donationType && subscription.metadata.campaign) {
      //         const campaignKey = subscription.metadata.campaign;
      //         const campaignData = current_Diffrent_campaigns[campaignKey];
      //         donationType = campaignData ? campaignData.title : 'Unknown Campaign';
      //       }

      //       // Fallback to default if we still don't have a campaign
      //       if (!donationType) {
      //         donationType = current_Diffrent_campaigns.JESUS_MARCH_2025_MIAMI.title;
      //       }

      //       // Create a new payment record for the paid invoice
      //       const paymentData = {
      //         amount: subscriptionAmount,
      //         dateCreated: paidInvoice.created,
      //         donationType: donationType,
      //         name: customer.name || undefined,
      //         email: customer.email || undefined,
      //         referenceId: paidInvoice.id, // Using invoice ID as reference for deduplication
      //       };

      //       console.log('Saving new payment for paid invoice:', paymentData);

      //       // Store the payment with reference ID
      //       try {
      //         const savedPayment = await createPaymentData(paymentData);
      //         console.log('Subscription payment successfully stored in database:', savedPayment?._id);

      //         const customerName = customer.name || 'Anonymous';
      //         const firstName = customerName.split(' ')[0];

      //         await channel.publish('newPayment', {
      //           amount: subscriptionAmount,
      //           user: firstName,
      //           timestamp: new Date().toISOString(),
      //           donationType: donationType,
      //           isSubscription: true
      //         });

      //         console.log('Payment event published to channel');
      //       } catch (saveError) {
      //         console.error('Error saving invoice payment to database:', saveError);
      //       }

      //       await res.revalidate('/');
      //       await res.revalidate('/live');
      //     } catch (error) {
      //       console.error('Error processing subscription payment:', error);
      //     }
      //   } else {
      //     console.log('Skipping non-subscription or non-paid invoice');
      //   }
      //   break;

      // case 'payment_method.attached':
      //   const paymentMethod = event.data.object as Stripe.PaymentMethod;
      //   console.log('Processing payment_method.attached event:', {
      //     id: paymentMethod.id,
      //     type: paymentMethod.type,
      //     customer: paymentMethod.customer
      //   });

      //   // No need to store anything for this event, just acknowledge receipt
      //   break;

      // case 'payment_intent.succeeded':
      //   const paymentIntent = event.data.object as Stripe.PaymentIntent;
      //   console.log('Processing payment_intent.succeeded event:', {
      //     id: paymentIntent.id,
      //     amount: paymentIntent.amount,
      //     invoice: paymentIntent.invoice,
      //     metadata: paymentIntent.metadata,
      //     customerId: paymentIntent.customer
      //   });

      //   // Only process payment intents that are not already associated with invoices
      //   // (invoices are handled by the invoice.paid handler)
      //   if (!paymentIntent.invoice) {
      //     try {
      //       // Check if payment intent has already been processed
      //       await dbConnect();
      //       // console.log('Database connected for payment intent');

      //       const existingPIPayment = await PaymentModel.findOne({
      //         referenceId: paymentIntent.id
      //       });

      //       // console.log('Existing payment intent check result:', existingPIPayment ? 'Found' : 'Not found');

      //       if (existingPIPayment) {
      //         console.log(`Payment intent ${paymentIntent.id} already processed. Skipping.`);
      //       } else {
      //         // Get customer info if available
      //         let customerName;
      //         let customerEmail;

      //         if (paymentIntent.customer) {
      //           const customer = await stripe.customers.retrieve(paymentIntent.customer as string) as Stripe.Customer;
      //           customerName = customer.name;
      //           customerEmail = customer.email;
      //           // console.log('Retrieved customer details:', {
      //           //   customerId: customer.id,
      //           //   email: customerEmail,
      //           //   name: customerName
      //           // });
      //         }

      //         // Determine campaign/donation type from metadata
      //         let donationType = currentCampaign.title;
      //         if (paymentIntent.metadata.campaign && paymentIntent.metadata.campaign !== 'unknown') {
      //           const campaignKey = paymentIntent.metadata.campaign;
      //           const campaignData = current_Diffrent_campaigns[campaignKey];
      //           if (campaignData) {
      //             donationType = campaignData.title;
      //           }
      //         }

      //         // console.log('Using donation type for payment intent:', donationType);

      //         const paymentData = {
      //           amount: paymentIntent.amount / 100,
      //           dateCreated: paymentIntent.created,
      //           donationType,
      //           name: customerName || undefined,
      //           email: customerEmail || undefined,
      //           referenceId: paymentIntent.id
      //         };

      //         // console.log('Saving payment intent payment:', paymentData);

      //         // Store the payment
      //         try {
      //           const savedPayment = await createPaymentData(paymentData);
      //           // console.log('Payment intent payment successfully stored in database:', savedPayment ? savedPayment._id : 'unknown');

      //           const displayName = customerName || 'Anonymous';
      //           const firstName = displayName.split(' ')[0];

      //           await channel.publish('newPayment', {
      //             amount: paymentIntent.amount / 100,
      //             user: firstName,
      //             timestamp: new Date().toISOString(),
      //             donationType
      //           });

      //           // console.log('Payment event published to channel');

      //           await res.revalidate('/');
      //           await res.revalidate('/live');
      //           console.log('Pages revalidated');
      //         } catch (saveError) {
      //           console.error('Error saving payment intent to database:', saveError);
      //         }
      //       }
      //     } catch (error) {
      //       console.error('Error processing payment intent payment:', error);
      //     }
      //   } else {
      //     console.log('Skipping payment intent with invoice (handled by invoice.paid event)');
      //   }
      //   break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (err: any) {
    console.error('Error processing webhook:', err);
    return res.status(500).json({ error: 'Error processing webhook' });
  }
}