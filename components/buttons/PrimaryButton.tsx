import React from 'react';
import styled from 'styled-components';

interface PrimaryButtonProps {
  children: any;
  variant?: 'small' | 'large';
  height?: number;
  fullWidth?: boolean;
  width?: string;

  disabled?: boolean;

  onClick: (e: any) => any;
}

const StyledButton = styled.button<PrimaryButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => (props.width ? 'width: ' + props.width + ';' : '')};
  ${(props) => (props.fullWidth ? 'width: 100%;' : '')}

  ${(props) =>
    props.variant === 'large'
      ? `
      height:  ${props.height || '75'}px;  
    `
      : `
        
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
  `}
  padding-left: 1rem;
  padding-right: 1rem;

  outline: none;
  background-color: ${(props) => props.theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius}px;
  cursor: pointer;
  transition: all 0.1s linear;
  font-size: 1.2rem;
  font-weight: bold;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.darkGray};
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover {
    background-color: #444;
  }
`;

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  ...props
}) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default PrimaryButton;
