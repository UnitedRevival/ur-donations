import styled from 'styled-components';
import PrimaryButton from './PrimaryButton';

const SecondaryButton = styled(PrimaryButton)`
  margin-top: 1rem;
  // background-color: #444;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.darkGray};

  color: #444;

  &:hover {
    // opacity: 0.6;
    background-color: #444;
    color: white;
  }
`;

export default SecondaryButton;
