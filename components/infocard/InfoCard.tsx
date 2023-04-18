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
        <Title id="scrollTitle">Transform Lives Through Your Generosity</Title>
        <Text>
          Your generosity can make a significant impact in the lives of those
          who have never heard about Jesus. Every year, millions of people in
          the United States die without ever having the chance to know Him. By
          towards the Jesus Marches, you have the power to bring hope to those
          who are struggling and to be a part of the incredible work that God is
          doing. Your support can help us host more Jesus Marches, reach more
          people with the Gospel, and transform more lives. Will you partner
          with God's vision and help bring hope to the lost by making a donation
          today?
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
