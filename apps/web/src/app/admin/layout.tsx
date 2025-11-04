// Admin layout server component - burada metadata tanımlanabilir
import React from 'react';

// Metadata tanımını burada yapıyoruz (server component kısmı)
export const metadata = {
  title: 'Codexonx Admin Panel',
  description: 'Codexonx yönetim paneli',
};

// Admin Client Wrapper'a yönlendiriyoruz
import AdminClientWrapper from '@/components/admin/admin-client-wrapper';

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminClientWrapper>{children}</AdminClientWrapper>;
}
