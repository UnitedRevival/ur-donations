import styled from 'styled-components';

const FormInput = styled.input`
  padding: 1rem;

  background-color: #fff;

  border-radius: ${({ theme }) => theme.borderRadius}px;
  border: 1px solid ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.black};
  transition: 0.1s all linear;
  &:focus {
    outline: 3px solid ${({ theme }) => theme.colors.primary}77;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

export default FormInput;
