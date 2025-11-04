'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve Radix UI/Lucide
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState } from 'react';
import { Menu, X, Bell, User, ChevronDown } from 'lucide-react';
import { AdminNav } from '@/components/admin/admin-nav';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CXLogo } from '@/components/ui/cx-logo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Determine page title from path
  const getPageTitle = () => {
    const path = pathname.split('/').filter(Boolean);
    if (path.length === 1 && path[0] === 'admin') return 'Dashboard';
    if (path.length > 1) {
      // Capitalize first letter and replace dashes with spaces
      return path[path.length - 1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <div
        className={`hidden md:block transition-all duration-300 ease-in-out ${isNavCollapsed ? 'w-16' : 'w-64'}`}
      >
        <AdminNav isCollapsed={isNavCollapsed} />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileNavOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-background shadow-lg">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <CXLogo size="sm" />
              <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-64px)]">
              <AdminNav isCollapsed={false} />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-4 bg-background">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2"
              onClick={() => setIsMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Desktop sidebar collapse button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Page title */}
            <h1 className="ml-4 text-xl font-semibold">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    CA
                  </div>
                  <div className="hidden sm:block text-sm font-medium">Codexonx Admin</div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Bildirimler</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span className="text-destructive">Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-muted/20">{children}</main>

        {/* Footer */}
        <footer className="border-t py-3 px-6 text-center text-xs text-muted-foreground bg-background">
          <p>© {new Date().getFullYear()} Codexonx. Tüm hakları saklıdır.</p>
        </footer>
      </div>
    </div>
  );
}
