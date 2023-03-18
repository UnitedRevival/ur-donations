import { Children, cloneElement } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
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
      <SelectedBar selectedIndex={selectedIndex} />
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

const AnimatedSelectBar = ({ className, selectedIndex }) => {
  return (
    <motion.div
      animate={{
        left: `${selectedIndex * 50}%`,
      }}
      transition={{
        type: 'spring',
        duration: 0.5,
      }}
      className={className}
    ></motion.div>
  );
};

const TabsContainer = styled.div<TabsProps>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid ${({ theme }) => theme.colors.light};
  margin-bottom: 1rem;
  position: relative;
  user-select: none;
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

const SelectedBar = styled<any>(AnimatedSelectBar)`
  position: absolute;
  width: 50%;
  bottom: -2px;
  border-radius: ${({ theme }) => theme.borderRadius}px;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export default Tabs;
