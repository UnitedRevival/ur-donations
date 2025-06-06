import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { db } = await connectToDatabase();
        const { donationType } = req.query;

        // Set start date to 2025-05-06
        const startDate = new Date('2025-05-15T00:00:00.000Z');

        // Build query filter
        const filter: any = {
            dateCreated: {
                $gte: startDate
            }
        };

        // Add donationType filter if provided
        if (donationType) {
            filter.donationType = donationType;
        }

        // Fetch all donations from start date onwards
        const donations = await db
            .collection('payments')
            .find(filter)
            .sort({ dateCreated: -1 })
            .toArray();

        // Calculate total amount
        const totalAmount = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
        const totalCount = donations.length;

        return res.status(200).json({
            success: true,
            donations,
            totalAmount,
            totalCount,
        });

    } catch (error) {
        console.error('Error in recentDonations API:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching donations',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
} 