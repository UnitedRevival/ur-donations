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

interface CenteredLoaderProps {
  color?: string;
}

const CenteredLoader: React.FC<CenteredLoaderProps> = ({ color }) => {
  return (
    <Centered>
      <DefaultLoader color={color} />
    </Centered>
  );
};

export default CenteredLoader;
