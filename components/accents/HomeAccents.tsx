import * as React from 'react';

import styled, { useTheme } from 'styled-components';

const Root = styled.div`
  width: 100%;
  height: 100%;
`;

interface AccentProps {
  // [x: string]: any;
  position: {
    left?: number;
    right?: number;
    bottom?: number;
    top?: number;
  };
  color?: string;
  theme?: any;
}

interface RectangleProps extends AccentProps {
  width?: number;
  height?: number;
}

const Rectangle = styled.div<RectangleProps>`
  position: absolute;
  opacity: 50%;
  ${(props) => (props.position ? positionalProps(props) : '')}
  ${(props) => (props.width ? 'width: ' + props.width + 'px' : 'width: 100px')};
  ${(props) =>
    props.height ? 'height: ' + props.height + 'px' : 'height: 100px'};
`;

const positionalProps = (props: AccentProps) => {
  return `
     ${props.position.bottom ? `bottom: ${props.position.bottom}px;` : ''}
  ${props.position.top ? `top: ${props.position.top}px;` : ''}
  ${props.position.left ? `left: ${props.position.left}px;` : ''}
  ${props.position.right ? `right: ${props.position.right}px;` : ''}
  ${
    props.color
      ? 'background-color: ' + props.color
      : 'background-color: ' + props.theme.colors.light
  };
  `;
};

const Diamond = styled(Rectangle)`
  transform: rotate(45deg);
  opacity: 10%;

  border-radius: ${({ theme }) => theme.borderRadius}px;
`;

const HomeAccents = ({ children }) => {
  const theme = useTheme();

  return (
    <Root>
      <Diamond
        position={{ top: 50, right: 50 }}
        width={100}
        height={100}
        color={'black'}
      />
      <Diamond
        position={{ top: 50, right: 66 }}
        width={100}
        height={100}
        color={theme.colors.primary}
      />
      {children}
    </Root>
  );
};

export default HomeAccents;
