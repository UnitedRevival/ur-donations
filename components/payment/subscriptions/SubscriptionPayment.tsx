import { useState } from 'react';
import styled from 'styled-components';
import LabeledInput from '../../inputs/LabeledInput';

import PrimaryButton from '../../buttons/PrimaryButton';
import SecondaryButton from '../../buttons/SecondaryButton';
import { Title } from '../PaymentCard';
import { useRouter } from 'next/router';
import axios from 'axios';

interface SubscriptionPaymentProps {
  tier: number;
  onBack: () => any;
}

const SubscriptionPayment: React.FC<SubscriptionPaymentProps> = ({
  tier,
  onBack,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    line1: '',
    postal_code: '',
    city: '',
    state: '',
    country: 'US',
  });

  const [error, setError] = useState('');
  const router = useRouter();

  const source = router?.query?.source as string;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = await createSubscriptionURL(
      {
        priceOption: tier,
        email: formData.email,
        address: {
          line1: formData.line1,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
        },
        utm: source,
      },
      setError
    );

    console.log('URL: ', url);
    // @ts-ignore
    window.location.href = url;

    // setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Payment</Title>
      <CustomDivider />
      <LabeledInput
        inputId={'email'}
        label="Email"
        placeholder="Email"
        type="email"
        required
        value={formData.email}
        disabled={loading}
        onChange={onChange}
        fullWidth
      />
      <LabeledInput
        inputId={'name'}
        label="Name"
        placeholder="Name"
        required
        value={formData.name}
        disabled={loading}
        onChange={onChange}
        fullWidth
      />
      <LabeledInput
        inputId={'line1'}
        label="Street Address (Line 1)"
        placeholder="1234 Jackson St."
        required
        value={formData.line1}
        disabled={loading}
        onChange={onChange}
        autocomplete="street-address"
        fullWidth
      />
      <Flex>
        <LabeledInput
          inputId={'city'}
          label="City"
          placeholder="City"
          required
          value={formData.city}
          disabled={loading}
          onChange={onChange}
          autocomplete="city"
          spaced
          fullWidth
        />
        <LabeledInput
          inputId={'state'}
          label="State (Abbrevation)"
          placeholder="CA, AZ, AR, TX, ..."
          required
          value={formData.state}
          disabled={loading}
          onChange={onChange}
          autocomplete="state"
          fullWidth
        />
      </Flex>
      <LabeledInput
        inputId={'postal_code'}
        label="Postal Code"
        placeholder="Postal Code"
        required
        value={formData.postal_code}
        disabled={loading}
        onChange={onChange}
        autocomplete="postal-code"
        fullWidth
      />
      <PrimaryButton
        fullWidth
        type="submit"
        loading={loading}
        disabled={loading}
      >
        Complete Subscription
      </PrimaryButton>
      {!loading && (
        <SecondaryButton type="button" fullWidth onClick={() => onBack()}>
          Back
        </SecondaryButton>
      )}
    </Form>
  );
};

async function createSubscriptionURL(
  {
    priceOption,
    name,
    email,
    address,
    utm,
  }: {
    priceOption: number;
    name?: string;
    email: string;
    utm?: string;
    address: any;
  },
  setError: any
) {
  try {
    const response = await axios.post('/api/createSubscription', {
      priceOption,
      name,
      email,
      address,
      utm,
    });

    const url = response.data?.url;
    return url as string;
  } catch (err) {
    // @ts-ignore
    setError(err.message);
  }
}

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

const CustomDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.light};
  margin: 1rem 0;
`;

export default SubscriptionPayment;
