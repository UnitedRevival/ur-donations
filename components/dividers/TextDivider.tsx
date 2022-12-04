import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e8e8e8;
  border-radius: ${(props) => props.theme.borderRadius};
`;

const SubText = styled.span`
  text-align: center;
  padding-left: 1rem;
  padding-right: 1rem;
  color: #999;
`;

const TextDivider = ({ children }) => {
  return (
    <Root>
      <Divider />
      <SubText>{children}</SubText>
      <Divider />
    </Root>
  );
};

export default TextDivider;
