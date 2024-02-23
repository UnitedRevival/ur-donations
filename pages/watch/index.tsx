import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import Hero, { HeroWatch } from '../../components/hero/Hero';
import HomeAccents from '../../components/accents/HomeAccents';
import { getTotalDonationAmount } from '../api/donations';
import { HomePageProvider } from '../../contexts/HomePageContext';
import Payment from '../../components/payment/Payment';
import { StepContextProvider } from '../../contexts/StepContext';
import styled from 'styled-components';
import InfoCard from '../../components/infocard/InfoCard';
import { GetStaticProps } from 'next';
import { useEffect, useLayoutEffect, useState } from 'react';
import { currentCampaign } from '../api/stripeEvent';

interface HomePageProps {
  amountRaised: number;
}

const videos = {
  mobile: {
    id: 'v3jgq60b32',
    title: 'Jesus March Ad 9/16 (Mobile) Video',
  },
  desktop: {
    id: 'ygquena5g1',
    title: 'Jesus March Ad (Desktop) Video',
  },
};

export default function Home(props: HomePageProps) {
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [videoRef, setVideoRef] = useState<any>(null);
  const [videoId, setVideoId] = useState(videos.mobile);

  useLayoutEffect(() => {
    if (window.innerWidth > 700) setVideoId(videos.desktop);
  }, []);

  useEffect(() => {
    // @ts-ignore
    window._wq = window._wq || [];

    // @ts-ignore
    _wq.push({
      id: videoId.id,
      onReady: function (video) {
        setVideoRef(video);
      },
    });

    return () => {
      // @ts-ignore
      _wq.pop();
      // @ts-ignore
    };
  }, [videoId.id]);

  useEffect(() => {
    const video = videoRef;

    if (!video) return;

    const onSecondChange = function (seconds) {
      if (seconds >= 12) {
        setPaymentVisible(true);
        video.unbind(onSecondChange);
      }
    };

    if (!paymentVisible) {
      video.bind('secondchange', onSecondChange);

      return () => {
        video.unbind(onSecondChange);
      };
    }
  }, [videoRef]);

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
            <HeroWatch
              videoId={videoId}
              paymentVisible={paymentVisible}
            ></HeroWatch>
          </HomeAccents>

          <Content>
            {paymentVisible && (
              <>
                <InfoCard />
                <StepContextProvider>
                  <Payment />
                </StepContextProvider>
              </>
            )}
          </Content>
        </main>

        <footer className={styles.footer}></footer>
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
  max-width: 600px;
  margin: 0 0.5rem;
`;
