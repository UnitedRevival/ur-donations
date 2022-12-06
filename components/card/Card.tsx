import * as React from 'react';
import styled from 'styled-components';

interface CardProps {
  noPad?: boolean;
}

const Card = styled.div<CardProps>`
  background-color: #fff;
  box-shadow: ${(props) => props.theme.boxShadow};
  padding: ${({ noPad }) => (noPad ? `0` : `2rem`)};

  box-sizing: border-box;

  border-radius: ${({ theme }) => theme.borderRadius}px;
`;

export default Card;
