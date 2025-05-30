import { useState } from 'react';
import TierSelection from './subscriptions/TierSelection';
import SubscriptionPayment from './subscriptions/SubscriptionPayment';

const Subscription = () => {
  const [selectedTier, setSelectedTier] = useState<{ index: number; priceId: string; } | undefined>(undefined);
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
      {step === 1 && selectedTier && (
        <SubscriptionPayment tier={selectedTier} onBack={() => setStep(0)} />
      )}
    </div>
  );
};

export default Subscription;
