import styled from 'styled-components';
import SubscriptionTier from './SubscriptionTier';
import { useState } from 'react';
import PrimaryButton from '../../buttons/PrimaryButton';

export const subscriptionTiers = [
  {
    title: 'Basic',
    amount: 50,
    benefits: ['Free flag'],
  },
  {
    title: 'Supporter',
    amount: 100,
    benefits: ['Free Flag', 'Enter into travel giveaway (Hotel + Flight)'],
  },
  {
    title: 'Member',
    amount: 250,

    benefits: [
      'Free Flag',
      'Enter into travel giveaway (Hotel + Flight)',
      'Merch release',
    ],
  },
];

const STRIPE_CUSTOMER_PORTAL_URL =
  process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL;

interface TierSelection {
  tier?: number;
  setTier: (num: any) => any;
  onContinue: () => any;
}

const TierSelection: React.FC<TierSelection> = ({
  tier,
  setTier,
  onContinue,
}) => {
  const [isYearly, setIsYearly] = useState(false);
  console.log('STRIPE CUSTOMER: ', STRIPE_CUSTOMER_PORTAL_URL);
  return (
    <Tiers>
      {/* <Toggle toggled={isYearly} onClick={() => setIsYearly(!isYearly)} /> */}
      {subscriptionTiers.map((s, index) => (
        <SubscriptionTier
          onSelected={() => setTier(index)}
          title={s.title}
          selected={tier === index}
          benefits={s.benefits}
          yearly={isYearly}
        >
          ${s.amount}
        </SubscriptionTier>
      ))}
      <PrimaryButton margin="1rem 0 0 0" fullWidth onClick={onContinue}>
        Continue
      </PrimaryButton>
      <Hint>Already have a partnership/subscription?</Hint>
      <StyledLink href={STRIPE_CUSTOMER_PORTAL_URL}>
        Click here to manage your subscription
      </StyledLink>
    </Tiers>
  );
};

const StyledLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
`;

const Hint = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 15px;
`;

const Tiers = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

export default TierSelection;
