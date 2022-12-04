import React, { useState } from 'react';
import { createContext } from 'react';
export const HomePageContext = createContext({
  amountRaised: 0,
  amountToDonate: -1,
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
