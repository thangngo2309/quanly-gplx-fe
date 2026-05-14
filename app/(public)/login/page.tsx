'use client';

import { Container, Title, Subtitle } from '@/style object/content.style';
import { Button } from '@mui/material';

export default function Login() {
  return (
    <Container>
      <Title variant="h1">Đăng nhập</Title>
      <Subtitle>Sẽ làm đăng nhập sau</Subtitle>
      <Button variant="contained" color="primary" href='/'>
        Quay lại dashboard
      </Button>
    </Container>
  );
}
