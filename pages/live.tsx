import Head from 'next/head';
import styles from '../styles/Home.module.css';
import styled from 'styled-components';
import Navbar from '../components/navbar/Navbar';
import LivePayments from '../components/LivePayments';
import { GetStaticProps } from 'next';
import { getTotalDonationAmount } from './api/donations';
import { currentCampaign } from './api/stripeEvent';
import { HomePageProvider } from '../contexts/HomePageContext';

export default function Live(props) {
  return (
    <>
      {/* <Navbar /> */}
      <div>
        <Head>
          <meta
            name="description"
            content="Give to support Jesus Marches in 2024"
          />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <HomePageProvider data={props}>
          <main className={styles.main}>
            <Content>
              <LivePayments />
            </Content>
          </main>
        </HomePageProvider>
      </div>
    </>
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
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 615px;
  width: 100%;
  height: 100vh;
`;
