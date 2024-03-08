// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import ablyClient from '../../lib/ably';

function getRandomNumber() {
  return Math.floor(Math.random() * 1000) + 1; // Generating a random integer between 1 and 1000
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const channel = ablyClient.channels.get('payments');
  await channel.publish('newPayment', {
    amount: getRandomNumber(),
    user: 'Mark Artishuk',
  });

  res.status(200).json({ test: 'Hello World' });
}
