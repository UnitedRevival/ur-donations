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

  font-weight: bold;
  border: 1px solid ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius}px;
`;

export default BoxLink;
