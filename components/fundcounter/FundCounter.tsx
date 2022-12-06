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

const goal = 150000;
const FundCounter = () => {
  const { amountRaised } = useContext(HomePageContext);

  const percentage = Math.floor((amountRaised / goal) * 100);

  return (
    <div className={styles.container}>
      <p className={styles.progressText}>Progress</p>
      <FlexHorizontal>
        <div className={styles.progressBarContainer}>
          <ProgressBar percentage={70} />
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
