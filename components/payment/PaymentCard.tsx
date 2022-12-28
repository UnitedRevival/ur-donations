import * as React from 'react';
import styled from 'styled-components';
import {
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';
import { useContext, useEffect, useState } from 'react';
import PrimaryButton from '../buttons/PrimaryButton';
import Divider from '../dividers/Divider';
import { HomePageContext } from '../../contexts/HomePageContext';
import { useStepper } from '../../contexts/StepContext';
import SecondaryButton from '../buttons/SecondaryButton';
import axios from 'axios';
import Label from '../inputs/Label';
import LabeledInput from '../inputs/LabeledInput';
import * as fbq from '../../lib/pixel';

const PaymentCard = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { setStep } = useStepper();
  const { amountToDonate } = useContext(HomePageContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cardFocused, setCardFocused] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Jesus March Donation',
          amount: amountToDonate * 100,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [!!stripe, amountToDonate]);

  useEffect(() => {
    console.log('HELLO', !!paymentRequest, !!stripe);
    if (paymentRequest && stripe) {
      const paymentMethodHandler = async function (ev) {
        // Confirm the PaymentIntent without handling potential next actions (yet).
        const client_secret = await createPaymentIntentClientSecret({
          amount: amountToDonate,
          email: ev.payerEmail,
        });
        const { paymentIntent, error: confirmError } =
          await stripe.confirmCardPayment(
            client_secret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

        if (confirmError) {
          // Report to the browser that the payment failed, prompting it to
          // re-show the payment interface, or show an error message and close
          // the payment interface.
          ev.complete('fail');
        } else {
          // Report to the browser that the confirmation was successful, prompting
          // it to close the browser payment method collection interface.
          ev.complete('success');
          // Check if the PaymentIntent requires any actions and if so let Stripe.js
          // handle the flow. If using an API version older than "2019-02-11"
          // instead check for: `paymentIntent.status === "requires_source_action"`.
          if (paymentIntent.status === 'requires_action') {
            // Let Stripe.js handle the rest of the payment flow.
            setLoading(true);
            const { error } = await stripe.confirmCardPayment(client_secret, {
              payment_method: ev.paymentMethod.id,
            });
            setLoading(false);
            if (error) {
              // The payment failed -- ask your customer for a new payment method.
              console.error('ERROR with wallet pay: ', error);
              setError(
                'There was a problem with the payment, please choose a different payment method.'
              );
              return;
            }
          }
          paymentRequest.off('paymentMethod', paymentMethodHandler);

          console.log('Payment succeeded through wallet');
          handleSuccess();
        }
      };
      paymentRequest.on('paymentmethod', paymentMethodHandler);
      console.log('IS THIS FIRING?!?! PART 1');
      return () => {
        console.log('IS THIS FIRING?!?!');
        paymentRequest.off('paymentMethod');

        console.log('OFFED');
      };
    }
  }, [!!paymentRequest, !!stripe]);

  const handleSuccess = () => {
    // Take them to the success display
    setStep(3);
    // Track purchase to pixel
    fbq.event('Purchase', { currency: 'USD', value: amountToDonate });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null || stripe == null) {
      return;
    }
    if (!formData?.email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError('');

    const client_secret = await createPaymentIntentClientSecret({
      amount: amountToDonate,
      email: formData.email,
    });

    const result = await stripe.confirmCardPayment(client_secret!, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: formData.name,
          email: formData.email,
        },
      },
    });

    if (result.error) {
      console.log(result.error);
      setError('Failed to charge card: ' + result.error.message);
    } else {
      // The payment has been processed!

      if (result.paymentIntent.status === 'succeeded') {
        handleSuccess();
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      } else {
        console.error(
          'paymentIntent has been processed and the status was not succeeded: ',
          result
        );
      }
    }

    setLoading(false);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Title>Payment</Title>
      <Divider />
      <SubTitle>Wallets</SubTitle>
      {paymentRequest ? (
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      ) : (
        <NoWallet>No wallets found</NoWallet>
      )}

      <Divider />
      <LabeledInput
        inputId={'name'}
        label="Name"
        placeholder="Name"
        required
        value={formData.name}
        disabled={loading}
        onChange={onChange}
      />
      <LabeledInput
        inputId={'email'}
        label="Email"
        placeholder="Email"
        type="email"
        required
        value={formData.email}
        disabled={loading}
        onChange={onChange}
      />
      <Label>Card</Label>
      <StyledCard
        focused={cardFocused}
        options={{ disabled: loading }}
        onFocus={() => {
          setCardFocused(true);
        }}
        onBlur={() => {
          setCardFocused(false);
        }}
      />
      {!!error && <ErrorText>{error}</ErrorText>}
      <PrimaryButton
        variant="large"
        fullWidth
        type="submit"
        loading={loading}
        disabled={!elements || !stripe || loading}
      >
        Submit Payment - ${amountToDonate}
      </PrimaryButton>

      {!loading && (
        <SecondaryButton
          type="button"
          fullWidth
          variant="large"
          onClick={() => {
            setStep(0);
          }}
        >
          Go Back
        </SecondaryButton>
      )}
    </form>
  );
};

async function createPaymentIntentClientSecret({
  amount,
  email,
}: {
  amount: number;
  email: string;
}) {
  const response = await axios.post('/api/paymentIntent', {
    amount: amount * 100,
    email,
  });

  const client_secret = response.data?.client_secret;
  return client_secret as string;
}

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};

  padding: 1rem;

  margin-bottom: 1rem;
  background-color: ${({ theme }) => theme.colors.error}22;

  border-radius: ${({ theme }) => theme.borderRadius};
`;

const NoWallet = styled.p`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius}px;
  color: ${({ theme }) => theme.colors.light};
  text-align: center;

  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
`;

const SubTitle = styled.h3`
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.light};
`;

const StyledCard = styled(CardElement)<{ focused: boolean }>`
  margin-top: 1rem;
  margin-bottom: 2rem;

  background-color: white;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius}px;

  box-sizing: border-box;

  cursor: pointer;
  width: 100%;
  transition: 0.1s all linear;
  border: 1px solid
    ${({ theme, focused }) =>
      focused ? theme.colors.primary : theme.colors.light};

  ${({ theme, focused }) =>
    focused ? `outline: 3px solid ${theme.colors.primary}66;` : ''};
`;

export default PaymentCard;
