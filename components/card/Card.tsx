import * as React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: #fff;
  box-shadow: ${(props) => props.theme.boxShadow};
  padding: 2rem;
  box-sizing: border-box;
`;

export default Card;
