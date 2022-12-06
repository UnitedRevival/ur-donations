import React, { createContext, useContext, useState } from 'react';

interface PaymentsContextData {
  client_secret?: string;
}

interface PaymentsContextValue extends PaymentsContextData {
  setData: any;
}

const PaymentsContext = createContext<PaymentsContextValue>({
  setData: () => {},
});

export const usePaymentContext = () => {
  const data = useContext(PaymentsContext);

  return data;
};

export const PaymentsContextProvider = ({ children }) => {
  const [data, setDataState] = useState<PaymentsContextData>({});

  const setData = (changeObj) => {
    setDataState((curr) => ({ ...curr, ...changeObj }));
  };

  return (
    <PaymentsContext.Provider
      value={{
        ...data,
        setData,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  );
};
