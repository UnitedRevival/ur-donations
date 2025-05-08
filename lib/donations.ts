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
  anonymous: explicitAnonymous,
}: Payment & { anonymous?: boolean }) {
  try {

    await dbConnect();

    if (!amount) throw new Error('amount is a required field');
    if (!donationType) throw new Error('donationType is a required field');

    console.log('name ==', name,"email==", email,"amount==", amount)

    // Create and save the payment
    const newPayment = new PaymentModel({
      amount,
      email,
      name,
      donationType,
      anonymous: explicitAnonymous !== undefined ? explicitAnonymous : !name || name.trim() === '',
      dateCreated: Date.now(),
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
