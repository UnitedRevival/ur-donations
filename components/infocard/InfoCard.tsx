import * as React from 'react';
import styled from 'styled-components';
import Card from '../card/Card';
import FundCounter from '../fundcounter/FundCounter';
import CheckFilled from '../icons/CheckFilled';

const Root = styled(Card)`
  display: flex;
  justify-content: center;
  align-items: center;

  flex-direction: column;

  overflow: hidden;
  width: 100%;

  margin-bottom: 2rem;
`;

const Image = styled.img`
  height: 300px;
  object-fit: cover;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 1rem;
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.gray};
`;

const TaxText = styled.p`
  color: ${({ theme }) => theme.colors.black};
  font-weight: 600;
`;

const Content = styled.div`
  padding: 2rem 2rem 0 2rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2rem;
`;

const IconContainer = styled.div`
  margin-right: 0.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InfoCard = () => {
  return (
    <Root noPad>
      <Image src="/infoPic.jpg" />
      <Content>
        <Title>Fund Jesus March 2023</Title>
        <Text>
          For 2023, we are planning to march through the cities of Dallas,
          Phoenix, Denver, Tampa, Santa Monica, Portland, Seattle, San
          Fransisco, and Sacramento. We need your help to cover costs for sound
          equipment rental, hotel & travel expenses for our team, city permits,
          and more.
        </Text>
        <Flex>
          <IconContainer>
            <CheckFilled />
          </IconContainer>
          <TaxText>Your donation is tax deductible</TaxText>
        </Flex>
      </Content>

      <FundCounter />
    </Root>
  );
};

export default InfoCard;
