import styled from 'styled-components';

interface ToggleProps {
  toggled?: boolean;
  onClick?: () => void;
}

const Toggle: React.FC<ToggleProps> = (props) => {
  return (
    <Container {...props}>
      <ToggleCircle {...props} />
    </Container>
  );
};

const ToggleCircle = styled.div<ToggleProps>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${({ toggled }) => (toggled ? '18px' : '3px')};
  height: 1.15rem;
  width: 1.15rem;
  background-color: #fff;
  border-radius: 100%;
  transition: 0.1s all ease-in;
`;

const Container = styled.div<ToggleProps>`
  position: relative;
  height: 1.5rem;
  width: 2.5rem;

  border-radius: 100px;
  padding: 0.2rem;
  background-color: ${({ theme, toggled }) =>
    toggled ? theme.colors.primary : theme.colors.light};
  transition: 0.1s all ease-in;
  cursor: pointer;
`;

export default Toggle;
