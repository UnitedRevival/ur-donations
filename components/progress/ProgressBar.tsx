import React from 'react';
import styled from 'styled-components';
import styles from './FundCounter.module.css';

interface ProgressBarProps {
  percentage: number | string;
}

const Root = styled.div`
  width: 100%;
  position: relative;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: #e8e8e8;
  height: 8px;
  border-radius: 16px;

  overflow: hidden;
`;

interface MilestoneProps {
  atPercent: number;
  title?: string;
}

const Milestone = styled.div<MilestoneProps>`
  height: 16px;
  width: 16px;
  border-radius: 100%;
  background-color: ${(props) => props.theme.colors.primary};

  position: absolute;
  top: -50%;
  left: ${(props) => props.atPercent}%;
`;

const ProgressBarStyled = styled.div<ProgressBarProps>`
  width: ${(props) => props.percentage || '0'}%;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 16px;
  height: 100%;
`;

const MilestoneTitle = styled.p`
  position: absolute;
  top: -24px;

  // background-color: red;
  opacity: 70%;
  font-size: 13px;
`;
const MilestoneAnchor = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  // background-color: blue;
`;

// Phoenix
// Santa monica, LA
// San Antoniio
// Tampa
// San Diego
// Portland
// Chicago
// Atlanta
// Sac
// Washington D.C.

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  return (
    <Root>
      {/* <Milestone atPercent={10}>
        <MilestoneAnchor>
          <MilestoneTitle>Phoenix</MilestoneTitle>
        </MilestoneAnchor>
      </Milestone>
      <Milestone atPercent={30} />
      <Milestone atPercent={50} /> */}
      <ProgressBarContainer>
        <ProgressBarStyled {...props}></ProgressBarStyled>
      </ProgressBarContainer>
    </Root>
  );
};

export default ProgressBar;
