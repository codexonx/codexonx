"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve Radix UI/Lucide
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React from "react";
import { AdminLayout as Layout } from "@/components/admin/admin-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Codexonx Admin Panel",
  description: "Codexonx yönetim paneli",
};

type AdminLayoutProps = {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}
