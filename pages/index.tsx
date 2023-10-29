import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Hero from '../components/hero/Hero';
import HomeAccents from '../components/accents/HomeAccents';
import { getTotalDonationAmount } from './api/donations';
import { HomePageProvider } from '../contexts/HomePageContext';
import Payment from '../components/payment/Payment';
import { StepContextProvider } from '../contexts/StepContext';
import styled from 'styled-components';
import InfoCard from '../components/infocard/InfoCard';
import { GetStaticProps } from 'next';

interface HomePageProps {
  amountRaised: number;
}

export default function Home(props: HomePageProps) {
  return (
    <HomePageProvider data={props}>
      <div className={styles.container}>
        <Head>
          <meta
            name="description"
            content="Give to support Jesus Marches in 2023"
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <main className={styles.main}>
          <HomeAccents>
            <Hero></Hero>
          </HomeAccents>

          <Content>
            <InfoCard />
            <StepContextProvider>
              <Payment />
            </StepContextProvider>
          </Content>
        </main>

        <footer className={styles.footer}></footer>
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
  max-width: 600px;
  margin: 0 0.5rem;
`;
