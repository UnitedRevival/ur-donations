// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';

type Data = {
  client_secret?: string | null;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { amount, email, utm, campaign } = req.body;

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      receipt_email: email,
      metadata: {
        integration_check: 'accept_a_payment',
        utm_source: utm ? utm : 'unknown',
        campaign: campaign ? campaign : 'unknown',
      },
    });

    if (!intent) {
      res.status(500).json({ error: 'Could not create intent' });
    }

    res.status(200).json({ client_secret: intent.client_secret });
  } else throw new Error(`${req.method} is not supported for this route`);
}
