// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import ablyClient from '../../lib/ably';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const channel = ablyClient.channels.get('payments');
  await channel.publish('newPayment', {
    amount: 30,
    user: 'Mark Artishuk',
  });

  res.status(200).json({ test: 'Hello World' });
}
