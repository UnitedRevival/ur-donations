import styled from 'styled-components';
import PrimaryButton from './PrimaryButton';

const SecondaryButton = styled(PrimaryButton)`
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.colors.darkGray};

  &:hover {
    opacity: 0.6;
  }
`;

export default SecondaryButton;
