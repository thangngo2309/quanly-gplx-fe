import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


export const Container = styled(Box)({
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const Title = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 700,
});

export const Subtitle = styled(Typography)({
  fontSize: '1rem',
  color: 'gray',
});