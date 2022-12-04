import { createContext } from 'react';

export const HomePageContext = createContext({ amountRaised: 0 });

export const HomePageProvider = HomePageContext.Provider;
