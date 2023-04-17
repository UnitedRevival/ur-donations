import styled from 'styled-components';

const FormInput = styled.input`
  padding: 1rem;
  height: 3rem;

  background-color: #fff;

  box-sizing: border-box;
  border-radius: ${({ theme }) => theme.borderRadius}px;
  border: 1px solid ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.black};
  transition: 0.1s all linear;
  &:focus {
    outline: 3px solid ${({ theme }) => theme.colors.primary}77;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.gray};
  }
`;

export default FormInput;
