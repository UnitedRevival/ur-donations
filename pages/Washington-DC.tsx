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

// Define the props interface
interface HomePageProps {
  amountRaised: number;
  goal: number;
  cardTitle: string; // Add cardTitle to props
}

const Content = styled.div`
  max-width: 615px;
`;

export default function WashingtonDC({ amountRaised, goal, cardTitle }: HomePageProps) {
  return (
    <HomePageProvider data={{ amountRaised, goal }}>
      <Navbar />
      <div>
        <Head>
          <meta
            name="description"
            content="Give to support Jesus Marches in 2025"
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <main className={styles.main}>
          <Content>
            <InfoCard
              hideProgress={false}
              title={cardTitle} // Pass the cardTitle prop
              txt={'If God leads you to give, your partnership will help bring the Jesus March to Washington, D.C. on October 11th. Every gift helps cover the practical needs — sound, permits, and travel — that carry this movement forward'}
              cardImg={'/DSC.JPG'}
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
    (t) => t._id === current_Diffrent_campaigns.JESUS_MARCH_2025_WASHINGTON_DC.title
  );

  return {
    props: {
      amountRaised: jesusMarchDonations?.total || 0,
      goal: current_Diffrent_campaigns.JESUS_MARCH_2025_WASHINGTON_DC.goal,
      cardTitle: 'Thanks For Signing-Up For Jesus March Washington DC 2025',

      // Pass it through props
      // Or use currentCampaign.title if you want it dynamic:
      // cardTitle: currentCampaign.title || 'Help Fund Jesus March 2025',
    },
  };
};