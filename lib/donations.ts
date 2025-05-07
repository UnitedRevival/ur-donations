import dbConnect from '../db/connect';
import PaymentModel, { Payment } from '../db/models/payment.model';
import redis from '../db/redis';

export async function createPaymentData({
  amount,
  donationType,
  dateCreated,
  name,
  email,
  referenceId,
}: Payment) {
  try {

    await dbConnect();

    if (!amount) throw new Error('amount is a required field');
    if (!donationType) throw new Error('donationType is a required field');

    // Create and save the payment
    const newPayment = new PaymentModel({
      amount,
      email,
      name,
      donationType,
      anonymous: !name && !email,
      dateCreated: dateCreated || Date.now(),
      referenceId,
    });

    const savedPayment = await newPayment.save();

    // Clear cache if using redis
    if (redis) {
      await redis.del('totals');
    }

    return savedPayment;
  } catch (error) {
    console.error('Error in createPaymentData:', error);
    throw error;
  }
}
