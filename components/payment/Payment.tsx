import * as React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useStepper } from '../../contexts/StepContext';

import Tabs, { Tab } from '../tabs/Tabs';
import { useState, useRef } from 'react';
import ExpandablePanel from '../panel/ExpandablePanel';
import Subscription from './Subscription';
import SinglePayment from './SinglePayment';

const Root = styled.div`
  margin-bottom: 2rem;
  // min-height: 400px;
`;

const Payment = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { step } = useStepper();
  const heartElem = useRef<HTMLDivElement>(null);

  const addHeart = () => {
    const particle = document.createElement('div');
    particle.classList.add('heart-particle');
    heartElem.current?.appendChild(particle);

    setTimeout(() => {
      particle.classList.add('particle-float');
      setTimeout(() => {
        particle.remove();
      }, 2300);
    }, 1);
  };

  return (
    <Root id="scrollTitle2">
      <Tabs
        selectedIndex={selectedTab}
        onChange={(changedIndex) => {
          if (changedIndex === 0) addHeart();
          setSelectedTab(changedIndex);
        }}
      >
        <Tab>
          Monthly
          <Heart selected={selectedTab === 0} ref={heartElem} />
        </Tab>
        <Tab>One Time</Tab>
      </Tabs>

      <ExpandablePanel
        animateKey={`${step}-${selectedTab}`}
        slide={selectedTab === 0 ? 'Right' : 'Left'}
      >
        {selectedTab === 0 && <Subscription />}
        {selectedTab === 1 && <SinglePayment step={step} />}
      </ExpandablePanel>
    </Root>
  );
};

const growAnimation = keyframes`
    0% {
        transform: scale(1) rotate(45deg);
    }
    5% {
        transform: scale(1.3) rotate(55deg);
    }
    10% {
        transform: scale(1) rotate(45deg);
    }
    100% {
        transform: scale(1) rotate(45deg);
    }  
`;

interface HeartProps {
  selected?: boolean;
}

const Heart = styled.div<HeartProps>`
  margin-left: 1rem;
  opacity: 1;
  width: 0.5rem;
  height: 0.5rem;
  position: relative;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.heartRed : theme.colors.light};
  transition: all 0.1s ease-in;

  ${({ selected }) =>
    selected
      ? ''
      : css`
          animation: ${growAnimation} 5s ease-in infinite;
        `};

  animation-delay: 1s;
  transform: rotate(45deg);
  &:before,
  &:after {
    position: absolute;
    content: '';
    border-radius: 100px;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    transition: all 0.1s ease-in;
    background-color: ${({ theme, selected }) =>
      selected ? theme.colors.heartRed : theme.colors.light};
  }
  &:before {
    transform: translateX(-50%);
  }
  &:after {
    transform: translateY(-50%);
  }
`;

export default Payment;
