"use client";

import { useState, useEffect } from "react";
import { Bell, Check, X, ChevronDown, ChevronUp, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Bildirim türleri
export type NotificationType = "info" | "success" | "warning" | "error" | "system";

// Bildirim veri modeli
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
  actionText?: string;
}

interface NotificationsCenterProps {
  onMarkAllAsRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationsCenter({
  onMarkAllAsRead,
  onNotificationClick,
}: NotificationsCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Örnek bildirimleri yükle
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      
      // Simüle edilmiş API isteği
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "Ödeme başarılı",
          message: "Pro plan için aylık ödemeniz başarıyla alındı.",
          type: "success",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 dakika önce
        },
        {
          id: "2",
          title: "API kotası aşıldı",
          message: "Projelerinizden biri günlük API kotasını aştı.",
          type: "warning",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 saat önce
          link: "/admin/projects/limits",
          actionText: "Kota Ayarları",
        },
        {
          id: "3",
          title: "Sistem bakımı",
          message: "Yarın 03:00-05:00 arasında planlı bakım gerçekleştirilecektir.",
          type: "info",
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 saat önce
        },
        {
          id: "4",
          title: "Hesap güvenliği",
          message: "Hesabınıza farklı bir konumdan giriş yapıldı.",
          type: "error",
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 gün önce
          link: "/admin/settings/security",
          actionText: "Güvenlik Ayarları",
        },
        {
          id: "5",
          title: "Yeni özellik: API Anahtarları",
          message: "Artık birden fazla API anahtarı oluşturup yönetebilirsiniz.",
          type: "system",
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 gün önce
          link: "/admin/settings/api-keys",
          actionText: "Keşfet",
        },
      ];
      
      setNotifications(mockNotifications);
      setIsLoading(false);
    };
    
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Okunmamış bildirimleri filtrele
  const unreadNotifications = notifications.filter((notification) => !notification.read);
  
  // Aktif sekmeye göre gösterilecek bildirimleri filtrele
  const filteredNotifications = activeTab === "unread" ? unreadNotifications : notifications;
  
  // Bildirimi oku
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      // Okunma durumunu güncelle (gerçek uygulamada API çağrısı yapılacak)
      const updatedNotifications = notifications.map((item) => {
        if (item.id === notification.id) {
          return { ...item, read: true };
        }
        return item;
      });
      
      setNotifications(updatedNotifications);
    }
    
    // Özel tıklama işlemi
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  // Tümünü okundu işaretle
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    
    setNotifications(updatedNotifications);
    
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  // Bildirim türüne göre simge
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case "warning":
        return <div className="h-2 w-2 rounded-full bg-yellow-500"></div>;
      case "error":
        return <div className="h-2 w-2 rounded-full bg-red-500"></div>;
      case "info":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case "system":
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  // Tarih formatı
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "Az önce";
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} dakika önce`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} saat önce`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} gün önce`;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full p-0">
          <Bell className="h-4 w-4" />
          {unreadNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadNotifications.length}
            </span>
          )}
          <span className="sr-only">Bildirimleri görüntüle</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 sm:w-96 p-0">
        <Tabs defaultValue={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "unread")}>
          <div className="flex items-center justify-between border-b px-3 py-2">
            <h4 className="font-medium">Bildirimler</h4>
            <div className="flex gap-1">
              <TabsList className="grid grid-cols-2 h-7">
                <TabsTrigger value="all" className="text-xs px-2">
                  Tümü
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs px-2">
                  Okunmamış{" "}
                  {unreadNotifications.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary/20 px-1.5 text-[10px]">
                      {unreadNotifications.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="all" className="focus-visible:outline-none">
            {renderNotifications(filteredNotifications)}
          </TabsContent>
          
          <TabsContent value="unread" className="focus-visible:outline-none">
            {renderNotifications(filteredNotifications)}
          </TabsContent>
          
          <div className="border-t px-3 py-2">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                disabled={unreadNotifications.length === 0}
                onClick={markAllAsRead}
              >
                <Check className="mr-2 h-3.5 w-3.5" />
                Tümünü okundu işaretle
              </Button>
              
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Filter className="mr-2 h-3.5 w-3.5" />
                Filtrele
              </Button>
            </div>
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
  
  // Bildirim listesi render fonksiyonu
  function renderNotifications(notificationsList: Notification[]) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary/70" />
        </div>
      );
    }
    
    if (notificationsList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <Bell className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            {activeTab === "all"
              ? "Henüz bildiriminiz bulunmuyor"
              : "Okunmamış bildiriminiz bulunmuyor"}
          </p>
        </div>
      );
    }
    
    return (
      <div className="max-h-[60vh] overflow-y-auto">
        {notificationsList.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={cn(
              "flex gap-3 px-3 py-3 border-b last:border-0 cursor-pointer transition-colors",
              notification.read ? "bg-background" : "bg-muted/30",
              "hover:bg-muted/50"
            )}
          >
            <div className="mt-1">{getNotificationIcon(notification.type)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                  {notification.title}
                </p>
                <time className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(notification.createdAt)}
                </time>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {notification.message}
              </p>
              {notification.link && (
                <div className="pt-1">
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = notification.link!;
                    }}
                  >
                    {notification.actionText || "Ayrıntılar"}
                  </Button>
                </div>
              )}
            </div>
            {!notification.read && (
              <div className="flex h-full items-center">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}
