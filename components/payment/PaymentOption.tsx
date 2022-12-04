import * as React from 'react';
import styled, { useTheme } from 'styled-components';
import FlexHorizontal from '../flex/FlexHorizontal';
import CardIcon from '../icons/CardIcon';

const PaymentOption = ({ title, selected = false, onClick, children }) => {
  const theme = useTheme();
  return (
    <OptionContainer selected={selected} onClick={onClick}>
      <FlexBetween>
        <FlexHorizontal>
          <OptionTitle selected={selected}>{title}</OptionTitle>
        </FlexHorizontal>
        <CardIcon color={theme.colors.darkGray} />
      </FlexBetween>
      {children}
    </OptionContainer>
  );
};

const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

interface OptionContainerProps {
  selected?: boolean;
}

const RadioCircle = styled.div<OptionContainerProps>`
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  border: 4px solid
    ${({ theme, selected }) =>
      selected ? theme.colors.primary : theme.colors.light};
  margin-right: 0.5rem;
`;

const OptionContainer = styled.div<OptionContainerProps>`
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  // height: 50px;

  margin-bottom: 0.5rem;

  border-radius: ${({ theme }) => theme.borderRadius}px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.light};

  transition: 0.2s all linear;

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.black};
  }

  ${(props) =>
    props.selected
      ? `
          border: 1px solid ${props.theme.colors.primary};
          outline: 4px solid ${props.theme.colors.primary}44;
  `
      : ''}
`;

const OptionTitle = styled.p<OptionContainerProps>`
  font-weight: bold;

  color: ${(props) => props.theme.colors.darkGray};
`;

export default PaymentOption;
