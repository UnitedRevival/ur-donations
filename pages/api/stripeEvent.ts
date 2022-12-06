// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';
import { buffer } from 'micro';
import { createPaymentData } from '../../lib/donations';

const endpointSecret = process.env.STRIPE_HOOK_SECRET as string;

export const config = {
  api: {
    bodyParser: false,
  },
};

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
      return res.status(400).send({});
    }
  }

  switch (event.type) {
    // case 'charge.succeeded':
    //   const charge = event.data.object;
    //   break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const { created, amount } = paymentIntent;

      const calculatedAmount = amount / 100;
      await createPaymentData({
        amount: calculatedAmount,
        dateCreated: created,
        donationType: 'Jesus March',
      });

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
