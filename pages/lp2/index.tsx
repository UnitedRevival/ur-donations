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
import FundCounter from '../../components/fundcounter/FundCounter';
import Card from '../../components/card/Card';
import { currentCampaign } from '../api/stripeEvent';

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
            <LetterCopy>
              Dear <strong>fellow christians</strong>
              <br />
              <br />
              If you want to see the young generation of Americans
              <u> set on fire and turn back to the Lord…</u>
              <br />
              <br />
              And you are tired of seeing young men and women lost to
              <strong>
                {' '}
                drugs, sexual confusion, alcohol, and the lusts of the flesh.
              </strong>
              <br />
              <br />
              Then this will be{' '}
              <strong>
                <u>the movement that can change that.</u>
              </strong>
              <br />
              <br />
              The revival that we have been talking about for generations is
              happening through these marches!
              <br />
              <br />
              In every city, we{' '}
              <u>
                witness healings, deliverances, and lives turning to Jesus.
              </u>{' '}
              Most importantly, our{' '}
              <strong>Gen Z generation is coming back to the Lord,</strong>{' '}
              surrendering, and committing their lives to an evangelistic
              lifestyle.
              <br />
              <br />
              However, doing these marches without your support is{' '}
              <strong>impossible.</strong>
              <br />
              <br />
              Every march costs over <strong>30 thousand dollars</strong>
              and requires weeks of preparation.
              <br />
              <br />
              Not only that, but{' '}
              <u>
                each event also requires permits, media equipment, and travel
                costs.
              </u>
              <br />
              <br />
              As we prepare for our <strong>next march in Portland</strong>, we
              ask that you would help meet these needs and partner with us
              financially.
              <br />
              <br />
              It is your donations, prayers and support that continue to make
              miraculous encounters happen.
            </LetterCopy>
            <FundCounterCard>
              <FundCounter />
            </FundCounterCard>
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

const FundCounterCard = styled(Card)`
  margin-bottom: 2rem;
  padding: 1rem;
`;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const totals = await getTotalDonationAmount();

  const jesusMarchDonations = totals.find(
    (t) => t._id === currentCampaign.title
  );

  return {
    props: {
      amountRaised: jesusMarchDonations?.total || 0,
      goal: currentCampaign.goal || 0,
    },
    revalidate: 60 * 60 * 7,
  };
};

const LetterCopy = styled.p`
  font-size: 1.7rem;
  color: ${({ theme }) => theme.colors.black};
  margin: 1rem 2rem 4rem 2rem;
`;

const Content = styled.div`
  max-width: 600px;

  width: 100%;
`;
