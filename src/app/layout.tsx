import React, { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from './providers';
import { FaTachometerAlt, FaTags, FaWallet, FaPiggyBank, FaArrowDown, FaArrowUp, FaFileAlt, FaChartBar, FaBars, FaTimes } from 'react-icons/fa';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FinanceControl App',
  description: 'Sistema de controle financeiro',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>        
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
