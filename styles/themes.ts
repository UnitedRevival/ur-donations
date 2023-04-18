import { DefaultTheme } from 'styled-components';

export const defaultTheme: DefaultTheme = {
  colors: {
    primary: '#ff7922',
    gray: '#8D8884',
    darkGray: '#4E4138',
    light: '#e0e0e0',
    black: '#3C1903',

    error: '#eb1c26',
  },
  fonts: {
    display: `'Nunito', sans-serif`,
  },
  breakpoints: {
    large: '1060px',
  },
  transitions: {
    bezier1: 'cubic-bezier(0.22,0.96,0.34,1)',
  },
  borderRadius: 4,
  boxShadow: '0px 4px 15px -3px rgba(0, 0, 0, 0.1)',
};
