import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { getTotalDonationAmount } from './api/donations';
import { HomePageProvider } from '../contexts/HomePageContext';
import Payment from '../components/payment/Payment';
import { StepContextProvider } from '../contexts/StepContext';
import styled from 'styled-components';
import InfoCard from '../components/infocard/InfoCard';
import { GetStaticProps } from 'next';
import Navbar from '../components/navbar/Navbar';
import { currentCampaign } from './api/stripeEvent';

interface HomePageProps {
  amountRaised: number;
}

const ThanksText = styled.h2`
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    margin-top: 16px;
  }
  margin-top: 0;
  margin-bottom: 16px;
`;

const cardText =
  'As we march and worship Jesus in Washington D.C, just one week before the election, your donation will help bring believers together to proclaim His name and spread a message of hope. This is a crucial moment for our nation, and your support can make this event a powerful witness of faith and unity. Every contribution makes a difference—thank you for helping us shine His light in these pivotal times!';

export default function DC(props: HomePageProps) {
  return (
    <HomePageProvider data={props}>
      <Navbar />
      <div>
        <Head>
          <meta name="description" content="Give to support DC March 2025" />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <main className={styles.main}>
          <ThanksText>Thanks for Signing Up</ThanksText>
          <Content>
            <InfoCard
              hideProgress={true}
              cardImg="/dc3.jpg"
              txt={cardText}
              title="Help Fund One Nation Under God"
            >
              <StepContextProvider>
                <Payment />
              </StepContextProvider>
            </InfoCard>
          </Content>
        </main>
      </div>
    </HomePageProvider>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const totals = await getTotalDonationAmount();

  const jesusMarchDonations = totals.find(
    (t) => t._id === currentCampaign.title
  );

  return {
    props: {
      amountRaised: jesusMarchDonations?.total || 0,
      goal: currentCampaign.goal,
    },
    revalidate: 60 * 60 * 7,
  };
};

const Content = styled.div`
  max-width: 615px;
`;
