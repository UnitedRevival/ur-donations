import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  border: none;
  outline: none;
  background-color: #f6f6f6;
  color: #888;

  border-radius: ${(props) => props.theme.borderRadius}px;
  padding: 2rem;

  font-weight: bold;
  font-size: 1.1rem;

  width: 100%;

  text-align: center;

  margin-bottom: 2rem;
  overflow: hidden;
`;

const TextInput = ({ ...props }) => {
  return <StyledInput {...props} />;
};

export default TextInput;
