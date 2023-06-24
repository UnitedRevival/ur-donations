import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { Hero2 } from '../../components/hero/Hero';
import HomeAccents from '../../components/accents/HomeAccents';
import { getTotalDonationAmount } from '../api/donations';
import { HomePageProvider } from '../../contexts/HomePageContext';
import Payment from '../../components/payment/Payment';
import { StepContextProvider } from '../../contexts/StepContext';
import styled from 'styled-components';
import InfoCard from '../../components/infocard/InfoCard';
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
            <Hero2></Hero2>
          </HomeAccents>

          <Content>
            {/* <InfoCard /> */}
            <LetterCopy>
              Dear fellow Chrisitan
              <br />
              <br />
              Ever since starting these marches back in 2020, we have seen
              thousands of people come to the Lord, and hundreds of healings
              break out.
              <br />
              <br />
              The revival that we have been talking about for generations is
              happening now!
              <br />
              <br />
              However, in order to bring about revival, it takes all of us. So
              we ask you to partner with us in bringing these marches.
              <br />
              <br />
              Each march costs us upwards of $20,000 and includes at least 20
              volunteers who come just to serve completely without any pay.
              <br />
              <br />
              We also believe in honestly stewarding all the funds, and we don't
              spend any finances unless they are used to promote the Gospel in
              every way possible.
              <br />
              <br />
              If it's on your heart and if, like us, you believe that these
              marches can restore our generation back to the Father, partner
              with us to promote the Gospel.
            </LetterCopy>
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

const LetterCopy = styled.p`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.black};

  padding: 1rem 0 4rem 0;
`;

const Content = styled.div`
  max-width: 600px;
  margin: 0 0.5rem;
  width: 100%;
`;
