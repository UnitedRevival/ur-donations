import type { NextApiRequest, NextApiResponse } from 'next';
import { createPaymentData } from '../../lib/donations';

type Data = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { amount, email, donationType, name } = req.body;

  // Basic validation
  if (!amount || !email || !donationType || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const success = await createPaymentData({
      amount,
      donationType,
      dateCreated: new Date(),
      name,
      email,
    });
    return res.status(200).json({ message: 'Payment created successfully' });
  } catch (error) {
    console.error('Error in createPayment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}