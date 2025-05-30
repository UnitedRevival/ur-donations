import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';

type Data = {
    prices?: any[];
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    try {
        // Fetch all active prices
        const prices = await stripe.prices.list({
            active: true,
            type: 'recurring',
            expand: ['data.product'],
        });

        // Sort prices by unit amount and remove duplicates
        const uniquePrices = Array.from(
            new Map(
                prices.data
                    .map(price => [
                        price.unit_amount,
                        {
                            id: price.id,
                            amount: (price.unit_amount || 0) / 100,
                            currency: price.currency,
                            productName:
                                price.product &&
                                    typeof price.product !== 'string' &&
                                    !(price.product as any).deleted
                                    ? (price.product as any).name
                                    : '',
                            interval: price.recurring?.interval,
                            interval_count: price.recurring?.interval_count
                        }
                    ])
            ).values()
        ).sort((a, b) => a.amount - b.amount);

        return res.status(200).json({ prices: uniquePrices });
    } catch (error: any) {
        console.error('Error fetching Stripe prices:', error);
        return res.status(500).json({ error: error.message || 'Error fetching prices' });
    }
} 