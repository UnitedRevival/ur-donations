import * as React from 'react';
import styled from 'styled-components';
import Bar from '../accents/Bar';
import PrimaryButton from '../buttons/PrimaryButton';

const Hero = () => {
  return (
    <HeroContainer>
      <HeroContent>
        <Bar />
        <Title>Join The March Across America</Title>
        <Description>
          "Have no fear of perfection
          <br />- you'll never catch it"
        </Description>
        <Filler />
        <PrimaryButton variant="large" width="60%">
          Donate
        </PrimaryButton>
      </HeroContent>
      <HeroVideo />
    </HeroContainer>
  );
};

const HeroContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;

  padding: 0px 4% 0px 6%;

  margin-bottom: 500px;
  margin-top: 100px;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    flex-direction: column;
    align-items: center;
  }
`;

const Title = styled.h1`
  margin-bottom: 1.4rem;
  font-size: 3.8rem;
  line-height: 1.2;
  letter-spacing: 1.2px;

  color: ${({ theme }) => theme.colors.black};
`;

const Description = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  color: #888;

  font-weight: 500;
`;

const Filler = styled.div`
  background-color: #ededed;
  height: 80px;
  width: 100%;

  margin-bottom: 2.5rem;
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  max-width: 460px;
  width: 100%;
  height: 90%;
  padding: 2rem 0px 4rem 0px;

  margin-right: 2rem;

  border-bottom: 1px solid #dedede;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    justify-content: center;
    align-items: center;
  }
`;

const HeroVideo = styled.div`
  width: 60%;
  max-width: 1100px;
  background-color: ${({ theme }) => theme.colors.black};
  height: 500px;

  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius}px;

  &::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 50%;
    background-color: ${({ theme }) => theme.colors.primary};
    z-index: -1;
    bottom: -80px;
    right: -150px;

    border-radius: ${({ theme }) => theme.borderRadius}px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -25px;
    right: -50px;
    width: 80%;

    height: 2px;
    background-color: ${({ theme }) => theme.colors.black};
    border-radius: ${({ theme }) => theme.borderRadius}px;
  }
`;

export default Hero;
