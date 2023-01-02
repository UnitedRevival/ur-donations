import { useStepper } from '../contexts/StepContext';
import * as fbq from '../lib/pixel';
import { useContext } from 'react';
import { HomePageContext } from '../contexts/HomePageContext';
import TiktokPixel from 'tiktok-pixel';

export default () => {
  const { setStep } = useStepper();
  const { amountToDonate } = useContext(HomePageContext);

  const handleSuccess = () => {
    // Take them to the success display
    setStep(3);
    // Track purchase to pixel
    fbq.event('Purchase', { currency: 'USD', value: amountToDonate });
    TiktokPixel.track(
      'CompletePayment',
      {
        content_type: 'product',
        quantity: 1,
        currency: 'USD',
        value: amountToDonate,
      },
      {}
    );
  };

  return handleSuccess;
};
