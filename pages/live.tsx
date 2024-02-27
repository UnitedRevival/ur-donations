import Head from 'next/head';
import styles from '../styles/Home.module.css';
import styled from 'styled-components';
import Navbar from '../components/navbar/Navbar';
import LivePayments from '../components/LivePayments';

export default function Live() {
  return (
    <>
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
            <LivePayments />
          </Content>
        </main>
      </div>
    </>
  );
}

// export const getStaticProps: GetStaticProps = async (ctx) => {
//   const totals = await getTotalDonationAmount();

//   const jesusMarchDonations = totals.find(
//     (t) => t._id === currentCampaign.title
//   );

//   return {
//     props: {
//       amountRaised: jesusMarchDonations?.total || 0,
//       goal: currentCampaign.goal,
//     },
//     revalidate: 60 * 60 * 7,
//   };
// };

const Content = styled.div`
  max-width: 615px;
`;
