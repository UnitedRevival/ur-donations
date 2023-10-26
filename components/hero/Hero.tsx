import React from 'react';
import styled from 'styled-components';
import Bar from '../accents/Bar';
import PrimaryButton from '../buttons/PrimaryButton';

export const Hero2 = () => {
  const onClick = () => {
    const elem = document.getElementById('scrollTitle2');
    elem?.scrollIntoView();
  };

  return (
    <Hero2Container>
      <Hero2Content>
        <Bar />
        <Title2>
          Jesus Marches are Spreading Revival All Over America, but we need YOUR
          help.
        </Title2>
        <Description2>
          How YOU can turn a small movement into a nationwide revival.
        </Description2>
      </Hero2Content>
      <HeroVideo2>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/0VayRyrzmu0"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </HeroVideo2>
      <CTAButton2 variant="large" width="60%" onClick={onClick}>
        Partner with Jesus March
      </CTAButton2>
    </Hero2Container>
  );
};

const Hero = ({ paymentVisible, videoId }) => {
  const onClick = () => {
    const elem = document.getElementById('scrollTitle');
    elem?.scrollIntoView();
  };

  return (
    <HeroContainer>
      <HeroContent>
        <Title>Watch 2024 Jesus March Update</Title>
      </HeroContent>
      <HeroVideo>
        <iframe
          src={`//fast.wistia.net/embed/iframe/${videoId}?seo=true`}
          allowtransparency="true"
          frameborder="0"
          scrolling="no"
          class="wistia_embed"
          name="wistia_embed"
          allowfullscreen
          mozallowfullscreen
          webkitallowfullscreen
          oallowfullscreen
          msallowfullscreen
          width="100%"
          height="100%"
        ></iframe>
      </HeroVideo>
      <ButtonContainer>
        {paymentVisible && (
          <CTAButton variant="large" width="50%" onClick={onClick}>
            Give Now
          </CTAButton>
        )}
      </ButtonContainer>
    </HeroContainer>
  );
};

const CTAButton = styled(PrimaryButton)`
  min-width: 150px;
`;

const CTAButton2 = styled(PrimaryButton)`
  font-weight: 700;
  margin-top: 6rem;

  font-size: 1.2rem;
  width: 70%;
  min-width: 300px;
  max-width: 800px;
  margin-right: 2rem;
  margin-left: 2rem;
  box-sizing: border-box;
`;

const ButtonContainer = styled.div`
  min-height: 150px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeroContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;

  padding: 0px 2rem 0px 6%;

  margin-bottom: 12rem;
  margin-top: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    flex-direction: column;
    align-items: center;
  }
`;

const Hero2Container = styled(HeroContainer)`
  flex-direction: column;
  align-items: center;
  padding: 0px 2rem;
  margin-top 20px;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 3rem;
  line-height: 1.2;
  letter-spacing: 1.2px;

  color: ${({ theme }) => theme.colors.black};
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    font-size: 2.6rem;
  }
`;

const Title2 = styled(Title)`
  text-align: center;
  font-size: 4rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    font-size: 3.1rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    font-size: 2.2rem;
  }
`;

const Description = styled.p`
  font-size: 1.3rem;
  margin-bottom: 4rem;
  color: #888;

  font-weight: 500;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    text-align: center;
    font-size: 1rem;
  }
`;

const Description2 = styled(Description)`
  max-width: 400px;
  text-align: center;
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
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90%;
  padding: 2rem 0px 0rem 0px;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    padding: 2rem 0px 0rem 0px;
    margin-right: 0;
  }
`;

const Hero2Content = styled(HeroContent)`
  max-width: 900px;

  justify-content: center;
  align-items: center;
  padding: 1rem 2rem 0rem 2rem;
  margin-right: 0;
  border-bottom: none;

  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    padding: 2rem 2rem 0rem 2rem;
  }
`;

const HeroVideo = styled.div`
  width: 100%;

  max-width: 1100px;
  background-color: ${({ theme }) => theme.colors.black};
  height: 700px;

  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius}px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeroVideo2 = styled(HeroVideo)`
  margin-top: 0.5rem;
  width: 100%;
  &::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.light};
    z-index: -1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    border-radius: ${({ theme }) => theme.borderRadius}px;
  }
`;

export default Hero;
