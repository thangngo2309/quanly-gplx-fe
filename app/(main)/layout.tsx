'use client';

import Sidebar from '@/component/sidebar.component';
import { MainContainer, MainContent } from '@/style object/mainlayout.style';
import { ReactNode } from 'react';
import ProfileProvider from '@/component/profile.provider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <MainContainer>
      <ProfileProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Sidebar />
          <MainContent>
            {children}
          </MainContent>
        </LocalizationProvider>
      </ProfileProvider>
    </MainContainer>
  );
}