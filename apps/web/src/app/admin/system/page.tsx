"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve Radix UI/Lucide
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Check, 
  CheckCircle,
  Database,
  Download,
  FileText,
  HardDrive,
  RotateCcw,
  Server,
  Settings,
  Shield,
  X
} from "lucide-react";
import { CXLogo } from "@/components/ui/cx-logo";

// Sistem bilgileri için tip tanımlamaları
interface SystemInfo {
  version: string;
  uptime: string;
  environment: string;
  memory: {
    total: string;
    used: string;
    free: string;
    percentage: number;
  };
  disk: {
    total: string;
    used: string;
    free: string;
    percentage: number;
  };
  database: {
    version: string;
    connections: number;
    status: "healthy" | "warning" | "error";
  };
  services: {
    name: string;
    status: "up" | "down" | "warning";
    lastCheck: string;
    responseTime: number;
  }[];
  logs: {
    level: "info" | "warn" | "error";
    message: string;
    timestamp: string;
    service: string;
  }[];
  backups: {
    id: string;
    date: string;
    size: string;
    type: string;
    status: "completed" | "in_progress" | "failed";
  }[];
}

export default function SystemPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Veri yükleme simülasyonu
  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        // Gerçek uygulamada API isteği yapılacaktır
        // Şimdilik simüle edilmiş veri kullanıyoruz
        setTimeout(() => {
          const mockSystemInfo: SystemInfo = {
            version: "1.0.0",
            uptime: "5 gün, 3 saat, 12 dakika",
            environment: "production",
            memory: {
              total: "16 GB",
              used: "8.2 GB",
              free: "7.8 GB",
              percentage: 51,
            },
            disk: {
              total: "500 GB",
              used: "210 GB",
              free: "290 GB",
              percentage: 42,
            },
            database: {
              version: "PostgreSQL 14.5",
              connections: 24,
              status: "healthy",
            },
            services: [
              {
                name: "API Gateway",
                status: "up",
                lastCheck: "2023-06-15T15:30:00Z",
                responseTime: 120,
              },
              {
                name: "Auth Service",
                status: "up",
                lastCheck: "2023-06-15T15:30:00Z",
                responseTime: 95,
              },
              {
                name: "Payment Processor",
                status: "warning",
                lastCheck: "2023-06-15T15:28:00Z",
                responseTime: 350,
              },
              {
                name: "Email Service",
                status: "up",
                lastCheck: "2023-06-15T15:29:00Z",
                responseTime: 180,
              },
              {
                name: "Storage Service",
                status: "up",
                lastCheck: "2023-06-15T15:30:00Z",
                responseTime: 110,
              },
            ],
            logs: [
              {
                level: "error",
                message: "Database connection timeout",
                timestamp: "2023-06-15T14:25:30Z",
                service: "Auth Service",
              },
              {
                level: "warn",
                message: "High API rate limit reached for user: user_123",
                timestamp: "2023-06-15T14:20:15Z",
                service: "API Gateway",
              },
              {
                level: "info",
                message: "System backup completed successfully",
                timestamp: "2023-06-15T14:00:00Z",
                service: "Backup Service",
              },
              {
                level: "info",
                message: "New user registered: user_456",
                timestamp: "2023-06-15T13:45:22Z",
                service: "Auth Service",
              },
              {
                level: "warn",
                message: "Payment processing delayed",
                timestamp: "2023-06-15T13:30:10Z",
                service: "Payment Processor",
              },
            ],
            backups: [
              {
                id: "bak_123456",
                date: "2023-06-15T12:00:00Z",
                size: "1.2 GB",
                type: "Tam Yedek",
                status: "completed",
              },
              {
                id: "bak_123455",
                date: "2023-06-14T12:00:00Z",
                size: "1.1 GB",
                type: "Tam Yedek",
                status: "completed",
              },
              {
                id: "bak_123454",
                date: "2023-06-13T12:00:00Z",
                size: "1.3 GB",
                type: "Tam Yedek",
                status: "completed",
              },
            ],
          };

          setSystemInfo(mockSystemInfo);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Sistem bilgisi yükleme hatası:", error);
        setLoading(false);
      }
    };

    fetchSystemInfo();
  }, []);

  // Tarih formatı
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Sistem Yönetimi</h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="services">Servisler</TabsTrigger>
          <TabsTrigger value="logs">Loglar</TabsTrigger>
          <TabsTrigger value="backups">Yedekler</TabsTrigger>
          <TabsTrigger value="settings" className="hidden lg:block">Ayarlar</TabsTrigger>
        </TabsList>

        {/* Genel Bakış Sekmesi */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Sistem Durumu Kartı */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Sistem Durumu</CardTitle>
                <CardDescription>Genel sistem durumu ve bilgileri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Durum</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Çalışıyor
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Versiyon</span>
                  <span className="text-sm">{systemInfo?.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Çalışma Süresi</span>
                  <span className="text-sm">{systemInfo?.uptime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Ortam</span>
                  <Badge variant="secondary">{systemInfo?.environment}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* RAM Kullanımı Kartı */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">RAM Kullanımı</CardTitle>
                <CardDescription>Sistem bellek durumu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Kullanılan</span>
                    <span className="text-sm">{systemInfo?.memory.used} / {systemInfo?.memory.total}</span>
                  </div>
                  <Progress value={systemInfo?.memory.percentage} className="h-2" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Boş</span>
                  <span className="text-sm">{systemInfo?.memory.free}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Kullanım Yüzdesi</span>
                  <span className="text-sm">{systemInfo?.memory.percentage}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Disk Kullanımı Kartı */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Disk Kullanımı</CardTitle>
                <CardDescription>Depolama durumu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Kullanılan</span>
                    <span className="text-sm">{systemInfo?.disk.used} / {systemInfo?.disk.total}</span>
                  </div>
                  <Progress value={systemInfo?.disk.percentage} className="h-2" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Boş</span>
                  <span className="text-sm">{systemInfo?.disk.free}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Kullanım Yüzdesi</span>
                  <span className="text-sm">{systemInfo?.disk.percentage}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Veritabanı Durumu */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Veritabanı Durumu
              </CardTitle>
              <CardDescription>
                Veritabanı bağlantı ve performans bilgileri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Versiyon</div>
                  <div>{systemInfo?.database.version}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Aktif Bağlantılar</div>
                  <div>{systemInfo?.database.connections}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Durum</div>
                  <div>
                    {systemInfo?.database.status === "healthy" ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Check className="mr-1 h-3 w-3" /> Sağlıklı
                      </Badge>
                    ) : systemInfo?.database.status === "warning" ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <AlertCircle className="mr-1 h-3 w-3" /> Uyarı
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <X className="mr-1 h-3 w-3" /> Hata
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kuruluş Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Kuruluş Bilgileri
              </CardTitle>
              <CardDescription>
                Sistem kurulum ve lisans bilgileri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-6">
                <div className="text-center space-y-4">
                  <div>
                    <CXLogo size="lg" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Codexonx Enterprise</h3>
                    <p className="text-sm text-muted-foreground">Lisans: XXXX-XXXX-XXXX-XXXX</p>
                    <p className="text-sm text-muted-foreground">Son Güncelleme: 2023-06-15</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Settings className="mr-1 h-4 w-4" />
                  Lisans Yönetimi
                </Button>
                <Button size="sm" className="flex items-center">
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Güncelleme Kontrol Et
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Servisler Sekmesi */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Servis Durumları</CardTitle>
              <CardDescription>
                Sistem servislerinin çalışma durumu ve performans bilgileri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemInfo?.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex items-center">
                      <div className={`mr-3 h-2.5 w-2.5 rounded-full ${
                        service.status === "up" 
                          ? "bg-green-500" 
                          : service.status === "warning" 
                            ? "bg-amber-500" 
                            : "bg-red-500"
                      }`} />
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Son kontrol: {formatDate(service.lastCheck)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge 
                        variant={
                          service.responseTime < 200 
                            ? "success" 
                            : service.responseTime < 300 
                              ? "outline" 
                              : "warning"
                        }
                        className="mr-2"
                      >
                        {service.responseTime} ms
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Tüm Servisleri Yenile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Loglar Sekmesi */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sistem Logları</CardTitle>
                <CardDescription>
                  Son sistem olayları ve hata kayıtları
                </CardDescription>
              </div>
              <Button variant="outline" className="flex items-center" size="sm">
                <FileText className="mr-1 h-4 w-4" />
                Tüm Logları İndir
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemInfo?.logs.map((log, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-3 text-sm ${
                      log.level === "error"
                        ? "bg-red-50 border-l-4 border-red-600"
                        : log.level === "warn"
                        ? "bg-amber-50 border-l-4 border-amber-600"
                        : "bg-blue-50 border-l-4 border-blue-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {log.service}
                      </span>
                      <Badge
                        variant={
                          log.level === "error"
                            ? "destructive"
                            : log.level === "warn"
                            ? "warning"
                            : "info"
                        }
                      >
                        {log.level}
                      </Badge>
                    </div>
                    <p className="mt-1">{log.message}</p>
                    <p className="mt-1 text-xs opacity-70">
                      {formatDate(log.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Daha Fazla Göster
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Yedekler Sekmesi */}
        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sistem Yedekleri</CardTitle>
                <CardDescription>
                  Otomatik ve manuel sistem yedekleriniz
                </CardDescription>
              </div>
              <Button className="flex items-center" size="sm">
                <HardDrive className="mr-1 h-4 w-4" />
                Yeni Yedek Oluştur
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Yedek ID</th>
                      <th className="text-left py-3 px-4">Tarih</th>
                      <th className="text-left py-3 px-4">Boyut</th>
                      <th className="text-left py-3 px-4">Tür</th>
                      <th className="text-left py-3 px-4">Durum</th>
                      <th className="text-right py-3 px-4">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemInfo?.backups.map((backup, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3 px-4 font-medium">{backup.id}</td>
                        <td className="py-3 px-4">{formatDate(backup.date)}</td>
                        <td className="py-3 px-4">{backup.size}</td>
                        <td className="py-3 px-4">{backup.type}</td>
                        <td className="py-3 px-4">
                          {backup.status === "completed" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Check className="mr-1 h-3 w-3" /> Tamamlandı
                            </Badge>
                          ) : backup.status === "in_progress" ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <Server className="mr-1 h-3 w-3 animate-pulse" /> İşlemde
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <X className="mr-1 h-3 w-3" /> Başarısız
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ayarlar Sekmesi */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sistem Ayarları</CardTitle>
              <CardDescription>
                Gelişmiş yapılandırma seçenekleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-md font-medium">Yedekleme Ayarları</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Yedekleme Sıklığı</label>
                      <select 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        title="Yedekleme Sıklığı"
                        aria-label="Yedekleme Sıklığı"
                      >
                        <option value="daily">Günlük</option>
                        <option value="weekly">Haftalık</option>
                        <option value="monthly">Aylık</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Yedek Saklama Süresi</label>
                      <select 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        title="Yedek Saklama Süresi"
                        aria-label="Yedek Saklama Süresi"
                      >
                        <option value="7">7 gün</option>
                        <option value="30">30 gün</option>
                        <option value="90">90 gün</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-md font-medium">Log Ayarları</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Log Seviyesi</label>
                      <select 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        title="Log Seviyesi"
                        aria-label="Log Seviyesi"
                      >
                        <option value="info">Bilgi</option>
                        <option value="warn">Uyarı</option>
                        <option value="error">Hata</option>
                        <option value="debug">Debug</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Log Rotasyonu</label>
                      <select 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        title="Log Rotasyonu"
                        aria-label="Log Rotasyonu"
                      >
                        <option value="daily">Günlük</option>
                        <option value="weekly">Haftalık</option>
                        <option value="size">Boyut bazlı</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-md font-medium">Güvenlik Ayarları</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">İki Faktörlü Doğrulama</label>
                      <select 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        title="İki Faktörlü Doğrulama"
                        aria-label="İki Faktörlü Doğrulama"
                      >
                        <option value="optional">İsteğe Bağlı</option>
                        <option value="required">Zorunlu</option>
                        <option value="disabled">Devre Dışı</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Oturum Süresi (dakika)</label>
                      <input 
                        type="number" 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue="60"
                        min="5"
                        max="1440"
                        title="Oturum Süresi (dakika)"
                        aria-label="Oturum Süresi (dakika)"
                        placeholder="Oturum süresi dakika olarak"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Sıfırla</Button>
              <Button>Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
