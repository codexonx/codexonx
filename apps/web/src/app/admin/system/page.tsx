'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve Radix UI/Lucide
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
  X,
} from 'lucide-react';
import { CXLogo } from '@/components/ui/cx-logo';

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
    status: 'healthy' | 'warning' | 'error';
  };
  services: {
    name: string;
    status: 'up' | 'down' | 'warning';
    lastCheck: string;
    responseTime: number;
  }[];
  logs: {
    level: 'info' | 'warn' | 'error';
    message: string;
    timestamp: string;
    service: string;
  }[];
  backups: {
    id: string;
    date: string;
    size: string;
    type: string;
    status: 'completed' | 'in_progress' | 'failed';
  }[];
}

export default function SystemPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const heroShellClass =
    'relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 px-6 py-8 shadow-[0_45px_120px_rgba(8,12,32,0.65)] backdrop-blur-2xl';
  const heroOverlayClass =
    'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.45),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(84,120,255,0.35),transparent_60%)] opacity-80';
  const badgeGlowClass =
    'inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.4em] text-white/60';
  const primaryActionButtonClass =
    'inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/80 px-5 py-2 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,107,44,0.45)] transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50';
  const ghostPillButtonClass =
    'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-white/70 transition hover:border-primary/40 hover:text-white';
  const tabListClass =
    'relative flex flex-wrap gap-3 rounded-full border border-white/12 bg-black/35 p-2 backdrop-blur-2xl shadow-[0_25px_90px_rgba(8,12,32,0.55)]';
  const tabTriggerClass =
    'data-[state=active]:text-black data-[state=active]:bg-primary data-[state=active]:shadow-[0_0_32px_rgba(255,107,44,0.45)] rounded-full px-5 py-2 text-sm font-semibold text-white/60 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';
  const panelClass =
    'relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.05] text-white/70 shadow-[0_45px_120px_rgba(4,6,16,0.55)] backdrop-blur-2xl';
  const panelOverlayClass =
    'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.14),transparent_70%),radial-gradient(circle_at_bottom_right,rgba(84,120,255,0.16),transparent_72%)]';
  const panelHeaderClass = 'relative pb-2 text-white';
  const panelTitleClass = 'text-lg font-semibold text-white';
  const panelDescriptionClass = 'text-sm text-white/55';
  const sectionTaglineClass = 'text-sm uppercase tracking-[0.4em] text-white/55';
  const metricsBadgeClass =
    'inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/70';
  const dangerCardClass =
    'rounded-3xl border border-rose-500/40 bg-rose-500/15 p-6 text-rose-50 shadow-[0_30px_90px_rgba(244,63,94,0.35)] backdrop-blur-xl';
  const logLevelStyles = {
    error: 'border-rose-500/40 bg-rose-500/15 text-rose-50',
    warn: 'border-amber-400/40 bg-amber-400/20 text-amber-50',
    info: 'border-sky-400/40 bg-sky-400/20 text-sky-50',
  } as const;
  const backupStatusStyles = {
    completed: 'border-emerald-400/40 bg-emerald-400/20 text-emerald-50',
    in_progress: 'border-sky-400/40 bg-sky-400/20 text-sky-50',
    failed: 'border-rose-500/40 bg-rose-500/20 text-rose-50',
  } as const;
  const inputControlClass =
    'h-11 w-full rounded-2xl border border-white/12 bg-black/40 px-4 text-sm text-white placeholder:text-white/45 transition focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30';
  const labelClass = 'text-xs font-semibold uppercase tracking-[0.32em] text-white/65';
  const helperTextClass = 'text-xs text-white/50';

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.08, delayChildren: 0.08 },
    },
  } as const;

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  } as const;

  const gridVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut', staggerChildren: 0.05 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  } as const;

  // Veri yükleme simülasyonu
  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        // Gerçek uygulamada API isteği yapılacaktır
        // Şimdilik simüle edilmiş veri kullanıyoruz
        setTimeout(() => {
          const mockSystemInfo: SystemInfo = {
            version: '1.0.0',
            uptime: '5 gün, 3 saat, 12 dakika',
            environment: 'production',
            memory: {
              total: '16 GB',
              used: '8.2 GB',
              free: '7.8 GB',
              percentage: 51,
            },
            disk: {
              total: '500 GB',
              used: '210 GB',
              free: '290 GB',
              percentage: 42,
            },
            database: {
              version: 'PostgreSQL 14.5',
              connections: 24,
              status: 'healthy',
            },
            services: [
              {
                name: 'API Gateway',
                status: 'up',
                lastCheck: '2023-06-15T15:30:00Z',
                responseTime: 120,
              },
              {
                name: 'Auth Service',
                status: 'up',
                lastCheck: '2023-06-15T15:30:00Z',
                responseTime: 95,
              },
              {
                name: 'Payment Processor',
                status: 'warning',
                lastCheck: '2023-06-15T15:28:00Z',
                responseTime: 350,
              },
              {
                name: 'Email Service',
                status: 'up',
                lastCheck: '2023-06-15T15:29:00Z',
                responseTime: 180,
              },
              {
                name: 'Storage Service',
                status: 'up',
                lastCheck: '2023-06-15T15:30:00Z',
                responseTime: 110,
              },
            ],
            logs: [
              {
                level: 'error',
                message: 'Database connection timeout',
                timestamp: '2023-06-15T14:25:30Z',
                service: 'Auth Service',
              },
              {
                level: 'warn',
                message: 'High API rate limit reached for user: user_123',
                timestamp: '2023-06-15T14:20:15Z',
                service: 'API Gateway',
              },
              {
                level: 'info',
                message: 'System backup completed successfully',
                timestamp: '2023-06-15T14:00:00Z',
                service: 'Backup Service',
              },
              {
                level: 'info',
                message: 'New user registered: user_456',
                timestamp: '2023-06-15T13:45:22Z',
                service: 'Auth Service',
              },
              {
                level: 'warn',
                message: 'Payment processing delayed',
                timestamp: '2023-06-15T13:30:10Z',
                service: 'Payment Processor',
              },
            ],
            backups: [
              {
                id: 'bak_123456',
                date: '2023-06-15T12:00:00Z',
                size: '1.2 GB',
                type: 'Tam Yedek',
                status: 'completed',
              },
              {
                id: 'bak_123455',
                date: '2023-06-14T12:00:00Z',
                size: '1.1 GB',
                type: 'Tam Yedek',
                status: 'completed',
              },
              {
                id: 'bak_123454',
                date: '2023-06-13T12:00:00Z',
                size: '1.3 GB',
                type: 'Tam Yedek',
                status: 'completed',
              },
            ],
          };

          setSystemInfo(mockSystemInfo);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Sistem bilgisi yükleme hatası:', error);
        setLoading(false);
      }
    };

    fetchSystemInfo();
  }, []);

  // Tarih formatı
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-10">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary/70 border-t-transparent" />
      </div>
    );
  }

  if (!systemInfo) {
    return (
      <div className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-10 text-center text-white/70">
        <h2 className="text-xl font-semibold text-white">Sistem Bilgisi Yüklenemedi</h2>
        <p className="text-sm text-white/55">Lütfen bağlantınızı kontrol edin ve tekrar deneyin.</p>
        <Button className={primaryActionButtonClass}>
          <RotateCcw className="h-4 w-4" />
          Yeniden Dene
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 text-white/70"
    >
      <motion.div variants={sectionVariants} className={heroShellClass}>
        <div className={heroOverlayClass} />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <span className={badgeGlowClass}>Codexonx</span>
            <div className="space-y-2 text-white">
              <h1 className="text-3xl font-semibold tracking-tight">Sistem Yönetimi</h1>
              <p className="max-w-2xl text-sm text-white/65">
                Sistem altyapınızı gerçek zamanlı izleyin. Servis sağlık durumunu kontrol edin ve
                kritik aksiyonları tek bir panelden yönetin.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/55 sm:text-sm">
              <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1">
                Versiyon {systemInfo.version}
              </span>
              <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1">
                Ortam {systemInfo.environment}
              </span>
              <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1">
                Uptime {systemInfo.uptime}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className={ghostPillButtonClass}>
              <FileText className="h-4 w-4" />
              Logları İndir
            </Button>
            <Button className={primaryActionButtonClass}>
              <RotateCcw className="h-4 w-4" />
              Sistemi Yenile
            </Button>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className={tabListClass}>
          <TabsTrigger value="overview" className={tabTriggerClass}>
            Genel Bakış
          </TabsTrigger>
          <TabsTrigger value="services" className={tabTriggerClass}>
            Servisler
          </TabsTrigger>
          <TabsTrigger value="logs" className={tabTriggerClass}>
            Loglar
          </TabsTrigger>
          <TabsTrigger value="backups" className={tabTriggerClass}>
            Yedekler
          </TabsTrigger>
          <TabsTrigger value="settings" className={tabTriggerClass}>
            Ayarlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <motion.div
            variants={gridVariants}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div variants={itemVariants}>
              <Card className={cn(panelClass, 'p-6')}>
                <div className={panelOverlayClass} />
                <CardHeader className={cn(panelHeaderClass, 'space-y-2')}>
                  <CardTitle className={panelTitleClass}>Sistem Durumu</CardTitle>
                  <CardDescription className={panelDescriptionClass}>
                    Genel sistem durumu ve kritik metrikler
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Durum</span>
                    <span
                      className={cn(
                        metricsBadgeClass,
                        'border-emerald-400/40 bg-emerald-400/15 text-emerald-50'
                      )}
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Çalışıyor
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Versiyon</span>
                    <span className="text-white">{systemInfo.version}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Çalışma Süresi</span>
                    <span className="text-white">{systemInfo.uptime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Ortam</span>
                    <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs text-white">
                      {systemInfo.environment}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className={cn(panelClass, 'p-6')}>
                <div className={panelOverlayClass} />
                <CardHeader className={cn(panelHeaderClass, 'space-y-2')}>
                  <CardTitle className={panelTitleClass}>RAM Kullanımı</CardTitle>
                  <CardDescription className={panelDescriptionClass}>
                    Sistem bellek durumu
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Kullanılan</span>
                      <span className="text-white">
                        {systemInfo.memory.used} / {systemInfo.memory.total}
                      </span>
                    </div>
                    <Progress
                      className="h-2 bg-white/10 [&>div]:bg-primary"
                      value={systemInfo.memory.percentage}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Boş</span>
                    <span className="text-white">{systemInfo.memory.free}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Kullanım Yüzdesi</span>
                    <span className="text-white">{systemInfo.memory.percentage}%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className={cn(panelClass, 'p-6')}>
                <div className={panelOverlayClass} />
                <CardHeader className={cn(panelHeaderClass, 'space-y-2')}>
                  <CardTitle className={panelTitleClass}>Disk Kullanımı</CardTitle>
                  <CardDescription className={panelDescriptionClass}>
                    Depolama durumu
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Kullanılan</span>
                      <span className="text-white">
                        {systemInfo.disk.used} / {systemInfo.disk.total}
                      </span>
                    </div>
                    <Progress
                      className="h-2 bg-white/10 [&>div]:bg-primary"
                      value={systemInfo.disk.percentage}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Boş</span>
                    <span className="text-white">{systemInfo.disk.free}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Kullanım Yüzdesi</span>
                    <span className="text-white">{systemInfo.disk.percentage}%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={gridVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Card className={cn(panelClass, 'p-6')}>
                <div className={panelOverlayClass} />
                <CardHeader className={cn(panelHeaderClass, 'space-y-2')}>
                  <CardTitle className={panelTitleClass}>
                    <span className="inline-flex items-center gap-2">
                      <Database className="h-5 w-5" /> Veritabanı Durumu
                    </span>
                  </CardTitle>
                  <CardDescription className={panelDescriptionClass}>
                    Bağlantı ve performans metrikleri
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1">
                      <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Versiyon
                      </span>
                      <p className="text-sm text-white">{systemInfo.database.version}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Bağlantılar
                      </span>
                      <p className="text-sm text-white">{systemInfo.database.connections}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Durum
                      </span>
                      <span
                        className={cn(
                          metricsBadgeClass,
                          systemInfo.database.status === 'healthy' &&
                            'border-emerald-400/40 bg-emerald-400/20 text-emerald-50',
                          systemInfo.database.status === 'warning' &&
                            'border-amber-400/40 bg-amber-400/20 text-amber-50',
                          systemInfo.database.status === 'error' &&
                            'border-rose-500/40 bg-rose-500/20 text-rose-50'
                        )}
                      >
                        {systemInfo.database.status === 'healthy' ? (
                          <Check className="h-3 w-3" />
                        ) : systemInfo.database.status === 'warning' ? (
                          <AlertCircle className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        {systemInfo.database.status === 'healthy'
                          ? ' Sağlıklı'
                          : systemInfo.database.status === 'warning'
                            ? ' Uyarı'
                            : ' Hata'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className={cn(panelClass, 'p-6 text-white/70')}>
                <div className={panelOverlayClass} />
                <CardHeader className={cn(panelHeaderClass, 'space-y-2 text-center')}>
                  <CardTitle className={panelTitleClass}>Kuruluş Bilgileri</CardTitle>
                  <CardDescription className={panelDescriptionClass}>
                    Lisans ve marka detayları
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6">
                  <div className="flex justify-center">
                    <CXLogo size="lg" />
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="text-xl font-semibold text-white">Codexonx Enterprise</h3>
                    <p className="text-sm text-white/60">Lisans: XXXX-XXXX-XXXX-XXXX</p>
                    <p className="text-sm text-white/60">Son Güncelleme: 2023-06-15</p>
                  </div>
                </CardContent>
                <CardFooter className="relative flex flex-wrap gap-3">
                  <Button className={ghostPillButtonClass}>
                    <Settings className="h-4 w-4" />
                    Lisans Yönetimi
                  </Button>
                  <Button className={primaryActionButtonClass}>
                    <RotateCcw className="h-4 w-4" />
                    Güncelleme Kontrol Et
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className={cn(panelClass, 'space-y-6 p-6')}>
              <div className={panelOverlayClass} />
              <CardHeader className={cn(panelHeaderClass, 'space-y-2')}>
                <CardTitle className={panelTitleClass}>Servis Durumları</CardTitle>
                <CardDescription className={panelDescriptionClass}>
                  Sistem servislerinin çalışma durumu ve performans bilgileri
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                {systemInfo.services.map(service => (
                  <div
                    key={service.name}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-inner md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'h-2.5 w-2.5 rounded-full',
                          service.status === 'up'
                            ? 'bg-emerald-400'
                            : service.status === 'warning'
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                        )}
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">{service.name}</p>
                        <p className="text-xs text-white/55">
                          Son kontrol: {formatDate(service.lastCheck)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          metricsBadgeClass,
                          service.responseTime < 200 &&
                            'border-emerald-400/40 bg-emerald-400/20 text-emerald-50',
                          service.responseTime >= 200 &&
                            service.responseTime < 320 &&
                            'border-amber-400/40 bg-amber-400/20 text-amber-50',
                          service.responseTime >= 320 &&
                            'border-rose-500/40 bg-rose-500/20 text-rose-50'
                        )}
                      >
                        {service.responseTime} ms
                      </span>
                      <Button className={ghostPillButtonClass} size="sm">
                        <RotateCcw className="h-4 w-4" />
                        Yenile
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="relative flex justify-end">
                <Button className={primaryActionButtonClass}>Tüm Servisleri Yenile</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className={cn(panelClass, 'space-y-6 p-6')}>
              <div className={panelOverlayClass} />
              <CardHeader
                className={cn(
                  panelHeaderClass,
                  'flex flex-col gap-3 md:flex-row md:items-center md:justify-between'
                )}
              >
                <div className="space-y-1">
                  <CardTitle className={panelTitleClass}>Sistem Logları</CardTitle>
                  <CardDescription className={panelDescriptionClass}>
                    Son sistem olayları ve hata kayıtları
                  </CardDescription>
                </div>
                <Button className={ghostPillButtonClass} size="sm">
                  <FileText className="h-4 w-4" />
                  Tüm Logları İndir
                </Button>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <motion.div variants={gridVariants} className="space-y-4">
                  {systemInfo.logs.map(log => (
                    <motion.div
                      key={`${log.timestamp}-${log.message}`}
                      variants={itemVariants}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/75 shadow-inner"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                          <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                            {log.service}
                          </span>
                          <p className="text-sm text-white">{log.message}</p>
                        </div>
                        <span className={cn(metricsBadgeClass, logLevelStyles[log.level])}>
                          {log.level === 'info' ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <AlertCircle className="h-3.5 w-3.5" />
                          )}
                          {log.level}
                        </span>
                      </div>
                      <p className="mt-3 text-xs text-white/45">{formatDate(log.timestamp)}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
              <CardFooter className="relative flex justify-end">
                <Button className={ghostPillButtonClass}>Daha Fazla Göster</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="backups" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className={cn(panelClass, 'space-y-6 p-6')}>
              <div className={panelOverlayClass} />
              <CardHeader
                className={cn(
                  panelHeaderClass,
                  'flex flex-col gap-3 md:flex-row md:items-center md:justify-between'
                )}
              >
                <div className="space-y-1">
                  <CardTitle className={panelTitleClass}>Sistem Yedekleri</CardTitle>
                  <CardDescription className={panelDescriptionClass}>
                    Otomatik ve manuel sistem yedekleriniz
                  </CardDescription>
                </div>
                <Button className={primaryActionButtonClass} size="sm">
                  <HardDrive className="h-4 w-4" />
                  Yeni Yedek Oluştur
                </Button>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="hidden min-w-full grid-cols-6 gap-4 text-xs uppercase tracking-[0.3em] text-white/45 lg:grid">
                  <span>ID</span>
                  <span>Tarih</span>
                  <span>Boyut</span>
                  <span>Tür</span>
                  <span>Durum</span>
                  <span className="text-right">İşlemler</span>
                </div>
                <div className="space-y-3">
                  {systemInfo.backups.map(backup => (
                    <motion.div
                      key={backup.id}
                      variants={itemVariants}
                      className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/75 shadow-inner lg:grid-cols-6 lg:items-center"
                    >
                      <span className="font-medium text-white">{backup.id}</span>
                      <span>{formatDate(backup.date)}</span>
                      <span>{backup.size}</span>
                      <span>{backup.type}</span>
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={cn(
                            metricsBadgeClass,
                            backupStatusStyles[backup.status],
                            backup.status === 'in_progress' && 'animate-pulse'
                          )}
                        >
                          {backup.status === 'completed' ? (
                            <Check className="h-3 w-3" />
                          ) : backup.status === 'in_progress' ? (
                            <Server className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          {backup.status === 'completed'
                            ? ' Tamamlandı'
                            : backup.status === 'in_progress'
                              ? ' İşlemde'
                              : ' Başarısız'}
                        </span>
                      </span>
                      <div className="flex items-center gap-2 lg:justify-end">
                        <Button className={ghostPillButtonClass} size="sm">
                          <Download className="h-4 w-4" />
                          İndir
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className={cn(panelClass, 'space-y-8 p-8')}>
              <div className={panelOverlayClass} />
              <CardHeader className={cn(panelHeaderClass, 'space-y-2')}>
                <CardTitle className={panelTitleClass}>Sistem Ayarları</CardTitle>
                <CardDescription className={panelDescriptionClass}>
                  Gelişmiş yapılandırma seçenekleri
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-8">
                <motion.div variants={itemVariants} className="space-y-4">
                  <span className={sectionTaglineClass}>Yedekleme</span>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className={labelClass} htmlFor="system-backup-frequency">
                        Yedekleme Sıklığı
                      </label>
                      <select
                        id="system-backup-frequency"
                        className={cn(inputControlClass, 'pr-10')}
                        defaultValue="daily"
                      >
                        <option value="daily">Günlük</option>
                        <option value="weekly">Haftalık</option>
                        <option value="monthly">Aylık</option>
                      </select>
                      <p className={helperTextClass}>Otomatik yedeklerin çalışacağı periyot.</p>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass} htmlFor="system-backup-retention">
                        Yedek Saklama Süresi
                      </label>
                      <select
                        id="system-backup-retention"
                        className={cn(inputControlClass, 'pr-10')}
                        defaultValue="30"
                      >
                        <option value="7">7 gün</option>
                        <option value="30">30 gün</option>
                        <option value="90">90 gün</option>
                      </select>
                      <p className={helperTextClass}>Eski yedeklerin otomatik silineceği süre.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <span className={sectionTaglineClass}>Loglama</span>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className={labelClass} htmlFor="system-log-level">
                        Log Seviyesi
                      </label>
                      <select
                        id="system-log-level"
                        className={cn(inputControlClass, 'pr-10')}
                        defaultValue="info"
                      >
                        <option value="info">Bilgi</option>
                        <option value="warn">Uyarı</option>
                        <option value="error">Hata</option>
                        <option value="debug">Debug</option>
                      </select>
                      <p className={helperTextClass}>Sistemin kaydedeceği minimum olay seviyesi.</p>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass} htmlFor="system-log-rotation">
                        Log Rotasyonu
                      </label>
                      <select
                        id="system-log-rotation"
                        className={cn(inputControlClass, 'pr-10')}
                        defaultValue="weekly"
                      >
                        <option value="daily">Günlük</option>
                        <option value="weekly">Haftalık</option>
                        <option value="size">Boyut bazlı</option>
                      </select>
                      <p className={helperTextClass}>Log dosyalarının dönüşüm periyodu.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <span className={sectionTaglineClass}>Güvenlik</span>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className={labelClass} htmlFor="system-mfa-setting">
                        İki Faktörlü Doğrulama
                      </label>
                      <select
                        id="system-mfa-setting"
                        className={cn(inputControlClass, 'pr-10')}
                        defaultValue="optional"
                      >
                        <option value="optional">İsteğe Bağlı</option>
                        <option value="required">Zorunlu</option>
                        <option value="disabled">Devre Dışı</option>
                      </select>
                      <p className={helperTextClass}>Panel kullanıcıları için MFA gereksinimi.</p>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass} htmlFor="system-session-timeout">
                        Oturum Süresi (dakika)
                      </label>
                      <input
                        id="system-session-timeout"
                        type="number"
                        className={inputControlClass}
                        defaultValue={60}
                        min={5}
                        max={1440}
                      />
                      <p className={helperTextClass}>
                        Pasif oturumların otomatik olarak kapandığı süre.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
              <CardFooter className="relative flex flex-wrap justify-end gap-3">
                <Button className={ghostPillButtonClass}>Sıfırla</Button>
                <Button className={primaryActionButtonClass}>Kaydet</Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className={dangerCardClass}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 flex-shrink-0 text-rose-100" />
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">Tehlike Bölgesi</h3>
                  <p className="text-sm text-rose-50/80">
                    Sistem yapılandırmasını sıfırlamak geri alınamaz. İşleme başlamadan önce güncel
                    bir tam yedek oluşturduğunuzdan emin olun.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button className={ghostPillButtonClass}>Dokümantasyonu Aç</Button>
                <Button className={cn(primaryActionButtonClass, 'bg-rose-500 hover:bg-rose-400')}>
                  <AlertCircle className="h-4 w-4" />
                  Sıfırlamayı Başlat
                </Button>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
