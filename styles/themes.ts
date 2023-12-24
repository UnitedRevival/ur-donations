import { DefaultTheme } from 'styled-components';

export const defaultTheme: DefaultTheme = {
  colors: {
    primary: '#ff7922',
    gray: '#8D8884',
    darkGray: '#4E4138',
    light: '#e0e0e0',
    black: '#2C1903',
    heartRed: 'rgba(204, 42, 93, 1)',
    error: '#eb1c26',
  },
  fonts: {
    display: `'Poppins', sans-serif`,
  },
  breakpoints: {
    large: '1060px',
    medium: '700px',
    small: '500px',
  },
  transitions: {
    bezier1: 'cubic-bezier(0.22,0.96,0.34,1)',
  },
  borderRadius: 4,
  boxShadow: '0px 4px 15px -3px rgba(0, 0, 0, 0.1)',
};
