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

interface HomePageProps {
  amountRaised: number;
}

export default function Home(props: HomePageProps) {
  return (
    <HomePageProvider data={props}>
      <Navbar />
      <div>
        <Head>
          <meta
            name="description"
            content="Give to support Jesus Marches in 2024"
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

  const jesusMarchDonations = totals.find((t) => t._id === 'Jesus March');

  return {
    props: {
      amountRaised: jesusMarchDonations?.total || 0,
    },
    revalidate: 60 * 60 * 7,
  };
};

const Content = styled.div`
  max-width: 615px;
`;
