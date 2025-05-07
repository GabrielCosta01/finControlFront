'use client';
import ClientLayout from '@/components/ClientLayout';

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
} 