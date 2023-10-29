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

interface HomePageProps {
  amountRaised: number;
}

const videos = {
  mobile: 'v3jgq60b32',
  desktop: 'ygquena5g1',
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
      id: videoId,
      onReady: function (video) {
        video.play();
        setVideoRef(video);
      },
    });

    return () => {};
  }, []);

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
