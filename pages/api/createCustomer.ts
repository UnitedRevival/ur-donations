// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';

//     {
//     "name": "Mark Test",
//     "email": "mark@test.com",
//     "address": {
//         "line1": "4141 Test Street",
//         "city": "Sacramento",
//         "state": "CA",
//         "postal_code": "95842",
//         "country": "US"
//     }
// }
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, name, address } = req.body;
    // EX CustomerId: cus_NhZOcgyqvS3Rql
    // address: city, country, line1, postal_code, state

    const customer = await stripe.customers.create({
      email,
      name,
      address,
    });

    if (!customer) {
      res.status(500).json({ error: 'Could not create intent' });
    }

    res.status(200).json({ customer });
  } else throw new Error(`${req.method} is not supported for this route`);
}
