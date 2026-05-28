'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: 'red',
          fontSize: '1.4em',
        },
      },
    },
  },
});

export default theme;