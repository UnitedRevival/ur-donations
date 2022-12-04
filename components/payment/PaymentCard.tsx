import * as React from 'react';
import Card from '../card/Card';
import styled from 'styled-components';
import {
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import PrimaryButton from '../buttons/PrimaryButton';
import Divider from '../dividers/Divider';
const Root = styled(Card)`
  min-width: 500px;

  margin-top: 4rem;
  margin-bottom: 4rem;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
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

const PaymentCard = () => {
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [cardFocused, setCardFocused] = useState(false);

  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Demo total',
          amount: 1099,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        console.log('Got back a result: ', result);
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null || stripe == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      // @ts-ignore
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error);
    }

    console.log('Got payment method', paymentMethod);
  };

  return (
    <Root>
      <form onSubmit={handleSubmit}>
        <Title>Payment</Title>
        <Divider />

        <SubTitle>Wallets</SubTitle>
        {paymentRequest ? (
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        ) : (
          <NoWallet>No wallets found</NoWallet>
        )}
        {/* <TextDivider>or</TextDivider> */}
        <Divider />
        <SubTitle>Card</SubTitle>
        <StyledCard
          focused={cardFocused}
          onFocus={() => {
            setCardFocused(true);
          }}
          onBlur={() => {
            setCardFocused(false);
          }}
          onReady={() => {
            setCardReady(true);
          }}
        />

        <PrimaryButton
          variant="large"
          // height={100}

          fullWidth
          disabled={!cardReady || !elements || !stripe}
        >
          Submit Payment
        </PrimaryButton>
      </form>
    </Root>
  );
};

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

const SubTitle = styled.h3`
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.light};
`;

export default PaymentCard;
