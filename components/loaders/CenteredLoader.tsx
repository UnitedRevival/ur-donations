import * as React from 'react';
import styled from 'styled-components';
import DefaultLoader from './Default';

export const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  box-sizing: border-box;
  padding: 1rem;
`;

const CenteredLoader = () => {
  return (
    <Centered>
      <DefaultLoader />
    </Centered>
  );
};

export default CenteredLoader;
