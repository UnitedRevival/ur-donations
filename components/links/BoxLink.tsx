import styled from 'styled-components';

interface BoxLinkProps {
  fill?: string;
}

const BoxLink = styled.a<BoxLinkProps>`
  margin-top: 1rem;
  padding: 1rem;
  width: 100%;
  color: #fff;

  background-color: ${({ fill, theme }) =>
    fill ? fill : theme.colors.primary};

  text-align: center;
  text-decoration: none;

  box-sizing: border-box;
  font-weight: bold;

  &:hover {
    outline: 4px solid
      ${({ fill, theme }) => (fill ? fill : theme.colors.primary)}33;
  }
  transition: 0.1s all linear;
  border-radius: ${({ theme }) => theme.borderRadius}px;
`;

export default BoxLink;
