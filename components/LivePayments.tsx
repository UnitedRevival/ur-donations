import React, { useState } from 'react';
import * as Ably from 'ably';
import {
  AblyProvider,
  useChannel,
  useConnectionStateListener,
} from 'ably/react';
import axios from 'axios';
import styled from 'styled-components';

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
}

const DonationPayments = () => {
  const [donationQueue, setDonationQueue] = useState<LiveDonationData[]>([]);

  const push = (donation: LiveDonationData) => {
    setDonationQueue((prev) => [...prev, donation]);
  };

  useConnectionStateListener('connected', () => {
    console.log('Connected to Ably!');
  });

  // Create a channel called 'get-started' and subscribe to all messages with the name 'first' using the useChannel hook
  const { channel } = useChannel('payments', 'newPayment', (message) => {
    console.log('DATA: ', message.data);
    push(message.data);
  });

  return (
    <div>
      <RootPayments>
        {donationQueue.map((v) => (
          <NewPayment {...v} />
        ))}
      </RootPayments>
      QueueData:
      <p>{JSON.stringify(donationQueue)}</p>
      <button
        onClick={async () => {
          const res = await axios.post('/api/test');

          console.log('OK!', res);
        }}
      >
        Publish
      </button>
    </div>
  );
};

const RootPayments = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NewPaymentRoot = styled.div`
  padding: 8px;
  background-color: black;
  width: 200px;
  border-radius: 4px;
  margin-bottom: 4px;
`;

const Amount = styled.p`
  font-size: 16px;
  color: white;
`;

const User = styled.p`
  font-size: 14px;
  color: white;
  opacity: 0.8;
`;

const NewPayment = ({ amount, user }) => {
  return (
    <NewPaymentRoot>
      <Amount>${amount}</Amount>
      <User>{user}</User>
    </NewPaymentRoot>
  );
};

export default LivePayments;
