import { useStepper } from '../contexts/StepContext';
import * as fbq from '../lib/pixel';
import { useContext } from 'react';
import { HomePageContext } from '../contexts/HomePageContext';

export default () => {
  const { setStep } = useStepper();
  const { amountToDonate } = useContext(HomePageContext);

  const handleSuccess = () => {
    // Take them to the success display
    setStep(3);
    // Track purchase to pixel
    fbq.event('Purchase', { currency: 'USD', value: amountToDonate });
  };

  return handleSuccess;
};
