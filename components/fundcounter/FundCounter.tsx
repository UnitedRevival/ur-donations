import React, { useContext } from 'react';
import FlexHorizontal from '../flex/FlexHorizontal';
import styles from './FundCounter.module.css';
import styled from 'styled-components';
import { HomePageContext } from '../../contexts/HomePageContext';

interface ProgressBarProps {
  percentage: number | string;
}

const ProgressBar = styled.div<ProgressBarProps>`
  width: ${(props) => props.percentage || '0'}%;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 16px;
  height: 100%;
`;

const goal = 30000;
const FundCounter = () => {
  const { amountRaised } = useContext(HomePageContext);

  const percentage = Math.floor((amountRaised / goal) * 100);
  // const percentage = 50;

  return (
    <div className={styles.container}>
      <p className={styles.progressText}>Sacramento Jesus March Funding</p>
      <FlexHorizontal>
        <div className={styles.progressBarContainer}>
          <ProgressBar percentage={percentage} />
        </div>
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
