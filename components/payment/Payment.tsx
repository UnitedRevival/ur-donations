import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { useStepper } from '../../contexts/StepContext';
import AmountPicker from '../amountpicker/AmountPicker';
import Card from '../card/Card';
import PaymentCard from './PaymentCard';
import SuccessDisplay from './SuccessDisplay';

const Root = styled(Card)`
  margin-bottom: 4rem;
`;

const Payment = () => {
  const { step } = useStepper();

  return (
    <Root>
      {step === 0 && <AmountPicker />}
      {step === 1 && <PaymentCard />}

      {/* Payment Succeeded */}
      {step === 3 && <SuccessDisplay />}
    </Root>
  );
};

export default Payment;
