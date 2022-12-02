import Head from 'next/head';
import AmountPicker from '../components/amountpicker/AmountPicker';
import PrimaryButton from '../components/buttons/PrimaryButton';
import FundCounter from '../components/fundcounter/FundCounter';
import styles from '../styles/Home.module.css';
import styled from 'styled-components';
import Hero from '../components/hero/Hero';
import HomeAccents from '../components/accents/HomeAccents';
import PaymentCard from '../components/payment/PaymentCard';

// const Hero = styled.div`
//   width: 100%;
//   // background-color: #fff;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
// `;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 70%;
`;

export default function Home() {
  return (
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

        <PaymentCard />
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
