import * as React from 'react';
import { useContext } from 'react';
import styled, { useTheme } from 'styled-components';
import { HomePageContext } from '../../contexts/HomePageContext';
import Divider from '../dividers/Divider';
import CheckIcon from '../icons/CheckIcon';
import BoxLink from '../links/BoxLink';

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.black};
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.gray};
`;

const Field = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const FieldKey = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 1rem;
`;

const FieldResult = styled.p`
  color: ${({ theme }) => theme.colors.black};
  font-weight: bold;
  font-size: 1.2rem;
`;

const PaymentDetails = styled.div`
  // margin-top: 1rem;
  // margin-bottom: 1rem;
  width: 100%;
`;

const SuccessDisplay = () => {
  const theme = useTheme();
  const { amountToDonate } = useContext(HomePageContext);
  return (
    <Root>
      <CheckIcon color={theme.colors.black} />
      <Title>Payment successful</Title>
      <Text>Thank you for supporting the Jesus March!</Text>
      <Divider />

      <PaymentDetails>
        <Field>
          <FieldKey>Amount</FieldKey>
          <FieldResult>${amountToDonate}</FieldResult>
        </Field>
      </PaymentDetails>

      <Divider />
      <BoxLink href="https://www.instagram.com/unitedrevival/" fill="#000000">
        Follow us on Instagram
      </BoxLink>
      <BoxLink href="https://unitedrevival.org/jesus-march-2023/#tour">
        Jesus March Tour Dates
      </BoxLink>
    </Root>
  );
};

export default SuccessDisplay;
