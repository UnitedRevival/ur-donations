import type { NextApiRequest, NextApiResponse } from 'next';
import ablyClient from '../../lib/ably';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        console.log('Ably publish key:', process.env.ABLY_PUBLISH_KEY);
        console.log('Ably client API key:', process.env.NEXT_PUBLIC_ABLY_API_KEY);

        // Try to get a channel
        const channel = ablyClient.channels.get('test-channel');

        // Try to publish a test message
        await channel.publish('test', {
            message: 'Test message',
            timestamp: new Date().toISOString()
        });

        res.status(200).json({ success: true, message: 'Ably test message published' });
    } catch (error:any) {
        console.error('Ably test error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            ablyPublishKey: process.env.ABLY_PUBLISH_KEY ? 'Set' : 'Not set',
            ablyClientKey: process.env.NEXT_PUBLIC_ABLY_API_KEY ? 'Set' : 'Not set'
        });
    }
} 