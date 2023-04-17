import styled from 'styled-components';
import SubscriptionTier from './subscriptions/SubscriptionTier';
import { AmountText } from '../amountpicker/QuickPickItem';
import { useState } from 'react';
import PrimaryButton from '../buttons/PrimaryButton';

const subscriptionTiers = [
  {
    title: 'Basic',
    amount: 50,
    benefits: ['Free flag'],
  },
  {
    title: 'Supporter',
    amount: 100,
    benefits: ['Free Flag', 'Enter into travel giveaway(Hotel + Flight)'],
  },
  {
    title: 'Member',
    amount: 250,

    benefits: [
      'Free Flag',
      'Enter into travel giveaway(Hotel + Flight)',
      'Merch release',
    ],
  },
];

const Subscription = () => {
  const [selectedTier, setSelectedTier] = useState(0);

  return (
    <Tiers>
      {subscriptionTiers.map((s, index) => (
        <SubscriptionTier
          onSelected={() => setSelectedTier(index)}
          title={s.title}
          selected={selectedTier === index}
          benefits={s.benefits}
        >
          ${s.amount}
        </SubscriptionTier>
      ))}
      <PrimaryButton margin="1rem 0 0 0" fullWidth>
        Continue
      </PrimaryButton>
    </Tiers>
  );
};

const Tiers = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

export default Subscription;
