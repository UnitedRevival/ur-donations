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
import PrimaryButton from './buttons/PrimaryButton';
import SecondaryButton from './buttons/SecondaryButton';
import Confetti from './confetti/Confetti';
import AnimatedNumber from './animated/AnimatedNumber';

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

  // const [confetti, setConfetti] = useState<ConfettiData[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      if (donationQueue.length > 0) {
        const current = donationQueue[0];
        if (current.life <= 0) {
          donationQueue.shift();
          setDonationQueue([...donationQueue]);
          // setConfetti((prev) => {
          //   const newConfetti: ConfettiData = { content: '🔥', lifetime: 1 };
          //   return [...prev, newConfetti];
          // });
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
    push({ ...message.data, date: new Date(), life: 2 });
    setAmountRaised((prev) => {
      return prev + (message.data?.amount || 0);
    });
  });

  const percentage = Math.floor((amountRaised / goal) * 100);
  // const progressVisible = donationQueue.length === 0;
  const progressVisible = true;

  return (
    <Root>
      {/* <ConfettiContainer> */}
      {/* <AnimatePresence initial={true}> */}
      {/* {confetti.map((c, index) => (
          <Confetti key={index} mKey={index}>
            {c.content}
          </Confetti>
        ))} */}
      {/* </AnimatePresence> */}
      {/* </ConfettiContainer> */}
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
                  <UserDonation>
                    <AnimatePresence mode="wait">
                      {donationQueue?.length >= 1 && (
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
                      )}
                    </AnimatePresence>
                  </UserDonation>
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
                {/* <DotContainer>
                  {donationQueue.length > 1 &&
                    donationQueue.map((_, index) => (
                      <Dot key={index} active={index === 0} />
                    ))}
                </DotContainer> */}
              </UserDonation>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimateContainer>
      {/* <PrimaryButton
        onClick={() => {
          const amount = Math.floor(Math.random() * 1000);
          push({
            date: new Date(),
            life: 2,
            amount,
            user: 'Spicy P 🔥',
          });
          setAmountRaised((prev) => {
            return prev + (amount || 0);
          });
        }}
      >
        Add Test
      </PrimaryButton> */}
      {/* <CenterTest>
        <TestButton
          onClick={() => {
            setConfetti((prev) => {
              const newConfetti: ConfettiData = { content: '🔥', lifetime: 1 };
              return [...prev, newConfetti];
            });
          }}
        >
          Test
        </TestButton>
      </CenterTest> */}
    </Root>
  );
};

const ConfettiContainer = styled.div`
  position: relative;
  top: 50%;
  left 50%;
  z-index: 9999;
`;

// const CenterTest = styled.div`
//   width: 500px;
//   height: 500px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// const TestButton = styled.button`
//   background-color: inherit;
//   padding: 16px;
//   color: white;

//   border: 1px solid white;
//   border-radius: 7px;

//   font-weight: bold;

//   margin-top: 16px;

//   cursor: pointer;
// `;

// Money, pray hands, dove emoji 'confetti'
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
  flex-direction: column;
  height: 100%;
  right: 24px;
  position: relative;
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

const Amount = styled.p`
  font-size: 26px;
  color: white;
  margin-right: 8px;
`;

interface DotProps {
  active: boolean;
}

const DotContainer = styled.div`
  position: absolute;
  bottom: -12px;

  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;

const Dot = styled.div<DotProps>`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: white;
  margin-right: 8px;
  margin-left: 8px;
  opacity: ${(props) => (props.active ? 1 : 0.5)};
`;

interface ConfettiData {
  content?: string;
  lifetime?: any;
}

export default LivePayments;
