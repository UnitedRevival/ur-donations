import { DefaultTheme } from 'styled-components';

export const defaultTheme: DefaultTheme = {
  colors: {
    primary: '#ff7922',
    gray: '#888888',
    darkGray: '#444444',
    light: '#e0e0e0',
    black: '#1f1401',

    error: '#eb1c26',
  },
  fonts: {
    display: `'Nunito', sans-serif`,
  },
  breakpoints: {
    large: '1060px',
  },
  borderRadius: 2,
  boxShadow: '0px 4px 15px -3px rgba(0, 0, 0, 0.1)',
};
