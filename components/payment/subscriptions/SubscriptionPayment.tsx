import { useState, useEffect } from 'react';
import styled from 'styled-components';
import LabeledInput from '../../inputs/LabeledInput';

import PrimaryButton from '../../buttons/PrimaryButton';
import SecondaryButton from '../../buttons/SecondaryButton';
import { Title } from '../PaymentCard';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import { useCampaign } from '../../../contexts/CampaignContext';

interface SubscriptionPaymentProps {
  tier: { index: number, priceId: string };
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
  const { currentCampaign } = useCampaign();

  // Get UTM source
  const source = router?.query?.source as string;
  // Get campaign from query param
  const campaign = router?.query?.campaign as string;

  // Get campaign title
  const [campaignTitle, setCampaignTitle] = useState<string | null>(null);

  // Extract campaign info from path/query
  useEffect(() => {
    // Try to get from direct query parameter
    if (router?.query?.title) {
      setCampaignTitle(router.query.title as string);
      return;
    }

    // Try to detect from URL path segment
    const path = router.pathname;
    const pathSegments = path.split('/').filter(Boolean);

    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      // Convert to title case and format
      if (lastSegment && lastSegment !== 'index') {
        const formattedTitle = lastSegment
          .replace(/-/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        // Remove "Event" suffix if present
        const cleanTitle = formattedTitle.replace(/ Event$/i, '');

        // Format like "Jesus March 2025 - City Name"
        setCampaignTitle(`Jesus March 2025 - ${cleanTitle}`);
      }
    }
  }, [router.pathname, router.query]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear any previous errors

    try {
      const url = await createSubscriptionURL(
        {
          priceId: tier.priceId,
          name: formData.name,
          email: formData.email,
          address: {
            line1: formData.line1,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
          },
          utm: source,
          campaign: campaign,
          donationType: currentCampaign, // Use the campaign from context
        },
        setError
      );

      if (url) {
        // @ts-ignore
        window.location.href = url;
      } else {
        // If no URL was returned, we already set the error in createSubscriptionURL
        setLoading(false);
      }
    } catch (error: unknown) {
      console.error('Unexpected error in handleSubmit:', error);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
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
        placeholder="Street Address"
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
          halfWidth
        />
        <LabeledInput
          inputId={'state'}
          label="State (Abbrevation)"
          placeholder="State (CA, AZ...)"
          required
          value={formData.state}
          disabled={loading}
          onChange={onChange}
          autocomplete="state"
          halfWidth
        />
      </Flex>
      <LabeledInput
        inputId={'postal_code'}
        label="Postal Code"
        placeholder="Zip Code"
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
        Complete Partnership
      </PrimaryButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
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
    priceId,
    name,
    email,
    address,
    utm,
    campaign,
    donationType,
  }: {
    priceId: string;
    name?: string;
    email: string;
    utm?: string;
    address: any;
    campaign?: string;
    donationType?: string | null;
  },
  setError: any
) {
  try {
    const response = await axios.post('/api/createSubscription', {
      priceId,
      name,
      email,
      address,
      utm,
      campaign,
      donationType,
    });

    const url = response.data?.url;

    if (!url) {
      console.error('No URL returned from subscription API');
      setError('Failed to create subscription - no payment URL returned');
      return null;
    }

    return url as string;
  } catch (error: unknown) {
    console.error('Error creating subscription:', error);
    let errorMessage = 'Failed to create subscription';

    // Extract detailed error message if available
    if (error instanceof AxiosError && error.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    setError(errorMessage);
    return null;
  }
}

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
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

const ErrorMessage = styled.div`
  color: red;
  margin: 10px 0;
  padding: 10px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 4px;
  text-align: center;
`;

export default SubscriptionPayment;
