import dbConnect from '../db/connect';
import CustomerModel from '../db/models/customer.model';
import PaymentModel from '../db/models/payment.model';
import stripe from './stripe';
import type { Stripe } from 'stripe';

/**
 * Updates a customer's subscription status in the database
 */
export async function updateCustomerSubscription(
    customerId: string,
    subscriptionId: string,
    status: string,
    canceledAt?: number
): Promise<void> {
    await dbConnect();

    const customer = await CustomerModel.findOne({ stripeCustomer: customerId });

    if (!customer) {
        console.error(`No customer found with ID ${customerId}`);
        return;
    }

    // Update active subscriptions array
    if (status === 'active' || status === 'trialing' || status === 'incomplete') {
        if (!customer.activeSubscriptions?.includes(subscriptionId)) {
            await CustomerModel.updateOne(
                { stripeCustomer: customerId },
                { $addToSet: { activeSubscriptions: subscriptionId } }
            );
        }
    } else if (status === 'canceled' || status === 'incomplete_expired') {
        await CustomerModel.updateOne(
            { stripeCustomer: customerId },
            { $pull: { activeSubscriptions: subscriptionId } }
        );
    }

    // Add to subscription history
    const historyEntry = {
        subscriptionId,
        status,
        createdAt: new Date(),
        canceledAt: canceledAt ? new Date(canceledAt * 1000) : undefined
    };

    await CustomerModel.updateOne(
        { stripeCustomer: customerId },
        { $push: { subscriptionHistory: historyEntry } }
    );

    console.log(`Updated subscription status for customer ${customerId}, subscription ${subscriptionId} to ${status}`);
}

/**
 * Gets all active subscriptions for a customer
 */
export async function getCustomerActiveSubscriptions(customerId: string): Promise<string[]> {
    await dbConnect();

    const customer = await CustomerModel.findOne({ stripeCustomer: customerId });

    if (!customer) {
        console.error(`No customer found with ID ${customerId}`);
        return [];
    }

    return customer.activeSubscriptions || [];
}

/**
 * Processes a subscription status change
 */
export async function processSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
    const { customer, id, status, canceled_at } = subscription;

    if (!customer) {
        console.error('No customer ID in subscription', id);
        return;
    }

    const customerId = typeof customer === 'string' ? customer : customer.id;

    await updateCustomerSubscription(customerId, id, status, canceled_at || undefined);
}

/**
 * Gets payment history for a subscription
 */
export async function getSubscriptionPayments(subscriptionId: string): Promise<any[]> {
    await dbConnect();

    try {
        // Get all invoices for this subscription from Stripe
        const invoices = await stripe.invoices.list({
            subscription: subscriptionId,
            limit: 100,
        });

        // Get all payments from our database that match these invoice IDs
        const invoiceIds = invoices.data.map(invoice => invoice.id);

        const payments = await PaymentModel.find({
            referenceId: { $in: invoiceIds }
        }).sort({ dateCreated: -1 });

        return payments;
    } catch (error) {
        console.error('Error getting subscription payments:', error);
        return [];
    }
} 