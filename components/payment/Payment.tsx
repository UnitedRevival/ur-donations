import * as React from 'react';
import styled from 'styled-components';
import { useStepper } from '../../contexts/StepContext';
import AmountPicker from '../amountpicker/AmountPicker';
import Card from '../card/Card';

import dynamic from 'next/dynamic';
import CenteredLoader from '../loaders/CenteredLoader';

const DynamicPaymentCard = dynamic(() => import('./PaymentCardWrapped'));
const DynamicSuccessDisplay = dynamic(() => import('./SuccessDisplay'));

const Root = styled(Card)`
  margin-bottom: 4rem;
  min-height: 400px;
`;

const Payment = () => {
  const { step } = useStepper();

  return (
    <Root>
      {step === 0 && <AmountPicker />}
      {step === 1 && (
        <React.Suspense fallback={<CenteredLoader color={'black'} />}>
          <DynamicPaymentCard />
        </React.Suspense>
      )}
      {step === 3 && <DynamicSuccessDisplay />}
    </Root>
  );
};

export default Payment;
