import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { getTotalDonationAmount } from './api/donations';
import { HomePageProvider } from '../contexts/HomePageContext';
import Payment from '../components/payment/Payment';
import { StepContextProvider } from '../contexts/StepContext';
import styled from 'styled-components';
import InfoCard from '../components/infocard/InfoCard';
import { GetServerSideProps } from 'next';
import Navbar from '../components/navbar/Navbar';
import { currentCampaign, current_Diffrent_campaigns } from './api/stripeEvent';
import { CAMPAIGN_YEAR } from '../lib/campaign';

// Define the props interface
interface HomePageProps {
  amountRaised: number;
  goal: number;
  cardTitle: string;
  cardSubtitle: string;
  cardText: string;
}

const Content = styled.div`
  max-width: 615px;
`;

export default function SanDiegoEvent({ amountRaised, goal, cardTitle, cardSubtitle, cardText }: HomePageProps) {
  return (
    <HomePageProvider data={{ amountRaised, goal }}>
      <Navbar />
      <div>
        <Head>
          <meta
            name="description"
            content={`Give to support Jesus Marches in ${CAMPAIGN_YEAR}`}
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <main className={styles.main}>
          <Content>
            <InfoCard 
              hideProgress={false}
              title={cardTitle}
              subtitle={cardSubtitle}
              txt={cardText}
              isH1={true}
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

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (ctx) => {
  const totals = await getTotalDonationAmount();
    const jesusMarchDonations = totals.find(
      (t) => t._id === current_Diffrent_campaigns.JESUS_MARCH_2026_SAN_DIEGO.title
    );
  
    return {
      props: {
        amountRaised: jesusMarchDonations?.total || 0,
        goal: current_Diffrent_campaigns.JESUS_MARCH_2026_SAN_DIEGO.goal,
        cardTitle: `You're Registered for San Diego Jesus March ${CAMPAIGN_YEAR}`,
        cardSubtitle: 'Want to support the mission?',
        cardText: "Thank you for signing up for San Diego Jesus March. Your registration is confirmed and we'll send you event details soon.. If you feel led to support the mission, you can make a donation below, but it is completely optional and not required to attend. We can't wait to see you at the Jesus March",
    }
  };
};