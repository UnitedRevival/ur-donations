import React from 'react';
import styled from 'styled-components';
import DefaultLoader from '../loaders/Default';

interface PrimaryButtonProps {
  children: any;
  variant?: 'small' | 'large';
  height?: number;
  fullWidth?: boolean;
  type?: any;
  width?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: any) => any;
  margin?: string;
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
      height: 4rem;  
    `
      : `
      height: 3rem; 
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
  font-size: 17px;

  ${(props) => (props.margin ? `margin: ${props.margin};` : '')}

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
  return (
    <StyledButton {...props}>
      {props.loading ? <DefaultLoader /> : children}
    </StyledButton>
  );
};

export default PrimaryButton;
