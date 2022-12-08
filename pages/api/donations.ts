// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../db/connect';
import PaymentModel from '../../db/models/payment.model';
import redis from '../../db/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === 'GET') {
    const total = await getTotalDonationAmount();
    res.status(200).json(total);
    return;
  }
}

interface Total {
  _id: string;
  total: number;
}

export async function getTotalDonationAmount(
  donationType: boolean = true
): Promise<Total[]> {
  let cacheExists: any = null;

  try {
    cacheExists = await redis?.exists('totals');
  } catch (err) {
    console.log('err: ', err);
  }

  if (cacheExists) {
    const totalsString = (await redis?.get('totals')) as string;
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

  if (redis) redis.set('totals', JSON.stringify(data));

  return data;
}
