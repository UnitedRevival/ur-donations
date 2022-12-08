import dbConnect from '../db/connect';
import PaymentModel, { Payment } from '../db/models/payment.model';
import redis from '../db/redis';

export async function createPaymentData({
  amount,
  donationType,
  dateCreated,
  name,
  email,
}: Payment) {
  await dbConnect();

  if (!amount) throw new Error('amount is a required field in the body');
  if (!donationType)
    throw new Error('donationType is a required field in the body');

  const newPayment = new PaymentModel({
    amount,
    email,
    name,
    donationType,
    anonymous: !name && !email,
    dateCreated,
  });

  await newPayment.save();

  redis?.del('totals');
}
