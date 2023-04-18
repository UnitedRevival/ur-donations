import React from 'react';
import styled from 'styled-components';

interface ContainerProps {
  selected: boolean;
}

const Container = styled.div<ContainerProps>`
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  transition: 0.1s all linear;
  border-radius: ${({ theme }) => theme.borderRadius}px;
  border: ${(props) =>
    props.selected
      ? `1px solid ${props.theme.colors.primary}`
      : `1px solid ${props.theme.colors.light}`};

  cursor: pointer;

  ${(props) =>
    props.selected
      ? `
  outline: 3px solid ${props.theme.colors.primary}77;
  `
      : ''}
`;

export const AmountText = styled.p`
  text-align: center;
  font-size: 1.1rem;
`;

const QuickPickItem = ({ value, onSelect, selected }) => {
  return (
    <Container onClick={onSelect} selected={selected}>
      <AmountText>${value}</AmountText>
    </Container>
  );
};

export default QuickPickItem;
