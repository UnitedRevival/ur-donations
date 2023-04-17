// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';

// Currently are test price ids... change to env variables later
const PRICE_ID_1 = process.env.SUBSCRIPTION_ID_1;
const PRICE_ID_2 = process.env.SUBSCRIPTION_ID_2;
const PRICE_ID_3 = process.env.SUBSCRIPTION_ID_3;
const priceIds = {
  0: PRICE_ID_1, // 50
  1: PRICE_ID_2, //100
  2: PRICE_ID_3, //250
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const customerId = req.body.customerId;
    const priceOption = req.body.priceOption;
    const priceId = priceIds[priceOption];

    console.log(priceIds);
    if (!priceId)
      throw new Error(
        'Invalid price option passed in, cannot do' + priceOption
      );

    try {
      // Create the subscription. Note we're expanding the Subscription's
      // latest invoice and that invoice's payment_intent
      // so we can pass it to the front end to confirm the payment

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
