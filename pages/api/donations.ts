// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../db/connect';
import PaymentModel from '../../db/models/payment.model';
import redis from '../../db/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  if (method === 'GET') {
    const total = await getTotalDonationAmount();
    res.status(200).json(total);
    return;
  }

  if (method === 'POST') {
    await dbConnect();

    const { amount, donationType, anonymous } = body;

    if (!amount) throw new Error('amount is a required field in the body');
    if (!donationType)
      throw new Error('donationType is a required field in the body');

    const newPayment = new PaymentModel({
      amount,
      donationType,
      anonymous: !!anonymous,
    });

    await newPayment.save();

    redis.del('totals');

    res.status(200).json(newPayment.toObject());

    return;
  }
}

async function getTotalDonationAmount(donationType: boolean = true) {
  const cacheExists = await redis.exists('totals');

  if (cacheExists) {
    const totalsString = (await redis.get('totals')) as string;
    const totals = JSON.parse(totalsString);
    return totals;
  }

  await dbConnect();

  const data = await PaymentModel.aggregate([
    {
      $group: {
        _id: donationType ? `$donationType` : null,
        total: {
          $sum: '$amount',
        },
      },
    },
  ]);

  redis.set('totals', JSON.stringify(data));

  return data;
}
