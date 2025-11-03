import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { HomePageContext } from '../../contexts/HomePageContext';
import Divider from '../dividers/Divider';
import CheckIcon from '../icons/CheckIcon';
import BoxLink from '../links/BoxLink';
import PrimaryButton from '../buttons/PrimaryButton';
import { useRouter } from 'next/router';

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.black};
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.gray};
`;

const Field = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const FieldKey = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 1rem;
`;

const FieldResult = styled.p`
  color: ${({ theme }) => theme.colors.black};
  font-weight: bold;
  font-size: 1.2rem;
`;

const PaymentDetails = styled.div`
  // margin-top: 1rem;
  // margin-bottom: 1rem;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  margin-top: 1rem;
`;

const AutoRefreshText = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const SuccessDisplay = () => {
  const theme = useTheme();
  const router = useRouter();
  const { amountToDonate } = useContext(HomePageContext);
  const [refreshCountdown, setRefreshCountdown] = useState(5);
  const [shouldAutoRefresh, setShouldAutoRefresh] = useState(true);

  // Auto-refresh after 5 seconds
  useEffect(() => {
    if (!shouldAutoRefresh) return;

    const countdownInterval = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Refresh the page to show updated donation amounts
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [shouldAutoRefresh]);

  const handleBackToHome = () => {
    // Navigate to homepage - determine which page we're on and go to appropriate home
    const path = router.pathname;

    // If we're on a specific city page, stay on it; otherwise go to index
    if (path === '/' || path === '/index' || path === '/1' || path === '/2') {
      router.push('/');
    } else {
      // For city-specific pages, just refresh to show updated data
      window.location.reload();
    }
  };

  const handleRefreshNow = () => {
    window.location.reload();
  };

  return (
    <Root>
      <CheckIcon color={theme.colors.black} />
      <Title>Payment successful</Title>
      <Text>Thank you for supporting the Jesus March!</Text>
      <Divider />

      <PaymentDetails>
        <Field>
          <FieldKey>Amount</FieldKey>
          <FieldResult>${amountToDonate}</FieldResult>
        </Field>
      </PaymentDetails>

      <Divider />

      <ButtonContainer>
        <PrimaryButton fullWidth onClick={handleBackToHome}>
          Back to Home
        </PrimaryButton>
        {/* <PrimaryButton fullWidth onClick={handleRefreshNow} variant="small">
          Refresh to See Updated Amounts
        </PrimaryButton> */}
      </ButtonContainer>

      {shouldAutoRefresh && refreshCountdown > 0 && (
        <AutoRefreshText>
          {/* Refreshing in {refreshCountdown} second{refreshCountdown !== 1 ? 's' : ''}... */}
          {' '}
          <button
            onClick={() => setShouldAutoRefresh(false)}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.primary,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.9rem',
            }}
          >
            Cancel
          </button>
        </AutoRefreshText>
      )}

      <Divider />
      <BoxLink href="https://www.instagram.com/unitedrevival/" fill="#000000">
        Follow us on Instagram
      </BoxLink>
      <BoxLink href="https://unitedrevival.org/jesus-march-2023/#tour">
        Jesus March Tour Dates
      </BoxLink>
    </Root>
  );
};

export default SuccessDisplay;
