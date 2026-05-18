'use client';
import { CircularProgress } from '@mui/material';
import {BackdropStyle} from '@/style object/content.style';

export default function LoadingPage() {
  return (
    <BackdropStyle open={true}>
      <CircularProgress color="inherit" />
    </BackdropStyle>
  );
}