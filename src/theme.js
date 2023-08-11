import { createTheme } from '@mui/material';

export const themeSettings = createTheme(() => {
  return {
    typography: {
      fontFamily: ['Rubik', 'sans-serif'].join(','),
    },
  };
});
