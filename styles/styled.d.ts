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
    };
    fonts: {
      display: string;
      readText: string;
    };
    breakpoints: {
      large: string;
    };
    borderRadius: string | number;
    boxShadow: string;
  }
}
