import styled from 'styled-components';
import { useState, useEffect } from 'react';
import PrimaryButton from '../../buttons/PrimaryButton';
import QuickPickItem from '../../amountpicker/QuickPickItem';
import axios from 'axios';

interface StripePrice {
  id: string;
  amount: number;
  currency: string;
  productName: string;
  interval: string;
  interval_count: number;
}

interface TierSelection {
  tier?: { index: number, priceId: string } | undefined;
  setTier: (tier: { index: number, priceId: string } | undefined) => any;
  onContinue: () => any;
}

const TierSelection: React.FC<TierSelection> = ({
  tier,
  setTier,
  onContinue,
}) => {
  const [prices, setPrices] = useState<StripePrice[]>([]);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState<number | undefined>(tier?.index);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('/api/getStripePrices');
        setPrices(response.data.prices);

        // Initialize with first price if no tier selected
        if (tier === undefined && response.data.prices.length > 0) {
          setSelectedPriceIndex(0);
          setTier({
            index: 0,
            priceId: response.data.prices[0].id
          }); // Default to first price
        }
      } catch (err: any) {
        console.error('Error fetching prices:', err);
        setError(err.message || 'Error fetching subscription prices');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  // When a price is selected, update both local state and parent state
  const handlePriceSelection = (index: number) => {
    setSelectedPriceIndex(index);
    setTier({
      index: index,
      priceId: prices[index].id
    });

  };

  if (loading) {
    return <LoadingText>Loading subscription options...</LoadingText>;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  return (
    <Tiers>
      <QuickPickContainer>
        {prices.map((price, index) => (
          <QuickPickItem
            key={price.id}
            value={price.amount}
            onSelect={() => handlePriceSelection(index)}
            selected={selectedPriceIndex === index}
          />
        ))}
      </QuickPickContainer>
      <PrimaryButton
        margin="1rem 0 0 0"
        fullWidth
        onClick={onContinue}
        disabled={selectedPriceIndex === undefined || prices.length === 0}
      >
        Give To Jesus March
      </PrimaryButton>
      <Hint>Already have a partnership/subscription?</Hint>
      <StyledLink href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}>
        Click here to manage your subscription
      </StyledLink>
    </Tiers>
  );
};

const QuickPickContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(50px, 1fr));
  gap: 1rem;
  width: 100%;
`;

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

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.error};
`;

export default TierSelection;
