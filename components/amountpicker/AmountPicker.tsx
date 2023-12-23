import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { HomePageContext } from '../../contexts/HomePageContext';
import { useStepper } from '../../contexts/StepContext';
import PrimaryButton from '../buttons/PrimaryButton';
import TextDivider from '../dividers/TextDivider';
import TextInput from '../inputs/TextInput';
import QuickPickItem from './QuickPickItem';

const quickPickValues = [50, 100, 200, 1000, 2500, 5000];

const AmountPicker = () => {
  const { setAmountToDonate } = useContext(HomePageContext);
  const { nextStep } = useStepper();
  const [manualAmount, setManualAmount] = useState('Enter Price Manually');
  const [selectedPick, setSelectedPick] = useState(-1);
  const [enabledItems, setEnabledItems] = useState({
    quickPick: false,
    manual: false,
  });

  const onChangeAmount = (e) => {
    setManualAmount(e.target.value);
  };

  const onQuickPickSelect = (amount) => () => {
    setSelectedPick(amount);
    if (!enabledItems.quickPick)
      setEnabledItems({ quickPick: true, manual: false });
  };

  const onContinue = async () => {
    let selectedAmount: number | null = null;

    if (enabledItems.quickPick) selectedAmount = selectedPick;
    if (enabledItems.manual) selectedAmount = parseFloat(manualAmount);

    if (!selectedAmount) throw new Error('Error, selectedAmount still not set');

    setAmountToDonate(selectedAmount);

    nextStep();
  };

  const disabledBtn =
    (enabledItems.manual &&
      (!parseInt(manualAmount) || parseInt(manualAmount) <= 0)) ||
    (enabledItems.quickPick && selectedPick <= 0) ||
    (!enabledItems.manual && !enabledItems.quickPick);
  return (
    <Root>
      <QuickPickContainer current={enabledItems.quickPick}>
        {quickPickValues.map((val) => (
          <QuickPickItem
            value={val}
            key={val}
            onSelect={onQuickPickSelect(val)}
            selected={selectedPick === val && enabledItems.quickPick}
          />
        ))}
      </QuickPickContainer>
      <TextDivider>or</TextDivider>
      <StyledTextInput
        type="number"
        placeholder="Enter Price Manually"
        name="manual-amount"
        value={manualAmount}
        onChange={onChangeAmount}
        onClick={() => {
          setEnabledItems({ manual: true, quickPick: false });
        }}
        current={enabledItems.manual}
      />

      <PrimaryButton
        variant="large"
        fullWidth
        disabled={disabledBtn}
        onClick={onContinue}
      >
        Select Payment
      </PrimaryButton>
    </Root>
  );
};

const Root = styled.div``;

export const QuickPickContainer = styled.div<{ current?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;

  margin-bottom: 1rem;

  ${(props) => (props.current ? '' : 'opacity: 0.5;')}
`;

const StyledTextInput = styled(TextInput)<{ current?: boolean }>`
  ${({ current, theme }) =>
    current ? `border: 1px solid ${theme.colors.primary};` : `opacity: 0.5; `}

  ${(props) =>
    props.current
      ? `
        outline: 3px solid ${props.theme.colors.primary}77;

  `
      : ''}
      

    margin-bottom: 1rem;
`;

export default AmountPicker;
