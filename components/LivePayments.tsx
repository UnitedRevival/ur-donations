import React, { useContext, useEffect, useState } from 'react';
import * as Ably from 'ably';
import {
  AblyProvider,
  useChannel,
  useConnectionStateListener,
} from 'ably/react';
// import axios from 'axios';
import styled from 'styled-components';
import { HomePageContext } from '../contexts/HomePageContext';
import { motion, AnimatePresence } from 'framer-motion';

const LivePayments = () => {
  const [ablyClient] = useState(
    new Ably.Realtime.Promise({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
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

const DonationPayments = () => {
  const [donationQueue, setDonationQueue] = useState<LiveDonationData[]>([]);
  const { amountRaised, goal, setAmountRaised } = useContext(HomePageContext);

  useEffect(() => {
    const id = setInterval(() => {
      if (donationQueue.length > 0) {
        const current = donationQueue[0];
        if (current.life <= 0) {
          donationQueue.shift();
          setDonationQueue([...donationQueue]);
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
  };

  useConnectionStateListener('connected', () => {
    console.log('Connected to Ably!');
  });

  // Create a channel called 'get-started' and subscribe to all messages with the name 'first' using the useChannel hook
  const { channel } = useChannel('payments', 'newPayment', (message) => {
    push({ ...message.data, date: new Date(), life: 5 });
    setAmountRaised((prev) => {
      return prev + (message.data?.amount || 0);
    });
  });

  const percentage = Math.floor((amountRaised / goal) * 100);
  const progressVisible = donationQueue.length === 0;

  return (
    <Root>
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
                    <AmountRaisedText> ${amountRaised}</AmountRaisedText>
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

          {!progressVisible && (
            <motion.div
              key="userDonation"
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 30,
              }}
              transition={{
                duration: 0.3,
                delay: 0.1,
              }}
            >
              <UserDonation>
                <AnimatePresence mode="wait">
                  <motion.div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1,
                    }}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    key={`${donationQueue[0].date.getTime()}`}
                  >
                    <Amount>${donationQueue[0].amount}</Amount>
                    <UserText>{donationQueue[0].user}</UserText>
                  </motion.div>
                </AnimatePresence>
              </UserDonation>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimateContainer>

      {/* <button
        onClick={async () => {
          const res = await axios.post('/api/test');

          console.log('OK!', res);
        }}
      >
        Publish
      </button> */}
    </Root>
  );
};

const UserText = styled.p`
  color: white;
  font-size: 24px;
  margin-left: 8px;
`;

const UserDonation = styled.div`
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
const Root = styled.div`
  width: 100%;
  margin-left: 16px;
  margin-right: 16px;
`;

const AnimateContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: black;
  color: white;
  padding: 16px 12px;
  overflow: hidden;
  border-radius: 4px;

  height: 86px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  color: white;

  overflow: hidden;
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

const AmountRaisedText = styled.span`
  font-size: 26px;
  color: white;
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

const Amount = styled.p`
  font-size: 26px;
  color: white;
  margin-right: 8px;
`;

export default LivePayments;
