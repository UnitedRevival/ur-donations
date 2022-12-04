import Head from 'next/head';
import AmountPicker from '../components/amountpicker/AmountPicker';
import PrimaryButton from '../components/buttons/PrimaryButton';
import FundCounter from '../components/fundcounter/FundCounter';
import styles from '../styles/Home.module.css';
import styled from 'styled-components';
import Hero from '../components/hero/Hero';
import HomeAccents from '../components/accents/HomeAccents';
import PaymentCard from '../components/payment/PaymentCard';
import { getTotalDonationAmount } from './api/donations';
import { HomePageProvider } from '../contexts/HomePageContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';

interface HomePageProps {
  amountRaised: number;
}

// @ts-ignore

export default function Home(props: HomePageProps) {
  const [stripePromise, setStripePromise] = useState<any>(null);

  useEffect(() => {
    if (!stripePromise) {
      const sPromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string);
      setStripePromise(sPromise);
    }
  }, []);
  return (
    <HomePageProvider data={props}>
      <div className={styles.container}>
        <Head>
          <meta name="description" content="Give to United Church" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <HomeAccents>
            <Hero></Hero>
          </HomeAccents>
          <FundCounter />
          <AmountPicker />

          <Elements stripe={stripePromise}>
            <PaymentCard />
          </Elements>
        </main>

        <footer className={styles.footer}></footer>
      </div>
    </HomePageProvider>
  );
}

export async function getServerSideProps(
  context
): Promise<{ props: HomePageProps }> {
  const totals = await getTotalDonationAmount();

  const jesusMarchDonations = totals.find((t) => t._id === 'Jesus March');

  return {
    props: {
      amountRaised: jesusMarchDonations?.total || 0,
    },
  };
}
