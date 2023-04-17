import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  border: none;
  outline: none;
  background-color: #fff;
  color: ${({ theme }) => theme.colors.black};

  border-radius: ${(props) => props.theme.borderRadius}px;
  padding: 2rem;

  border: 1px solid ${({ theme }) => theme.colors.light};
  font-size: 17px;

  width: 100%;
  text-align: center;

  margin-bottom: 2rem;
  overflow: hidden;
`;

const TextInput = ({ ...props }) => {
  return <StyledInput {...props} />;
};

export default TextInput;
