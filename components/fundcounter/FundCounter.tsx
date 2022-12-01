import React from 'react';
import FlexHorizontal from '../flex/FlexHorizontal';
import styles from './FundCounter.module.css';
import styled from 'styled-components';

interface ProgressBarProps {
  percentage: number | string;
}

const ProgressBar = styled.div<ProgressBarProps>`
  width: ${(props) => props.percentage || '0'}%;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 16px;
  height: 100%;
`;

const FundCounter = () => {
  const goal = 150000;
  const amount = 50000;
  const percentage = Math.floor((amount / goal) * 100);

  return (
    <div className={styles.container}>
      <p className={styles.progressText}>Progress</p>
      <FlexHorizontal>
        <div className={styles.progressBarContainer}>
          <ProgressBar percentage={percentage} />
        </div>
        <span className={styles.progressPercent}>{percentage}%</span>
      </FlexHorizontal>

      <FlexHorizontal>
        <span className={styles.amount}>${amount}</span>
        <span className={styles.secondaryText}>/ ${goal}</span>
      </FlexHorizontal>
    </div>
  );
};

export default FundCounter;
