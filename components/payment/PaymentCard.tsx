import * as React from 'react';
import Card from '../card/Card';
import styled from 'styled-components';

const Root = styled(Card)`
  min-width: 500px;

  margin-top: 4rem;
`;

const Title = styled.h2``;

const PaymentCard = () => {
  return (
    <Root>
      <Title>Payment</Title>
    </Root>
  );
};

export default PaymentCard;
