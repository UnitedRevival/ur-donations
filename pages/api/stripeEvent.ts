// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';
import { buffer } from 'micro';
import { createPaymentData } from '../../lib/donations';
import ablyClient from '../../lib/ably';

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
};

export const currentCampaign = campaigns.JESUS_MARCH_2024_SACRAMENTO;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let event = req.body;

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature: any = req.headers['stripe-signature'];
    const buf = await buffer(req);
    try {
      event = stripe.webhooks.constructEvent(buf, signature, endpointSecret);
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send({
        message: 'Webhook signature verification failed.',
      });
    }
  }

  switch (event.type) {
    case 'charge.succeeded':
      const charge = event.data.object;

      const { amount, created, billing_details } = charge;

      const calculatedAmount = amount / 100;

      const name: string = billing_details?.name;
      const email = billing_details?.email;

      const split = name?.split(' ');
      const fName = split?.[0];

      await createPaymentData({
        amount: calculatedAmount,
        dateCreated: created,
        donationType: currentCampaign.title,
        name,
        email,
      });

      await res.revalidate('/');
      await res.revalidate('/live');

      // TODO: Anonymous users.
      await channel.publish('newPayment', {
        amount: calculatedAmount,
        user: fName || '',
      });

      break;
    case 'payment_intent.succeeded':
      break;
    // case 'payment_method.attached':
    //   const paymentMethod = event.data.object;
    //   console.log('Payment attached: ', paymentMethod);
    //   // Then define and call a method to handle the successful attachment of a PaymentMethod.
    //   // handlePaymentMethodAttached(paymentMethod);
    //   break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
  // Return a 200 response to acknowledge receipt of the event
  res.send({});
}
