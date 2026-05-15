'use client';

import Sidebar from '@/component/sidebar.component';
import { MainContainer, MainContent } from '@/style object/mainlayout.style';
import { ReactNode } from 'react';
import ProfileProvider from '@/component/profile.provider';

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <MainContainer>
      <ProfileProvider>
        <Sidebar />
        <MainContent>
          {children}
        </MainContent>
      </ProfileProvider>
    </MainContainer>
  );
}