import type { Metadata } from 'next';
import AdminClientWrapper from '@/components/admin/admin-client-wrapper';

export const metadata: Metadata = {
  title: 'Codexonx Admin Panel',
  description: 'Codexonx yönetim paneli',
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminClientWrapper>{children}</AdminClientWrapper>;
}
