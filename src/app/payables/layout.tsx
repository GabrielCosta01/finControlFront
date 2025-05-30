'use client';
import ClientLayout from '@/components/ClientLayout';

export default function PayablesLayout({
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