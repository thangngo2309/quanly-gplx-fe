// profile.style.ts

import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export const Container = styled(Box)({
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#e5e7eb',
});

export const Card = styled(Paper)({
  width: 320,
  padding: '24px',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const Title = styled(Typography)({
  textAlign: 'center',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#111827',
});

export const InfoList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const InfoRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '8px',
  borderBottom: '1px solid #f3f4f6',
});

export const Label = styled(Typography)({
  fontSize: '0.875rem',
  color: '#6b7280',
});

export const Value = styled(Typography)({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#111827',
});