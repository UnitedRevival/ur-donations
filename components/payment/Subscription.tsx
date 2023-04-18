import { useState } from 'react';
import TierSelection from './subscriptions/TierSelection';
import SubscriptionPayment from './subscriptions/SubscriptionPayment';

const Subscription = () => {
  const [selectedTier, setSelectedTier] = useState(0);
  const [step, setStep] = useState(0);

  return (
    <div>
      {step === 0 && (
        <TierSelection
          tier={selectedTier}
          setTier={setSelectedTier}
          onContinue={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <SubscriptionPayment tier={selectedTier} onBack={() => setStep(0)} />
      )}
    </div>
  );
};

export default Subscription;
