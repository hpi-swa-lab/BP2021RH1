import { Palette, ThemeProvider, createTheme } from '@mui/material/styles';
import { PropsWithChildren } from 'react';
import colors from '../../shared/style.module.scss';

type ColorsType = Record<
  | 'primaryColor'
  | 'secondaryColor'
  | 'backgroundColor'
  | 'textColor'
  | 'decadeColor'
  | 'descriptionColor'
  | 'personColor'
  | 'locationColor'
  | 'keywordColor'
  | 'markAsTextColor'
  | 'linkColor'
  | 'collectionColor'
  | 'archiveColor'
  | 'titleColor'
  | 'allSearchColor',
  string
>;

type ThemeColors = {
  [K in keyof ColorsType as K extends `${infer Name}Color` ? Name : never]: {
    main: string;
  };
};

/* eslint-disable @typescript-eslint/no-empty-interface */
declare module '@mui/material/styles' {
  interface Palette extends ThemeColors {}
}

declare module '@mui/material' {
  interface SvgIconPropsColorOverrides extends Record<keyof Palette, true> {}
  interface ButtonPropsColorOverrides extends Record<keyof Palette, true> {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

// from src/shared/style.scss
const theme = createTheme({
  palette: Object.fromEntries(
    Object.entries(colors)
      .filter(([name]) => name.endsWith('Color'))
      .map(([name, color]) => [name.slice(0, -'Color'.length), { main: color }])
  ),
});

export const MuiThemeProvider = ({ children }: PropsWithChildren<{}>) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
