import * as React from 'react';
import styled from 'styled-components';

const Bar = styled.div`
  width: 50px;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.black};
  margin-bottom: 2rem;

  border-radius: ${({ theme }) => theme.borderRadius}px;
`;

export default Bar;
