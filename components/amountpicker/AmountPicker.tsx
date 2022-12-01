import React, { useState } from 'react';
import styled from 'styled-components';
import PrimaryButton from '../buttons/PrimaryButton';
import TextDivider from '../dividers/TextDivider';
import TextInput from '../inputs/TextInput';
import QuickPickItem from './QuickPickItem';

const Root = styled.div`
  background-color: #fff;
  box-shadow: ${(props) => props.theme.boxShadow};
  padding: 2rem;
  min-width: 500px;
`;

const QuickPickContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  margin-bottom: 1rem;
`;

const quickPickValues = [50, 100, 200, 1000, 2500, 5000];

const AmountPicker = () => {
  const [amount, setAmount] = useState('Enter Price Manually');
  const [selectedPick, setSelectedPick] = useState(-1);

  const onChangeAmount = (e) => {
    setAmount(e.target.value);
  };

  const onQuickPickSelect = (amount) => (e) => {
    setSelectedPick(amount);
  };

  return (
    <Root>
      <QuickPickContainer>
        {quickPickValues.map((val) => (
          <QuickPickItem
            value={val}
            key={val}
            onSelect={onQuickPickSelect(val)}
            selected={selectedPick === val}
          />
        ))}
      </QuickPickContainer>
      <TextDivider>or</TextDivider>
      <TextInput
        type="number"
        placeholder="Enter Price Manually"
        name="manual-amount"
        value={amount}
        onChange={onChangeAmount}
      />

      <PrimaryButton variant="large" fullWidth>
        Select Payment
      </PrimaryButton>
    </Root>
  );
};

export default AmountPicker;
