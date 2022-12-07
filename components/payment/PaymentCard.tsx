import * as React from 'react';
import styled from 'styled-components';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useContext, useState } from 'react';
import PrimaryButton from '../buttons/PrimaryButton';
import Divider from '../dividers/Divider';
import { HomePageContext } from '../../contexts/HomePageContext';
import { useStepper } from '../../contexts/StepContext';
import SecondaryButton from '../buttons/SecondaryButton';
import axios from 'axios';
import Label from '../inputs/Label';
import LabeledInput from '../inputs/LabeledInput';

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
  // const [paymentRequest, setPaymentRequest] = useState<any>(null);

  // TODO: Future Wallet payment features
  // useEffect(() => {
  //   if (stripe) {
  //     const pr = stripe.paymentRequest({
  //       country: 'US',
  //       currency: 'usd',
  //       total: {
  //         label: 'Demo total',
  //         amount: 1099,
  //       },
  //       requestPayerName: true,
  //       requestPayerEmail: true,
  //     });

  //     // Check the availability of the Payment Request API.
  //     pr.canMakePayment().then((result) => {
  //       console.log('Got back a result: ', result);
  //       if (result) {
  //         setPaymentRequest(pr);
  //       }
  //     });
  //   }
  // }, [stripe]);

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

    const response = await axios.post('/api/paymentIntent', {
      amount: amountToDonate * 100,
      email: formData.email,
    });

    const client_secret = response.data?.client_secret;
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
        // Take them to the success display
        setStep(3);
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
      {/* <Divider />

      <SubTitle>Wallets</SubTitle>
      <NoWallet>No wallets found</NoWallet> */}

      <Divider />
      <LabeledInput
        inputId={'name'}
        label="Name"
        placeholder="Name"
        required
        value={formData.name}
        onChange={onChange}
      />
      <LabeledInput
        inputId={'email'}
        label="Email"
        placeholder="Email"
        type="email"
        required
        value={formData.email}
        onChange={onChange}
      />
      <Label>Card</Label>
      <StyledCard
        focused={cardFocused}
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
