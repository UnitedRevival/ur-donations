import styled from 'styled-components';

interface NavbarProps {
  leftAlign?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ leftAlign }) => {
  return (
    <Container leftAlign={leftAlign}>
      <a href="https://unitedrevival.org">
        <Logo src="./logo.png" leftAlign={leftAlign} />
      </a>
    </Container>
  );
};

const Logo = styled.img<NavbarProps>`
  padding: 4px;
  height: 60px;

  ${(props) =>
    props.leftAlign
      ? `
      margin-left: 2rem;
       `
      : ''}
`;

const Container = styled.nav<NavbarProps>`
  height: 84px;

  width: 100%;
  background-color: white;
  display: flex;
  ${(props) => (props.leftAlign ? '' : ' justify-content: center;')}
  align-items: center;

  margin-bottom: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    margin-bottom: 0rem;
  }
`;

export default Navbar;
