import React, { useState } from 'react';
import { createContext } from 'react';
export const HomePageContext = createContext({
  amountRaised: 0,
  amountToDonate: -1,
  goal: 0,
  setAmountToDonate: (amount) => {},
  setAmountRaised: (amount) => {},
});

export const HomePageProvider = ({ children, data }) => {
  const [ctxData, setCtxData] = useState({
    amountToDonate: -1,
  });
  const [amountRaised, setAmountRaised] = useState(data?.amountRaised || 0);
  return (
    <HomePageContext.Provider
      value={{
        ...ctxData,
        amountRaised: amountRaised,
        setAmountRaised,
        goal: data?.goal,
        setAmountToDonate: (amount) =>
          setCtxData({
            amountToDonate: amount,
          }),
      }}
    >
      {children}
    </HomePageContext.Provider>
  );
};
