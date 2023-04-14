import 'styled-components';
interface IPalette {
  main: string;
  contrastText: string;
}
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      light: string;
      darkGray: string;
      gray: string;
      black: string;

      error: string;
    };
    fonts: {
      display: string;
    };
    breakpoints: {
      large: string;
    };
    borderRadius: string | number;
    boxShadow: string;
    transitions: {
      bezier1: string;
    };
  }
}
