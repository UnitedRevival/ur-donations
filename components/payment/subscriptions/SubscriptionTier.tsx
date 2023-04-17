import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
interface SubscriptionTierProps {
  children?: any;

  selected?: boolean;
  title?: string;
  onSelected?: any;
  benefits?: string[];
}

const SubscriptionTier: React.FC<SubscriptionTierProps> = ({
  children,
  onSelected,
  benefits,
  title,
  ...rest
}) => {
  return (
    <Container onClick={onSelected} {...rest}>
      <SelectedCircle {...rest} />
      <PriceContainer>
        <Price>{children}</Price>
      </PriceContainer>
      <Benefits>
        {benefits?.map((b) => (
          <BenefitContainer>
            <IconContainer>
              <FontAwesomeIcon icon={faCheck} size="1x" />
            </IconContainer>
            <Benefit>{b}</Benefit>
          </BenefitContainer>
        ))}
      </Benefits>
    </Container>
  );
};

const IconContainer = styled.div`
  width: 1rem;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const BenefitContainer = styled.div`
  display: flex;
`;

const SelectedCircle = styled.div<SubscriptionTierProps>`
  position: absolute;
  height: 1.1rem;
  width: 1.1rem;
  top: 1rem;
  right: 1rem;

  border-radius: 50px;
  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.colors.primary : theme.colors.light};

  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : '#fff'};
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  min-width: 100px;

  box-sizing: border-box;
  padding: 1rem;
  padding-left: 0;
  border-right: 1px solid ${({ theme }) => theme.colors.light};
  margin-right: 1rem;
`;

const Benefits = styled.div``;

const Benefit = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 14px;
  padding-bottom: 1rem;
  &:last-child {
    padding-bottom: 0;
  }
`;

const Price = styled.p`
  font-weight: 700;
  font-size: 28px;
  margin: 0;
  padding: 0;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const Container = styled.div<SubscriptionTierProps>`
  position: relative;

  padding: 3rem;
  display: flex;

  width: 100%;
  margin: 0.5rem;
  padding: 1.5rem;
  transition: 0.1s all linear;
  box-sizing: border-box;
  border-radius: ${({ theme }) => theme.borderRadius}px;
  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.colors.primary : theme.colors.light};
  background-color: #fff;
  cursor: pointer;
`;

export default SubscriptionTier;
