// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const customerId = req.body.customerId;
    const priceId = req.body.priceId;

    try {
      // Create the subscription. Note we're expanding the Subscription's
      // latest invoice and that invoice's payment_intent
      // so we can pass it to the front end to confirm the payment
      // client secret: pi_3MwAbFKPc1fSUjuY1qeGTm4s_secret_Ptp92nUTAtyduXpiVmtlMa2Od
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // console.log('SUB: ', subscription);
      res.send({
        clientSecret:
          // @ts-ignore
          subscription?.latest_invoice?.payment_intent?.client_secret,
      });
    } catch (error) {
      // @ts-ignore
      return res.status(400).send({ error: { message: error.message } });
    }
  } else throw new Error(`${req.method} is not supported for this route`);
}
