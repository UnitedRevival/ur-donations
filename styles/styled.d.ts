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
    };
    fonts: {
      display: string;
      readText: string;
    };
    borderRadius: string | number;
    boxShadow: string;
  }
}
