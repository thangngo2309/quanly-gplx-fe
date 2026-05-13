import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const MainContainer = styled(Box)({
  display: 'flex',
  height: '100vh',
});

export const MainContent = styled(Box)({
  flex: 1,
  backgroundColor: '#fff',
  padding: 16,
  overflow: 'auto',
});