import React, { useEffect } from 'react';
import styled from 'styled-components';
import Bar from '../accents/Bar';
import PrimaryButton from '../buttons/PrimaryButton';
import CheckFilled from '../icons/CheckFilled';

const Hero = () => {
  useEffect(() => {
    // 2. This code loads the IFrame Player API code asynchronously.
    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    // let player = new YT.Player('player', {
    //   height: '390',
    //   width: '640',
    //   videoId: 'M7lc1UVf-VE',
    //   playerVars: {
    //     playsinline: 1,
    //   },
    //   events: {
    //     onReady: onPlayerReady,
    //     onStateChange: onPlayerStateChange,
    //   },
    // });
  });

  const onClick = () => {
    const elem = document.getElementById('scrollTitle');
    elem?.scrollIntoView();
  };

  return (
    <HeroContainer>
      <HeroContent>
        <Bar />
        <Title>Help Fund Jesus March 2023</Title>
        <Description>
          Partner with us to see souls saved, lives transformed, and hearts
          reignited to share the Gospel in 9 Cities Across America in 2023.
        </Description>
        <PrimaryButton variant="large" width="60%" onClick={onClick}>
          Donate
        </PrimaryButton>
        <Filler>
          <CheckFilled color="#34b233" />
          <SubText>Registered Non-profit Organization</SubText>
        </Filler>
      </HeroContent>
      <HeroVideo>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/0VayRyrzmu0"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </HeroVideo>
    </HeroContainer>
  );
};

const HeroContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;

  padding: 0px 4% 0px 6%;

  margin-bottom: 12rem;
  margin-top: 100px;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    flex-direction: column;
    align-items: center;
    padding: 0px 2rem;
  }
`;

const Title = styled.h1`
  margin-bottom: 1.4rem;
  font-size: 3.3rem;
  line-height: 1.2;
  letter-spacing: 1.2px;

  color: ${({ theme }) => theme.colors.black};

  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    text-align: center;
  }
`;

const Description = styled.p`
  font-size: 1.3rem;
  margin-bottom: 4rem;
  color: #888;

  font-weight: 500;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    text-align: center;
  }
`;

const Filler = styled.div`
  height: 80px;
  width: 100%;

  margin-bottom: 2.5rem;

  border-radius: ${({ theme }) => theme.borderRadius}px;

  display: flex;
  align-items: center;
  padding: 1rem 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    justify-content: center;
  }
`;

const SubText = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  margin-left: 0.5rem;

  font-size: 1rem;
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
    padding: 2rem 0px 0rem 0px;
  }
`;

const HeroVideo = styled.div`
  width: 60%;

  max-width: 1100px;
  background-color: ${({ theme }) => theme.colors.black};
  height: 500px;

  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius}px;

  display: flex;
  justify-content: center;
  align-items: center;

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

  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    width: 400px;
  }
`;

export default Hero;
