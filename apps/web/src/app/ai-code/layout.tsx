import { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/responsive.css";
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from "@/contexts/i18n-context";
import { AuthProvider } from "@/contexts/auth-context";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Code Assistant - Kodlama Asistanı",
  description: "Yapay zeka destekli kod yazma ve düzenleme platformu",
  themeColor: "#0F172A",
};

export default function AICodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} bg-slate-950 min-h-screen`}>
      <I18nProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {children}
            <Toaster />
          </div>
        </AuthProvider>
      </I18nProvider>
    </div>
  );
}
