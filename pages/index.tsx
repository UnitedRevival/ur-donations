import Head from 'next/head';
import AmountPicker from '../components/amountpicker/AmountPicker';
import PrimaryButton from '../components/buttons/PrimaryButton';
import FundCounter from '../components/fundcounter/FundCounter';
import styles from '../styles/Home.module.css';
import styled from 'styled-components';

const Hero = styled.div`
  width: 100%;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

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
        <Hero>
          <Center>
            <div>
              <h1 className={styles.mainheader}>
                Join The March Across America
              </h1>
              <PrimaryButton>Donate</PrimaryButton>
            </div>
            <div className={styles.video}></div>
          </Center>
        </Hero>
        <FundCounter />
        <AmountPicker />
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
