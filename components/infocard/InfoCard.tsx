import * as React from 'react';
import styled from 'styled-components';
import Card from '../card/Card';
import CheckFilled from '../icons/CheckFilled';
import FundCounter from '../fundcounter/FundCounter';

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
  height: 185px;
  object-fit: cover;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 0.5rem;
  font-size: 21px;

  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    font-size: 24px;
  }
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.black};
`;

const TaxText = styled.p`
  color: ${({ theme }) => theme.colors.black};
  font-weight: 600;
`;

const Content = styled.div`
  padding: 1rem 1.5rem 0 1.5rem;
  width: 100%;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const IconContainer = styled.div`
  margin-right: 0.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface InfoCardProps {
  children?: any;
  hideProgress?: boolean;
  hideImg?: boolean;
  hideTxt?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
  children,
  hideProgress,
  hideImg,
  hideTxt,
}) => {
  return (
    <Root noPad>
      {!hideImg && <Image src="/infoPic.jpg" />}
      <Content>
        <Title>Help Fund Jesus March 2024</Title>
        {!hideTxt && (
          <Text>
            Partner with the Jesus March by making a donation to help us reach 9
            cities across America in 2024. Your donation will help cover
            expenses like sound equipment rental, team travel, hotel
            accommodations, city permits, and more.
          </Text>
        )}

        {!hideProgress && <FundCounter />}
        <Flex>
          <IconContainer>
            <CheckFilled />
          </IconContainer>
          <TaxText id="scrollTitle">Your donation is tax deductible</TaxText>
        </Flex>
        {children}
      </Content>
    </Root>
  );
};

export default InfoCard;
