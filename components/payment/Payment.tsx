import * as React from 'react';
import styled from 'styled-components';
import { useStepper } from '../../contexts/StepContext';
import Card from '../card/Card';

import Tabs, { Tab } from '../tabs/Tabs';
import { useState } from 'react';
import ExpandablePanel from '../panel/ExpandablePanel';
import Subscription from './Subscription';
import SinglePayment from './SinglePayment';

const Root = styled(Card)`
  margin-bottom: 4rem;
  min-height: 400px;
`;

const Payment = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { step } = useStepper();

  return (
    <Root>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(changedIndex) => setSelectedTab(changedIndex)}
      >
        <Tab>Subscription</Tab>
        <Tab>Single Donation</Tab>
      </Tabs>

      <ExpandablePanel
        animateKey={`${step}-${selectedTab}`}
        slide={selectedTab === 0 ? 'Right' : 'Left'}
      >
        {selectedTab === 0 && <Subscription />}
        {selectedTab === 1 && <SinglePayment step={step} />}
      </ExpandablePanel>
    </Root>
  );
};

export default Payment;
