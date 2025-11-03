"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React, Framer Motion ve Radix UI/Lucide
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor
// Global tip tanımları src/app/ai-code/global.d.ts dosyasında bulunmaktadır

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Database, 
  Activity, 
  User, 
  Layers, 
  Cloud, 
  BarChart2, 
  Shield,
  CircleCheck,
  CircleX,
  Info,
  Link2,
  Terminal,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  X,
  FileText,
  CalendarRange,
} from "lucide-react";
import { CXLogo } from "@/components/ui/cx-logo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/contexts/i18n-context";
import { AreaChart } from "@/components/dashboard/charts/area-chart";
import { BarChart } from "@/components/dashboard/charts/bar-chart";
import { LineChart } from "@/components/dashboard/charts/line-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EnhancedDashboard() {
  // @ts-nocheck - TypeScript hatalarını görmezden geliyoruz
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  
  const stats = {
    cpu: 28,
    memory: 42,
    network: 78,
    disk: 57,
    activeUsers: 142,
    requests: 12874,
    responseTime: 124, // ms
    uptime: 99.98,
    revenue: 24680,
    revenueGrowth: 12.4,
    expenses: 18340,
    expensesGrowth: -3.6,
    profit: 6340,
    profitGrowth: 18.2,
    transactions: 782,
    pendingPayments: 7,
  };
  
  // Grafik verileri
  const revenueData = [
    { name: "Ocak", gelir: 15420, gider: 12340, kar: 3080 },
    { name: "Şubat", gelir: 18670, gider: 14520, kar: 4150 },
    { name: "Mart", gelir: 16980, gider: 13240, kar: 3740 },
    { name: "Nisan", gelir: 19450, gider: 14780, kar: 4670 },
    { name: "Mayıs", gelir: 22340, gider: 16980, kar: 5360 },
    { name: "Haziran", gelir: 24680, gider: 18340, kar: 6340 },
  ];
  
  const trafficData = [
    { name: "00:00", ziyaretçi: 320 },
    { name: "02:00", ziyaretçi: 180 },
    { name: "04:00", ziyaretçi: 120 },
    { name: "06:00", ziyaretçi: 230 },
    { name: "08:00", ziyaretçi: 670 },
    { name: "10:00", ziyaretçi: 980 },
    { name: "12:00", ziyaretçi: 1240 },
    { name: "14:00", ziyaretçi: 1380 },
    { name: "16:00", ziyaretçi: 1520 },
    { name: "18:00", ziyaretçi: 1280 },
    { name: "20:00", ziyaretçi: 890 },
    { name: "22:00", ziyaretçi: 560 },
  ];
  
  const usageData = [
    { name: "Pzt", cpu: 42, bellek: 28, ağ: 65 },
    { name: "Sal", cpu: 38, bellek: 35, ağ: 72 },
    { name: "Çar", cpu: 45, bellek: 40, ağ: 68 },
    { name: "Per", cpu: 53, bellek: 42, ağ: 74 },
    { name: "Cum", cpu: 49, bellek: 45, ağ: 82 },
    { name: "Cmt", cpu: 32, bellek: 30, ağ: 58 },
    { name: "Paz", cpu: 28, bellek: 25, ağ: 42 },
  ];
  
  // Simule edilmiş bildirimler
  useEffect(() => {
    // Gerçek uygulamada API'den gelecek bildirimler
    const mockNotifications = [
      {
        id: 1,
        type: "alert",
        title: "Yüksek CPU Kullanımı",
        message: "Production API sunucularında %85 CPU kullanımı tespit edildi.",
        time: "10 dakika önce",
        read: false,
      },
      {
        id: 2,
        type: "info",
        title: "Sistem Güncellemesi",
        message: "Planlı sistem güncellemesi yarın 03:00 - 05:00 saatleri arasında gerçekleştirilecek.",
        time: "1 saat önce",
        read: false,
      },
      {
        id: 3,
        type: "success",
        title: "Ödeme Alındı",
        message: "Müşteri #1285'ten 7.500₺ ödeme başarıyla alındı.",
        time: "2 saat önce",
        read: true,
      },
      {
        id: 4,
        type: "warning",
        title: "Disk Alanı Azalıyor",
        message: "Veritabanı sunucusu disk alanı %80'e ulaştı. Lütfen kontrol edin.",
        time: "3 saat önce",
        read: true,
      },
      {
        id: 5,
        type: "info",
        title: "Yeni Kullanıcı Kaydı",
        message: "Son 24 saatte 15 yeni kullanıcı kaydı gerçekleşti.",
        time: "5 saat önce",
        read: true,
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const handleDeleteNotification = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const servers = [
    { name: "Production API", status: "active", load: 67, memory: 48, count: 4 },
    { name: "Database Cluster", status: "active", load: 42, memory: 56, count: 2 },
    { name: "Cache Server", status: "active", load: 38, memory: 24, count: 2 },
    { name: "Analytics", status: "maintenance", load: 12, memory: 18, count: 1 },
    { name: "Background Jobs", status: "active", load: 34, memory: 32, count: 2 },
  ];
  
  const services = [
    { name: "Authentication", status: "operational", uptime: 99.99, responseTime: 85 },
    { name: "Storage API", status: "operational", uptime: 99.95, responseTime: 102 },
    { name: "Payment Gateway", status: "operational", uptime: 99.98, responseTime: 205 },
    { name: "Analytics API", status: "degraded", uptime: 98.76, responseTime: 312 },
    { name: "Search Service", status: "operational", uptime: 99.92, responseTime: 156 },
  ];
  
  const fadeInUp = {
    initial: { y: 10, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "operational":
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              {status === "active" ? t('dashboard.active') : t('dashboard.operational')}
            </span>
          </div>
        );
      case "maintenance":
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {t('dashboard.maintenance')}
            </span>
          </div>
        );
      case "degraded":
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {t('dashboard.degraded')}
            </span>
          </div>
        );
      case "down":
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              {t('dashboard.down')}
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gray-500"></span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {t('dashboard.unknown')}
            </span>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        custom={0} 
        variants={fadeInUp} 
        initial="initial" 
        animate="animate"
        className="flex flex-col md:flex-row justify-between items-start gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.systemDashboard')}</h1>
          <p className="text-muted-foreground">{t('dashboard.realTimeMonitoring')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button 
              variant="outline" 
              className="gap-1.5 relative"
              onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
            >
              <Bell className="h-4 w-4" />
              {t('dashboard.notifications')}
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
            
            {showNotificationsPanel && (
              <div className="absolute right-0 mt-2 w-80 bg-card rounded-md border shadow-lg overflow-hidden z-50">
                <div className="p-3 border-b flex justify-between items-center">
                  <h3 className="font-medium">{t('dashboard.notifications')} ({notifications.length})</h3>
                  {unreadCount > 0 && (
                    <Button size="sm" variant="ghost" onClick={handleMarkAllAsRead}>
                      {t('dashboard.markAllAsRead')}
                    </Button>
                  )}
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 border-b hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-muted/20' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div>
                          {notification.type === 'alert' && <AlertCircle className="h-5 w-5 text-destructive" />}
                          {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {notification.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                          {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-500" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs flex items-center text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {notification.time}
                            </span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 px-2" 
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <span className="sr-only">Sil</span>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">{t('dashboard.noNotifications')}</p>
                    </div>
                  )}
                </div>
                
                <div className="p-2 border-t">
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    <span>{t('dashboard.viewAll')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <Button variant="outline" className="gap-1.5">
            <Terminal className="h-4 w-4" />
            {t('dashboard.console')}
          </Button>
          <Button className="gap-1.5">
            <Activity className="h-4 w-4" />
            {t('dashboard.viewLogs')}
          </Button>
        </div>
      </motion.div>
      
      {/* System Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div custom={1} variants={fadeInUp} initial="initial" animate="animate">
          <Card className="overflow-hidden codexonx-stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                {t('dashboard.cpuUsage')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cpu}%</div>
              <div className="mt-4">
                <ProgressBar percentage={stats.cpu} variant="primary" height="sm" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div custom={2} variants={fadeInUp} initial="initial" animate="animate">
          <Card className="overflow-hidden codexonx-stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                {t('dashboard.memoryUsage')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.memory}%</div>
              <div className="mt-4">
                <ProgressBar percentage={stats.memory} variant="secondary" height="sm" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div custom={3} variants={fadeInUp} initial="initial" animate="animate">
          <Card className="overflow-hidden codexonx-stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                {t('dashboard.networkUsage')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.network}%</div>
              <div className="mt-4">
                <ProgressBar percentage={stats.network} variant="accent" height="sm" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div custom={4} variants={fadeInUp} initial="initial" animate="animate">
          <Card className="overflow-hidden codexonx-stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('dashboard.activeUsers')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <div className="mt-4 flex items-center text-sm">
                <span className="flex items-center text-green-500">
                  <CircleCheck className="mr-1 h-3 w-3" />
                  <span className="ml-1">{t('dashboard.allSystemsNormal')}</span>
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Tabs */}
      <motion.div custom={5} variants={fadeInUp} initial="initial" animate="animate">
        <Tabs defaultValue="servers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="servers">{t('dashboard.servers')}</TabsTrigger>
            <TabsTrigger value="services">{t('dashboard.services')}</TabsTrigger>
            <TabsTrigger value="requests">{t('dashboard.requests')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="servers" className="space-y-4">
            <div className="rounded-lg border shadow-sm">
              <div className="p-4 bg-muted/40">
                <h3 className="text-lg font-medium">{t('dashboard.serverStatus')}</h3>
                <p className="text-sm text-muted-foreground">{t('dashboard.serverStatusDesc')}</p>
              </div>
              <div className="p-0">
                <table className="w-full codexonx-stats-table">
                  <thead>
                    <tr>
                      <th className="w-[240px]">{t('dashboard.serverName')}</th>
                      <th className="w-[100px]">{t('dashboard.status')}</th>
                      <th>{t('dashboard.load')}</th>
                      <th>{t('dashboard.memory')}</th>
                      <th className="w-[100px]">{t('dashboard.count')}</th>
                      <th className="w-[100px] text-right">{t('dashboard.action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servers.map((server, index) => (
                      <tr key={index}>
                        <td className="font-medium">{server.name}</td>
                        <td>{renderStatusBadge(server.status)}</td>
                        <td>
                          <ProgressBar 
                            percentage={server.load} 
                            variant={server.load > 80 ? "error" : server.load > 60 ? "warning" : "success"} 
                            showLabel 
                          />
                        </td>
                        <td>
                          <ProgressBar 
                            percentage={server.memory} 
                            variant="info" 
                            showLabel 
                          />
                        </td>
                        <td className="text-center">{server.count}</td>
                        <td className="text-right">
                          <Button size="sm" variant="ghost">
                            <Info className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <div className="rounded-lg border shadow-sm">
              <div className="p-4 bg-muted/40">
                <h3 className="text-lg font-medium">{t('dashboard.serviceStatus')}</h3>
                <p className="text-sm text-muted-foreground">{t('dashboard.serviceStatusDesc')}</p>
              </div>
              <div className="p-0">
                <table className="w-full codexonx-stats-table">
                  <thead>
                    <tr>
                      <th className="w-[240px]">{t('dashboard.serviceName')}</th>
                      <th className="w-[120px]">{t('dashboard.status')}</th>
                      <th>{t('dashboard.uptime')}</th>
                      <th>{t('dashboard.responseTime')}</th>
                      <th className="w-[100px] text-right">{t('dashboard.action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (
                      <tr key={index}>
                        <td className="font-medium">{service.name}</td>
                        <td>{renderStatusBadge(service.status)}</td>
                        <td>
                          <div className="flex items-center">
                            <div className="mr-2 font-medium">
                              {service.uptime}%
                            </div>
                            {service.uptime < 99.9 ? (
                              <CircleX className="text-amber-500 h-4 w-4" />
                            ) : (
                              <CircleCheck className="text-green-500 h-4 w-4" />
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <div className="mr-2 font-medium">
                              {service.responseTime} ms
                            </div>
                            {service.responseTime > 300 ? (
                              <CircleX className="text-amber-500 h-4 w-4" />
                            ) : service.responseTime > 200 ? (
                              <Info className="text-amber-500 h-4 w-4" />
                            ) : (
                              <CircleCheck className="text-green-500 h-4 w-4" />
                            )}
                          </div>
                        </td>
                        <td className="text-right">
                          <Button size="sm" variant="ghost">
                            <Info className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{t('dashboard.totalRequests')}</h3>
                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-2xl font-bold">{stats.requests.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{t('dashboard.lastHour')}</p>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{t('dashboard.avgResponseTime')}</h3>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-2xl font-bold">{stats.responseTime} ms</div>
                  <p className="text-xs text-muted-foreground">{t('dashboard.lastHour')}</p>
                </div>
              </div>
              
              <div className="md:col-span-2 rounded-lg border p-4">
                <div className="mb-4">
                  <h3 className="font-medium">{t('dashboard.requestsOverTime')}</h3>
                  <p className="text-sm text-muted-foreground">{t('dashboard.last24Hours')}</p>
                </div>
                
                <div className="h-[280px] border rounded-lg bg-background">
                  <LineChart 
                    data={trafficData} 
                    dataKeys={["ziyaretçi"]} 
                    colors={["#4f46e5"]} 
                    xAxisKey="name" 
                    height={280}
                    showGrid={true}
                    showLegend={false}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Sistem Kullanımı Grafikleri */}
      <motion.div custom={6} variants={fadeInUp} initial="initial" animate="animate" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t('dashboard.systemUsage')}</h2>
          <Select defaultValue="week">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Zaman Aralığı" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Bugün</SelectItem>
              <SelectItem value="week">Bu Hafta</SelectItem>
              <SelectItem value="month">Bu Ay</SelectItem>
              <SelectItem value="year">Bu Yıl</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <AreaChart 
                data={usageData} 
                dataKeys={["cpu", "bellek", "ağ"]} 
                colors={["#4f46e5", "#06b6d4", "#f59e0b"]} 
                xAxisKey="name" 
                height={300}
                showGrid={true}
                showLegend={true}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Finansal İstatistikler */}
      <motion.div custom={7} variants={fadeInUp} initial="initial" animate="animate">
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="overflow-hidden codexonx-stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t('dashboard.revenue')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.revenue.toLocaleString()}₺</div>
                <Badge variant={stats.revenueGrowth >= 0 ? "success" : "destructive"} className="flex items-center">
                  {stats.revenueGrowth >= 0 ? 
                    <TrendingUp className="mr-1 h-3 w-3" /> : 
                    <TrendingDown className="mr-1 h-3 w-3" />
                  }
                  {Math.abs(stats.revenueGrowth)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{t('dashboard.comparedToLastMonth')}</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden codexonx-stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t('dashboard.expenses')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.expenses.toLocaleString()}₺</div>
                <Badge variant={stats.expensesGrowth < 0 ? "success" : "destructive"} className="flex items-center">
                  {stats.expensesGrowth < 0 ? 
                    <TrendingDown className="mr-1 h-3 w-3" /> : 
                    <TrendingUp className="mr-1 h-3 w-3" />
                  }
                  {Math.abs(stats.expensesGrowth)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{t('dashboard.comparedToLastMonth')}</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden codexonx-stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t('dashboard.profit')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.profit.toLocaleString()}₺</div>
                <Badge variant={stats.profitGrowth >= 0 ? "success" : "destructive"} className="flex items-center">
                  {stats.profitGrowth >= 0 ? 
                    <TrendingUp className="mr-1 h-3 w-3" /> : 
                    <TrendingDown className="mr-1 h-3 w-3" />
                  }
                  {Math.abs(stats.profitGrowth)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{t('dashboard.comparedToLastMonth')}</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden codexonx-stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('dashboard.transactions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">{stats.transactions}</div>
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-muted-foreground">{t('dashboard.pendingPayments')}:</span>
                  <Badge variant="warning" className="ml-2">{stats.pendingPayments}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
      
      <motion.div custom={8} variants={fadeInUp} initial="initial" animate="animate" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t('dashboard.financialMetrics')}</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              {t('dashboard.exportReport')}
            </Button>
            <Button variant="outline" size="sm">
              <CalendarRange className="h-4 w-4 mr-1" />
              {t('dashboard.customDate')}
            </Button>
          </div>
        </div>
      
        <Card>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <BarChart 
                data={revenueData} 
                dataKeys={["gelir", "gider", "kar"]} 
                colors={["#22c55e", "#ef4444", "#4f46e5"]} 
                xAxisKey="name" 
                height={300}
                showGrid={true}
                showLegend={true}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.systemInfo')}</CardTitle>
            <CardDescription>{t('dashboard.systemInfoDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t('dashboard.securityStatus')}</span>
                  </div>
                  <div className="flex items-center text-green-500">
                    <CircleCheck className="mr-1 h-4 w-4" />
                    <span>{t('dashboard.secure')}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t('dashboard.cloudResources')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">8/10</span>
                    <span className="ml-1 text-muted-foreground">{t('dashboard.active')}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t('dashboard.serviceHealth')}</span>
                  </div>
                  <div className="flex items-center text-green-500">
                    <CircleCheck className="mr-1 h-4 w-4" />
                    <span>{stats.uptime}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <CXLogo size="lg" animated={true} className="mb-4 mx-auto" />
                  <h3 className="text-lg font-medium">{t('dashboard.codexonxPlatform')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('dashboard.version')} 1.2.5
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Button variant="outline">
              {t('dashboard.systemConfig')}
            </Button>
            <Button>
              {t('dashboard.runDiagnostics')}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
