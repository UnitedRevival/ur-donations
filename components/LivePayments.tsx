import React, { useContext, useEffect, useState } from 'react';
import * as Ably from 'ably';
import {
  AblyProvider,
  useChannel,
  useConnectionStateListener,
} from 'ably/react';
import styled from 'styled-components';
import { HomePageContext } from '../contexts/HomePageContext';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './confetti/Confetti';
import AnimatedNumber from './animated/AnimatedNumber';
import axios from 'axios';

const LivePayments = () => {
  // Get the Ably API key from environment variable and fix any escaping issues
  const ablyApiKey = process.env.NEXT_PUBLIC_ABLY_API_KEY?.replace(/\\(_|\.)/g, '$1');


  const [ablyClient] = useState(
    new Ably.Realtime.Promise({
      key: ablyApiKey,
    })
  );
  return (
    <AblyProvider client={ablyClient}>
      <DonationPayments />
    </AblyProvider>
  );
};

interface LiveDonationData {
  amount: number;
  user: string;
  date: Date;
  life: number;
}

interface PaymentData {
  _id: string;
  amount: number;
  name: string;
  dateCreated: string;
  anonymous: boolean;
  donationType?: string;
}

interface DonationResponse {
  donations: PaymentData[];
  totalCount: number;
  totalAmount: number;
}

const DonationPayments = () => {
  const [donationQueue, setDonationQueue] = useState<LiveDonationData[]>([]);
  const { amountRaised, goal, setAmountRaised } = useContext(HomePageContext);
  const [showThankYou, setShowThankYou] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiData[]>([]);
  const [recentDonations, setRecentDonations] = useState<PaymentData[]>([]);
  const [recentTotal, setRecentTotal] = useState(0);
  const [latestDonation, setLatestDonation] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch recent donations
  const fetchRecentDonations = async () => {
    try {
      // Use the specific date (06/05/2025) for filtering
      const date = '2025-05-06';
      const response = await axios.get(`/api/recentDonations?date=${date}`);

      const donationData = response.data as DonationResponse;

      if (donationData && donationData.donations && donationData.donations.length > 0) {
        setRecentDonations(donationData.donations);

        // Calculate total from recent donations
        const recentSum = donationData.donations.reduce((total, donation) =>
          total + donation.amount, 0);
        setRecentTotal(recentSum);
        setAmountRaised(recentSum);

        // Set the latest donation
        const latest = donationData.donations[0];
        if (!latestDonation || latest._id !== latestDonation._id) {
          setLatestDonation(latest);
          const firstName = latest.name
            ? latest.name.split(' ')[0]
            : 'Anonymous';

          push({
            amount: latest.amount,
            user: firstName,
            date: new Date(latest.dateCreated),
            life: 4
          });
        }
      } else {
        setRecentDonations([]);
        setRecentTotal(0);
        setAmountRaised(0);
        setLatestDonation(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching donations:', error);
      setLoading(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchRecentDonations();
  }, []);

  // Set up polling every 30 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchRecentDonations();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (donationQueue.length > 0) {
        const current = donationQueue[0];
        if (current.life <= 0) {
          donationQueue.shift();
          setDonationQueue([...donationQueue]);
          setShowThankYou(false);

          // If there are more donations in the queue, show the next one
          if (donationQueue.length > 1) {
            setShowThankYou(true);
          }
          return;
        }

        donationQueue[0].life -= 1;
        setDonationQueue([...donationQueue]);
      }
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [donationQueue.length]);

  const push = (donation: LiveDonationData) => {
    setDonationQueue((prev) => [...prev, donation]);
    setShowThankYou(true);

    // Add multiple confetti effects with different emojis
    setConfetti((prev) => {
      const newConfetti: ConfettiData[] = [
        { content: '🎉', lifetime: 1 },
        { content: '🎈', lifetime: 1 },
        { content: '✨', lifetime: 1 },
        { content: '🎊', lifetime: 1 },
        { content: '🌟', lifetime: 1 }
      ];
      return [...prev, ...newConfetti];
    });
  };

  useConnectionStateListener('connected', () => {
  });

  // Create a channel called 'get-started' and subscribe to all messages with the name 'first' using the useChannel hook
  const { channel } = useChannel('payments', 'newPayment', (message) => {
    push({ ...message.data, date: new Date(), life: 4 });

    // Get the donation amount
    const newAmount = message.data?.amount || 0;

    // Update the amount raised based on recent total
    setAmountRaised(prev => prev + newAmount);

    // Update the recent total
    setRecentTotal(prev => prev + newAmount);

    // Add to recent donations
    if (message.data) {
      const newDonation: PaymentData = {
        _id: new Date().getTime().toString(),
        amount: newAmount,
        name: message.data.user || 'Anonymous',
        dateCreated: new Date().toISOString(),
        anonymous: !message.data.user
      };

      setRecentDonations(prev => [newDonation, ...prev.slice(0, 9)]); // Keep only 10 most recent
    }
  });

  const percentage = Math.floor((amountRaised / goal) * 100);
  const progressVisible = true;

  return (
    <Root>
      {loading ? (
        <div style={{ color: 'white', fontSize: 24, marginTop: 40 }}>Loading...</div>
      ) : (
        <>
          <ConfettiContainer>
            <AnimatePresence initial={true}>
              {confetti.map((c, index) => (
                <Confetti key={index} mKey={index}>
                  {c.content}
                </Confetti>
              ))}
            </AnimatePresence>
          </ConfettiContainer>

          <ThankYouContainer>
            <AnimatePresence mode="wait">
              {showThankYou && donationQueue.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Amount>🎉 💵 ${donationQueue[0].amount.toLocaleString()} 💵 🎉</Amount>
                  <UserText>✨ {donationQueue[0].user} ✨</UserText>
                  <ThankYouMessage>
                    🎈 Thank you {donationQueue[0].user} for donating ${donationQueue[0].amount.toLocaleString()}! 🎈
                  </ThankYouMessage>
                </motion.div>
              )}
            </AnimatePresence>
          </ThankYouContainer>

          <AnimateContainer>
            <AnimatePresence mode="wait">
              {progressVisible && (
                <motion.div
                  style={{ width: '100%' }}
                  key={'progressBar'}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -30,
                  }}
                >
                  <ProgressBarContainer>
                    <FlexBetween>
                      <div>
                        <AnimatedNumber
                          value={amountRaised}
                          style={{ color: 'white', fontSize: 26 }}
                          prefix={'$'}
                        />
                        <GoalText>/${goal}</GoalText>
                      </div>
                      <PercentText>{percentage}%</PercentText>
                    </FlexBetween>
                    <ProgressBar>
                      <StyledProgress percentage={percentage} />
                    </ProgressBar>
                  </ProgressBarContainer>
                </motion.div>
              )}
            </AnimatePresence>
          </AnimateContainer>

          <DonationsContainer>
            <RecentDonationsLabel>Latest Donation</RecentDonationsLabel>
            <RecentDonationsList>
              {latestDonation && (
                <DonationItem key={latestDonation._id}>
                  <DonorName>
                    {latestDonation.name ? latestDonation.name.split(' ')[0] : 'Anonymous'}
                  </DonorName>
                  <DonationAmount>${latestDonation.amount.toLocaleString()}</DonationAmount>
                </DonationItem>
              )}
            </RecentDonationsList>
          </DonationsContainer>
        </>
      )}
    </Root>
  );
};

