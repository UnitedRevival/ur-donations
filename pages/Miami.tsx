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

export default function Miami(props: HomePageProps) {
  return (
    <HomePageProvider data={props}>
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
            <InfoCard hideProgress={true}>
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
