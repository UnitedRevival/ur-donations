import { useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { PaymentRequest } from '@stripe/stripe-js';

export default (amount: number) => {
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );
  const [prLoading, setPrLoading] = useState(true);
  const stripe = useStripe();
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Jesus March Donation',
          amount: amount * 100,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      setPrLoading(true);
      // Check the availability of the Payment Request API.
      pr.canMakePayment()
        .then((result) => {
          if (result) {
            setPaymentRequest(pr);
          }
        })
        .finally(() => setPrLoading(false));
    }
  }, [!!stripe, amount]);

  return { paymentRequest, prLoading };
};