const Root = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: black;
  padding: 20px;
  color: white;
`;

const ConfettiContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const ThankYouContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const ThankYouMessage = styled.div`
  color: #4CAF50;
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
`;

const UserText = styled.div`
  color: white;
  font-size: 28px;
  margin-top: 5px;
`;

const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const AnimateContainer = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  padding: 16px 12px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  color: white;
  overflow: hidden;
  position: relative;
`;

const PercentText = styled.span`
  color: white;
  font-size: 16px;
`;

const GoalText = styled.span`
  color: white;
  opacity: 0.7;
  font-size: 16px;
`;

const ProgressBar = styled.div`
  width: 100%;
  background-color: #e8e8e877;
  height: 8px;
  border-radius: 16px;
  overflow: hidden;
  margin-top: 4px;
`;

interface StyledProgressProps {
  percentage?: number;
}

const StyledProgress = styled.div<StyledProgressProps>`
  background-color: white;
  height: 100%;
  width: ${(props) => props.percentage}%;
  opacity: 1;
  transition: all 1s ease;
`;

const Amount = styled.div`
  font-size: 32px;
  color: white;
  font-weight: bold;
`;

const DonationsContainer = styled.div`
  margin-top: 15px;
  text-align: center;
  max-width: 800px;
  width: 100%;
`;

const RecentDonationsLabel = styled.div`
  font-size: 20px;
  color: white;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
`;

const RecentDonationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const DonationItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
`;

const DonorName = styled.div`
  font-size: 16px;
  color: white;
`;

const DonationAmount = styled.div`
  font-size: 16px;
  color: white;
  font-weight: bold;
`;

interface ConfettiData {
  content?: string;
  lifetime?: any;
}

export default LivePayments;
