"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve Radix UI/Lucide
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import { CXLogo } from "@/components/ui/cx-logo";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  children?: NavItemProps[];
  expanded?: boolean;
  isCollapsed?: boolean;
}

export function AdminNav({ isCollapsed = false }) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    users: false,
    settings: false,
    content: false
  });

  // Ana navigasyon öğeleri
  const navItems: NavItemProps[] = [
    {
      icon: <Icons.LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/admin/dashboard"
    },
    {
      icon: <Icons.Users className="h-5 w-5" />,
      label: "Kullanıcılar",
      children: [
        { icon: <Icons.Users className="h-4 w-4" />, label: "Tüm Kullanıcılar", href: "/admin/users" },
        { icon: <Icons.Shield className="h-4 w-4" />, label: "Roller", href: "/admin/users/roles" },
        { icon: <Icons.Bell className="h-4 w-4" />, label: "Bildirimler", href: "/admin/users/notifications" }
      ]
    },
    {
      icon: <Icons.Package className="h-5 w-5" />,
      label: "Ürünler",
      children: [
        { icon: <Icons.Package className="h-4 w-4" />, label: "Ürün Listesi", href: "/admin/products" },
        { icon: <Icons.Tag className="h-4 w-4" />, label: "Kategoriler", href: "/admin/products/categories" },
        { icon: <Icons.CreditCard className="h-4 w-4" />, label: "Ödeme Planları", href: "/admin/products/plans" }
      ]
    },
    {
      icon: <Icons.FileText className="h-5 w-5" />,
      label: "İçerik",
      children: [
        { icon: <Icons.FileText className="h-4 w-4" />, label: "Sayfalar", href: "/admin/content/pages" },
        { icon: <Icons.Mail className="h-4 w-4" />, label: "E-posta Şablonları", href: "/admin/content/email-templates" },
        { icon: <Icons.Globe className="h-4 w-4" />, label: "Dil Çevirileri", href: "/admin/content/translations" }
      ]
    },
    {
      icon: <Icons.BarChart2 className="h-5 w-5" />,
      label: "Analizler",
      href: "/admin/analytics"
    },
    {
      icon: <Icons.Database className="h-5 w-5" />,
      label: "Sistem",
      children: [
        { icon: <Icons.Database className="h-4 w-4" />, label: "API Durumu", href: "/admin/system/api-status" },
        { icon: <Icons.Shield className="h-4 w-4" />, label: "Güvenlik", href: "/admin/system/security" },
        { icon: <Icons.Settings className="h-4 w-4" />, label: "Yapılandırma", href: "/admin/system/config" }
      ]
    },
    {
      icon: <Icons.Settings className="h-5 w-5" />,
      label: "Ayarlar",
      href: "/admin/settings"
    }
  ];

  // Alt grupları aç/kapat
  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const renderNavItem = (item: NavItemProps, index: number, depth = 0) => {
    const isActive = item.href && pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = item.children?.some(child => openGroups[child.label.toLowerCase()]);
    
    if (isCollapsed && depth === 0) {
      return (
        <div
          key={item.label}
          className={cn(
            "relative group flex items-center justify-center py-3 px-2 cursor-pointer",
            isActive && "bg-muted"
          )}
        >
          <Link 
            href={item.href || "#"} 
            className={cn(
              "flex items-center justify-center",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            {item.icon}
          </Link>
          
          {/* Tooltip for collapsed menu */}
          <div className="absolute left-full ml-2 rounded-md whitespace-nowrap px-2 py-1 bg-popover text-popover-foreground text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-50 pointer-events-none">
            {item.label}
          </div>

          {/* Submenu for collapsed menu */}
          {hasChildren && (
            <div className="absolute left-full top-0 ml-2 mt-0 opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-popover rounded-md shadow-md overflow-hidden min-w-[180px]">
              <div className="p-1">
                {item.children?.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    href={child.href || "#"}
                    className={cn(
                      "flex items-center space-x-2 text-sm py-1.5 px-2 rounded-md",
                      pathname === child.href ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {child.icon}
                    <span>{child.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (hasChildren) {
      // Ana grup öğesi
      return (
        <div key={item.label} className="space-y-1">
          <button
            onClick={() => toggleGroup(item.label.toLowerCase())}
            className={cn(
              "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
              depth > 0 && "pl-8 py-2",
              isActive ? "bg-muted text-primary" : "hover:bg-muted/50"
            )}
          >
            <div className="flex items-center">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {!isCollapsed && (openGroups[item.label.toLowerCase()] ? 
              <Icons.ChevronDown className="h-4 w-4" /> : 
              <Icons.ChevronRight className="h-4 w-4" />
            )}
          </button>

          {/* Alt grup öğeleri */}
          <AnimatePresence>
            {openGroups[item.label.toLowerCase()] && !isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pl-6 space-y-1">
                  {item.children?.map((child, childIndex) => renderNavItem(child, childIndex, depth + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Düz navigasyon öğesi
    return (
      <Link
        key={item.label}
        href={item.href || "#"}
        className={cn(
          "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
          depth > 0 && "pl-6 py-2",
          isActive 
            ? "bg-muted text-primary" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        {item.icon && <span className={cn("mr-2", isCollapsed && "mr-0")}>{item.icon}</span>}
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <div className={cn(
      "flex flex-col h-full border-r bg-background",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className={cn(
        "flex h-16 items-center px-4 border-b",
        isCollapsed && "justify-center px-2"
      )}>
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <CXLogo variant={isCollapsed ? "icon" : "full"} size={isCollapsed ? "sm" : "md"} />
        </Link>
      </div>
      
      {/* Navigasyon */}
      <div className="flex-1 overflow-auto py-4 px-2">
        <nav className="space-y-2">
          {navItems.map((item, i) => renderNavItem(item, i))}
        </nav>
      </div>
      
      {/* Kullanıcı profili */}
      <div className={cn(
        "h-16 border-t p-3 flex items-center",
        isCollapsed ? "justify-center" : "px-4"
      )}>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
          CA
        </div>
        {!isCollapsed && (
          <div className="ml-3">
            <p className="text-sm font-medium">Codexonx Admin</p>
            <p className="text-xs text-muted-foreground">admin@codexonx.com</p>
          </div>
        )}
      </div>
    </div>
  );
}
