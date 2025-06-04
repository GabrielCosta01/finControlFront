'use client';
import ClientLayout from '@/components/ClientLayout';

export default function FinancialReportLayout({
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