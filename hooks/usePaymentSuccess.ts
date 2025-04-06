import { useStepper } from '../contexts/StepContext';
import * as fbq from '../lib/pixel';
import { useContext } from 'react';
import { HomePageContext } from '../contexts/HomePageContext';
import TiktokPixel from 'tiktok-pixel';
import axios from 'axios';

export async function createPaymentData({
  amount,
  donationType,
  dateCreated,
  name,
  email,
}: {
  amount: number;
  donationType: string;
  dateCreated: Date;
  name: string;
  email: string;
}) {
  const response = await axios.post('/api/createPayment', {
    amount,
    email,
    donationType,
    name,
    dateCreated,
  });
  return response.data; // { client_secret: string }
}

export default function usePaymentSuccess(formData: { name: string; email: string; donationType: string }) {
  const { setStep } = useStepper();
  const { amountToDonate } = useContext(HomePageContext);

  const handleSuccess = async () => {
    try {
      const { name, email, donationType } = formData;

      if (!donationType) {
        setStep(3);
        return;
      }

      if (!amountToDonate || !name || !email) {
        throw new Error('Missing required payment data');
      }
      
      const response = await createPaymentData({
        amount: amountToDonate,
        donationType,
        dateCreated: new Date(),
        name,
        email,
      });
      setStep(3);

      // Track events
      fbq.event('Purchase', { currency: 'USD', value: amountToDonate });
      TiktokPixel.track('CompletePayment', {
        content_type: 'product',
        quantity: 1,
        currency: 'USD',
        value: amountToDonate,
      });

      return response; // Optionally return the response
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API request failed:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  };

  return handleSuccess;
}