import dynamic from 'next/dynamic';
import React from 'react';
import AmountPicker from '../amountpicker/AmountPicker';
import CenteredLoader from '../loaders/CenteredLoader';

const DynamicPaymentCard = dynamic(() => import('./PaymentCardWrapped'));
const DynamicSuccessDisplay = dynamic(() => import('./SuccessDisplay'));

const SinglePayment = ({ step }) => {
  return (
    <>
      {step === 0 && <AmountPicker />}
      {step === 1 && (
        <React.Suspense fallback={<CenteredLoader color={'black'} />}>
          <DynamicPaymentCard />
        </React.Suspense>
      )}
      {step === 3 && <DynamicSuccessDisplay />}
    </>
  );
};

export default SinglePayment;
