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
  goal?: number;
}

export default function Home(props: HomePageProps) {
  return (
    <HomePageProvider data={props}>
      <div>
        <Head>
          <meta
            name="description"
            content="Give to support Jesus Marches in 2024"
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <Navbar leftAlign={true} />

        <main className={styles.main}>
          <Container>
            <Title>Help Fund Jesus March 2024</Title>
            <Flex>
              <InfoContent>
                <VideoContainer>
                  <div
                    className="wistia_responsive_padding"
                    style={{ paddingBottom: 0 }}
                  >
                    <div className="wistia_responsive_wrapper">
                      <iframe
                        src="https://fast.wistia.net/embed/iframe/gvggz847uk?seo=true&videoFoam=true"
                        title="New Give Page Video - Ivan 2 (no link)"
                        allow="autoplay; fullscreen"
                        allowTransparency={true}
                        frameBorder="0"
                        scrolling="no"
                        className="wistia_embed"
                        name="wistia_embed"
                        allowFullScreen
                        width="100%"
                        height="100%"
                      ></iframe>
                    </div>
                  </div>
                </VideoContainer>
                <TextContent>
                  <h2>
                    Join the Movement: 9 Cities, 1 Mission - Revive America
                  </h2>
                  <p>
                    Partner with the Jesus March by making a donation to help us
                    reach 9 cities across America in 2024. Your donation will
                    help cover expenses like sound equipment rental, team
                    travel, hotel accommodations, city permits, and more.
                  </p>
                </TextContent>
              </InfoContent>
              <SidePaymentContent>
                <InfoCard hideImg hideTxt hideProgress={false}>
                  <StepContextProvider>
                    <Payment />
                  </StepContextProvider>
                </InfoCard>
              </SidePaymentContent>
            </Flex>
          </Container>
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

const VideoContainer = styled.div`
  // max-width: 300px;
`;

// Make a div styled component that hides text when it reaches a mobile breakpoint
const TextContent = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    display: none;
  }
`;

const InfoContent = styled.div`
  width: 100%;
  margin-right: 0;
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    width: 60%;
    margin-right: 2rem;
  }
`;

const Container = styled.div`
  width: 100%;
  padding: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    padding-left: 3rem;
    padding-right: 3rem;
  }
`;

const Flex = styled.div`
  display: flex;

  flex-direction: column;
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    flex-direction: row;
  }
`;

const SidePaymentContent = styled.div`
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    width: 40%;
  }
`;

const Title = styled.h1`
  width: 100%;
  text-align: left;
  margin-bottom: 1rem;
  font-size: 36px;

  display: none;
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    flex-direction: row;
    display: block;
  }
`;
