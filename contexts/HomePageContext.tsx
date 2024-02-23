import React, { useState } from 'react';
import { createContext } from 'react';
export const HomePageContext = createContext({
  amountRaised: 0,
  amountToDonate: -1,
  goal: 0,
  setAmountToDonate: (amount) => {},
});

export const HomePageProvider = ({ children, data }) => {
  const [ctxData, setCtxData] = useState({
    amountToDonate: -1,
  });
  return (
    <HomePageContext.Provider
      value={{
        ...ctxData,
        amountRaised: data?.amountRaised,
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
