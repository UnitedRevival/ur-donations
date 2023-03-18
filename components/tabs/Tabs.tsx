import { Children, cloneElement } from 'react';
import styled from 'styled-components';

interface TabsProps {
  children?: any;
  selectedIndex: number;
  onChange: any;
}

interface TabProps {
  children?: any;
  active?: boolean;
  onChange?: any;
  index?: any;
}

export const Tab: React.FC<TabProps> = (props) => {
  const { children, onChange, index } = props;
  return (
    <TabContainer onClick={() => onChange(index)} {...props}>
      {children}
    </TabContainer>
  );
};

const Tabs: React.FC<TabsProps> = (props) => {
  const { children, selectedIndex, onChange } = props;
  const arrayChildren = Children.toArray(children);
  return (
    <TabsContainer {...props}>
      {Children.map(arrayChildren, (child, index) =>
        // @ts-ignore
        cloneElement(child, {
          active: index === selectedIndex,
          onChange,
          index,
        })
      )}
    </TabsContainer>
  );
};

const TabsContainer = styled.div<TabsProps>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid ${({ theme }) => theme.colors.light};
  margin-bottom: 1rem;
  position: relative;
  user-select: none;

  &::before {
    transition: all 0.15s ease-in;
    position: absolute;
    content: '';
    width: 49%;
    bottom: -2px;
    border-radius: ${({ theme }) => theme.borderRadius}px;
    left: ${({ selectedIndex }) => selectedIndex * 51}%;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TabContainer = styled.div<TabProps>`
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.gray};
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.borderRadius}px;
  cursor: pointer;

  &:hover {
    ${({ theme, active }) =>
      !active
        ? `
    background-color: ${theme.colors.light}33`
        : ``}
  }
`;

export default Tabs;
