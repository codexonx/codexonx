"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Code, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  FileCode, 
  Terminal, 
  Layers,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  const navItems = [
    { href: "/dashboard", label: "Ana Sayfa", icon: Home },
    { href: "/dashboard/projects", label: "Projeler", icon: Layers },
    { href: "/dashboard/editor", label: "Kod Editörü", icon: FileCode },
    { href: "/dashboard/terminal", label: "Terminal", icon: Terminal },
    { href: "/dashboard/community", label: "Topluluk", icon: Users },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Mobile */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background shadow-lg transition-transform duration-200 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <span className="font-semibold">CodeXONX</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(false)}
              className="ml-auto"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Menüyü kapat</span>
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.href} className="mb-1">
                    <Link 
                      href={item.href}
                      className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Icon className={`mr-2 h-4 w-4`} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="border-t p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/avatar.png" alt="Avatar" />
                  <AvatarFallback>KO</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">Kullanıcı Adı</p>
                  <p className="text-xs text-muted-foreground">kullanici@mail.com</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden border-r bg-background lg:block lg:w-64">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <span className="font-semibold">CodeXONX</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.href} className="mb-1">
                    <Link 
                      href={item.href}
                      className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Icon className={`mr-2 h-4 w-4`} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="border-t p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/avatar.png" alt="Avatar" />
                  <AvatarFallback>KO</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">Kullanıcı Adı</p>
                  <p className="text-xs text-muted-foreground">kullanici@mail.com</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <header className="border-b">
          <div className="flex h-14 items-center px-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menüyü aç</span>
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Ayarlar</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
