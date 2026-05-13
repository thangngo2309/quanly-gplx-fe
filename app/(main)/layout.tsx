'use client';

import Sidebar from '@/component/sidebar.component';
import { MainContainer, MainContent } from '@/style object/mainlayout.style';
import { ReactNode } from 'react';

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <MainContainer>
      <Sidebar />
      <MainContent>
        {children}
      </MainContent>
    </MainContainer>
  );
}