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
  const { amountRaised, goal: contextGoal, setAmountRaised } = useContext(HomePageContext);
  // Override goal to ensure it's 10000
  const goal = 15000;
  const [currentDonation, setCurrentDonation] = useState<LiveDonationData | null>(null);
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
      const response = await axios.get(`/api/recentDonations?date=${date}&donationType=Jesus March 2025 - Denver`);

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

  // Handle showing thank you message for 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showThankYou) {
      timer = setTimeout(() => {
        setShowThankYou(false);
        setCurrentDonation(null);
      }, 3000); // Show thank you for 3 seconds
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showThankYou]);

  const showDonation = (donation: LiveDonationData) => {
    setCurrentDonation(donation);
    setShowThankYou(true);

    // Add confetti effects
    setConfetti((prev) => {
      const newConfetti: ConfettiData[] = [
        // { content: '🎉', lifetime: 1 },
        // { content: '🎈', lifetime: 1 },
        // { content: '✨', lifetime: 1 },
        // { content: '🎊', lifetime: 1 },
        // { content: '🌟', lifetime: 1 }
      ];
      return [...prev, ...newConfetti];
    });
  };

  useConnectionStateListener('connected', () => {
  });

  // Create a channel called 'get-started' and subscribe to all messages with the name 'first' using the useChannel hook
  const { channel } = useChannel('payments', 'newPayment', (message) => {
    // Check if the donation is for the specific event type before showing the thank you message
    // If no donationType is specified or it matches "Jesus March 2025 - Boston", show it
    const donationType = message.data?.donationType;
    const isTargetEvent = !donationType || donationType === "Jesus March 2025 - Boston";

    if (isTargetEvent) {
      // Get the donation amount
      const newAmount = message.data?.amount || 0;

      // Show the donation
      showDonation({
        amount: newAmount,
        user: message.data?.user || 'Anonymous',
        date: new Date()
      });

      // Update the amount raised based on recent total
      setAmountRaised(prev => {
        const updated = prev + newAmount;
        return updated;
      });

      // Update the recent total
      setRecentTotal(prev => prev + newAmount);

      // Add to recent donations
      if (message.data) {
        const newDonation: PaymentData = {
          _id: new Date().getTime().toString(),
          amount: newAmount,
          name: message.data.user || 'Anonymous',
          dateCreated: new Date().toISOString(),
          anonymous: !message.data.user,
          donationType: message.data.donationType
        };

        setRecentDonations(prev => [newDonation, ...prev.slice(0, 9)]); // Keep only 10 most recent
      }
    }
  });

  const percentage = Math.floor((amountRaised / goal) * 100);

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

          <MainContentContainer>
            <AnimatePresence mode="wait">
              {showThankYou && currentDonation ? (
                <motion.div
                  key="thank-you"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Amount>${currentDonation.amount.toLocaleString()} - {currentDonation.user}</Amount>
                  <ThankYouMessage>
                    Thank you {currentDonation.user} for donating ${currentDonation.amount.toLocaleString()}!
                  </ThankYouMessage>
                </motion.div>
              ) : (
                <motion.div
                  key="progress-bar"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%' }}
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
          </MainContentContainer>
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

const MainContentContainer = styled.div`
  width: 100%;
  max-width: 800px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  overflow: hidden;
  border-radius: 4px;
`;

const ThankYouMessage = styled.div`
  color: #4CAF50;
  font-size: 30px;
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
`;

const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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
  font-size: 34px;
  color: white;
  font-weight: bold;
  text-align: center;
`;

interface ConfettiData {
  content?: string;
  lifetime?: any;
}

export default LivePayments;
