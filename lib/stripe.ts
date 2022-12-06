import Stripe from 'stripe';

const STRIPE_SECRET = process.env.STRIPE_SECRET as string;
const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: '2022-11-15',
});

export default stripe;
