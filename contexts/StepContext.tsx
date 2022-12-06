import React, { createContext, useContext, useState } from 'react';

const StepContext = createContext<{
  step: number;
  setStep: any;
  nextStep: any;
}>({
  step: 0,
  setStep: () => {},
  nextStep: () => {},
});

export const useStepper = () => {
  const data = useContext(StepContext);

  return data;
};

export const StepContextProvider = ({ children }) => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep((curr) => curr + 1);
  };

  return (
    <StepContext.Provider
      value={{
        step,
        setStep,
        nextStep,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};
