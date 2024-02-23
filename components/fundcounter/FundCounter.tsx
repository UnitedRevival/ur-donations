import React, { useContext } from 'react';
import FlexHorizontal from '../flex/FlexHorizontal';
import styles from './FundCounter.module.css';
import { HomePageContext } from '../../contexts/HomePageContext';
import ProgressBar from '../progress/ProgressBar';

const FundCounter = () => {
  const { amountRaised, goal } = useContext(HomePageContext);

  const percentage = Math.floor((amountRaised / goal) * 100);

  return (
    <div className={styles.container}>
      <FlexHorizontal>
        <ProgressBar percentage={percentage} />
        <span className={styles.progressPercent}>{percentage}%</span>
      </FlexHorizontal>

      <FlexHorizontal>
        <span className={styles.amount}>${amountRaised}</span>
        <span className={styles.secondaryText}>/ ${goal}</span>
      </FlexHorizontal>
    </div>
  );
};

export default FundCounter;
