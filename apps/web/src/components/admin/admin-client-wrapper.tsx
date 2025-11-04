'use client';

import React from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';

interface AdminClientWrapperProps {
  children: React.ReactNode;
}

export default function AdminClientWrapper({ children }: AdminClientWrapperProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
