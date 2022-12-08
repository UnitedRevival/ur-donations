import styled, { keyframes } from 'styled-components';

const RotationAnimation = keyframes`
 
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    
`;

interface DefaultLoaderProps {
  color?: string;
}

const DefaultLoader = styled.span<DefaultLoaderProps>`
  width: 2rem;
  height: 2rem;
  border: 4px solid ${({ color }) => (color ? color : 'white')};
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: ${RotationAnimation} 1s linear infinite;
`;

export default DefaultLoader;
