import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import PaymentCard from './PaymentCard';
import { loadStripe } from '@stripe/stripe-js';

const PaymentCardWrapped = () => {
  const [stripePromise, setStripePromise] = useState<any>(null);

  useEffect(() => {
    if (!stripePromise) {
      const sPromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string);
      setStripePromise(sPromise);
    }
  }, []);
  return (
    <Elements stripe={stripePromise}>
      <PaymentCard />
    </Elements>
  );
};

export default PaymentCardWrapped;
