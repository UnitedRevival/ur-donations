// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';
import CustomerModel from '../../db/models/customer.model';
import dbConnect from '../../db/connect';

// Currently are test price ids... change to env variables later
const PRICE_ID_1 = process.env.SUBSCRIPTION_ID_1;
const PRICE_ID_2 = process.env.SUBSCRIPTION_ID_2;
const PRICE_ID_3 = process.env.SUBSCRIPTION_ID_3;
const PRICE_ID_4 = process.env.SUBSCRIPTION_ID_4;
const PRICE_ID_5 = process.env.SUBSCRIPTION_ID_5;
const PRICE_ID_6 = process.env.SUBSCRIPTION_ID_6;
const priceIds = {
  0: PRICE_ID_1, // 10
  1: PRICE_ID_2, // 25
  2: PRICE_ID_3, // 50
  3: PRICE_ID_4, // 100, ...etc
  4: PRICE_ID_5,
  5: PRICE_ID_6,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, name, address, utm } = req.body;

    await dbConnect();

    const foundCustomer = await CustomerModel.findOne({ email });

    let customerId: any = null;
    if (foundCustomer) customerId = foundCustomer?.stripeCustomer;
    else {
      const customer = await stripe.customers.create({
        email,
        name,
        address,
        // shipping: {
        //   address,
        //   name: name,
        // },
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

    const priceOption = req.body.priceOption;
    const priceId = priceIds[priceOption];

    if (!priceId)
      throw new Error(
        'Invalid price option passed in, cannot do' + priceOption
      );

    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
            metadata: {
              utm_source: utm ? utm : 'unknown',
            },
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      res.send({
        // @ts-ignore
        url: subscription?.latest_invoice?.hosted_invoice_url,
      });
    } catch (error) {
      // @ts-ignore
      return res.status(400).send({ error: { message: error.message } });
    }
  } else throw new Error(`${req.method} is not supported for this route`);
}
