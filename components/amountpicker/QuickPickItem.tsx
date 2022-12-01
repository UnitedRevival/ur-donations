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
  border: ${(props) => (props.selected ? 'none' : '1px solid #e8e8e8')};
  box-shadow: ${(props) => (props.selected ? props.theme.boxShadow : 'none')};

  ${(props) => (props.selected ? '' : 'cursor: pointer;')}
`;

const AmountText = styled.p`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
`;

const QuickPickItem = ({ value, onSelect, selected }) => {
  return (
    <Container onClick={onSelect} selected={selected}>
      <AmountText>${value}</AmountText>
    </Container>
  );
};

export default QuickPickItem;
