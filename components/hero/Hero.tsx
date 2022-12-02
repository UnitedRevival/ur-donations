import * as React from 'react';
import styled from 'styled-components';
import PrimaryButton from '../buttons/PrimaryButton';

const Hero = () => {
  return (
    <HeroContainer>
      <HeroContent>
        <Title>Join The March Across America</Title>
        <Description>
          "Have no fear of perfection
          <br />- you'll never catch it"
        </Description>
        <Filler />
        <PrimaryButton variant="large" width="70%">
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

  height: 800px;
  width: 100%;

  padding: 0px 4% 0px 6%;

  margin-bottom: 500px;
`;

const Title = styled.h1`
  margin-bottom: 1.4rem;
  font-size: 3.8rem;
  line-height: 1.4;
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
  max-width: 500px;
  width: 100%;
  height: 90%;
  padding: 2rem 1rem 4rem 0px;

  border-bottom: 1px solid #dedede;
`;

const HeroVideo = styled.div`
  width: 60%;
  max-width: 1100px;
  background-color: #000;
  height: 80%;

  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius}px;

  &::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 50%;
    background-color: ${(props) => props.theme.colors.primary};
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
    background-color: black;
    border-radius: ${({ theme }) => theme.borderRadius}px;
  }
`;

export default Hero;
