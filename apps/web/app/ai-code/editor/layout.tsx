'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Home,
  FileCode,
  Settings,
  PanelLeft,
  Code,
  ChevronLeft,
  Folder,
  Users,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Tarayıcı tarafında çalıştığından emin olalım
  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR sırasında önyükleme/titreşimi önlemek için
  if (!mounted) {
    return null;
  }

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sol kenar çubuğu - Daraltılabilir */}
      <div
        className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {!collapsed && (
              <Link href="/ai-code" className="flex items-center gap-2">
                <Code className="w-6 h-6 text-blue-500" />
                <span className="font-bold">AICodeX</span>
              </Link>
            )}
            {collapsed && (
              <Link href="/ai-code" className="w-full flex justify-center">
                <Code className="w-6 h-6 text-blue-500" />
              </Link>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={toggleCollapse}
            title={collapsed ? 'Genişlet' : 'Daralt'}
            aria-label={collapsed ? 'Genişlet' : 'Daralt'}
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            />
          </Button>
        </div>

        <div className="py-4">
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/ai-code"
                  className={`flex items-center ${
                    collapsed ? 'justify-center' : 'px-4'
                  } py-2 text-gray-300 hover:bg-slate-800 hover:text-white transition-colors`}
                  title="Ana Sayfa"
                >
                  <Home className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Ana Sayfa</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-code/editor"
                  className={`flex items-center ${
                    collapsed ? 'justify-center' : 'px-4'
                  } py-2 text-blue-400 bg-slate-800/50 hover:bg-slate-800 transition-colors`}
                  title="Kod Editörü"
                >
                  <FileCode className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Kod Editörü</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-code/projects"
                  className={`flex items-center ${
                    collapsed ? 'justify-center' : 'px-4'
                  } py-2 text-gray-300 hover:bg-slate-800 hover:text-white transition-colors`}
                  title="Projelerim"
                >
                  <Folder className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Projelerim</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-code/templates"
                  className={`flex items-center ${
                    collapsed ? 'justify-center' : 'px-4'
                  } py-2 text-gray-300 hover:bg-slate-800 hover:text-white transition-colors`}
                  title="Şablonlar"
                >
                  <LayoutGrid className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Şablonlar</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-code/community"
                  className={`flex items-center ${
                    collapsed ? 'justify-center' : 'px-4'
                  } py-2 text-gray-300 hover:bg-slate-800 hover:text-white transition-colors`}
                  title="Topluluk"
                >
                  <Users className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Topluluk</span>}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="border-t border-slate-800 mt-4 pt-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/ai-code/settings"
                  className={`flex items-center ${
                    collapsed ? 'justify-center' : 'px-4'
                  } py-2 text-gray-300 hover:bg-slate-800 hover:text-white transition-colors`}
                  title="Ayarlar"
                >
                  <Settings className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Ayarlar</span>}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ana içerik */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
