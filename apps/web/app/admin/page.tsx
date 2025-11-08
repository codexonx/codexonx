'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  Package,
  CreditCard,
  Activity,
  ArrowUp,
  ArrowDown,
  Info,
  Lightbulb,
  AlertCircle,
  GaugeCircle,
  BarChart2,
  Sparkles,
  Plus,
  ArrowUpRight,
  Clock,
  ChevronRight,
  FileText,
  RefreshCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard';
import { StatisticsReport } from '@/components/dashboard/statistics-report';
import { Logo } from '@/components/ui/logo';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { useI18n } from '@/contexts/i18n-context';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    usersCount: 0,
    projectsCount: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    userGrowth: 0,
    projectGrowth: 0,
    revenueGrowth: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Bu sadece simüle edilmiş veridir, gerçek uygulamada API isteği yapılacaktır
        setTimeout(() => {
          setStats({
            usersCount: 352,
            projectsCount: 687,
            activeSubscriptions: 218,
            monthlyRevenue: 15800,
            userGrowth: 12.4,
            projectGrowth: 8.7,
            revenueGrowth: 15.2,
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Dashboard veri hatası:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Animasyon varyantları
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // Bilgiler ve durumlar
  const suggestions = [
    {
      title: t('dashboard.suggestions.apiUsage'),
      description: t('dashboard.suggestions.apiDescription'),
      icon: GaugeCircle,
      color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    {
      title: t('dashboard.suggestions.security'),
      description: t('dashboard.suggestions.securityDescription'),
      icon: AlertCircle,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
    },
    {
      title: t('dashboard.suggestions.performance'),
      description: t('dashboard.suggestions.performanceDescription'),
      icon: Lightbulb,
      color: 'text-sky-600 bg-sky-100 dark:bg-sky-900/30 dark:text-sky-400',
    },
  ];

  const quickActions = [
    { name: t('dashboard.actions.newProject'), icon: Plus, href: '/admin/projects/new' },
    { name: t('dashboard.actions.analytics'), icon: BarChart2, href: '/admin/analytics' },
    { name: t('dashboard.actions.aiFeatures'), icon: Sparkles, href: '/admin/ai' },
    { name: t('dashboard.actions.reports'), icon: FileText, href: '/admin/reports' },
  ];

  const recentActivity = [
    {
      type: 'project',
      title: 'E-Ticaret API',
      action: 'created',
      time: '35 dakika önce',
      user: 'Ahmet Yılmaz',
    },
    {
      type: 'subscription',
      title: 'Pro Plan',
      action: 'upgraded',
      time: '2 saat önce',
      user: 'Ayşe Kara',
    },
    {
      type: 'api',
      title: 'Ödeme API',
      action: 'limit_changed',
      time: '5 saat önce',
      user: 'Sistem',
    },
  ];

  // İstatistik kartı bileşeni
  const StatCard = ({ title, value, change, icon: Icon, accentColor = 'primary' }: any) => (
    <motion.div
      custom={1}
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="overflow-hidden"
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className={`rounded-md bg-${accentColor}/10 p-2 text-${accentColor}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change !== undefined && (
            <div className="flex items-center pt-1 text-xs">
              {change >= 0 ? (
                <span className="flex items-center text-emerald-500">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span>{change}%</span>
                </span>
              ) : (
                <span className="flex items-center text-rose-500">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  <span>{Math.abs(change)}%</span>
                </span>
              )}
              <span className="ml-1.5 text-muted-foreground">
                {t('dashboard.comparedToPrevious')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Hoş Geldiniz Bölümü */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.div
            custom={0}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="space-y-0.5"
          >
            <h1 className="text-2xl font-bold tracking-tight">{t('dashboard.welcome')}</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex items-center gap-2"
          >
            <Button size="sm" variant="outline" className="gap-1.5">
              <RefreshCcw className="h-3.5 w-3.5" />
              {t('dashboard.refresh')}
            </Button>

            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              {t('dashboard.newProject')}
            </Button>
          </motion.div>
        </div>

        {/* Ana İstatistikler */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t('dashboard.stats.totalUsers')}
            value={stats.usersCount.toLocaleString()}
            change={stats.userGrowth}
            icon={Users}
            accentColor="indigo"
          />

          <StatCard
            title={t('dashboard.stats.projects')}
            value={stats.projectsCount.toLocaleString()}
            change={stats.projectGrowth}
            icon={Package}
            accentColor="emerald"
          />

          <StatCard
            title={t('dashboard.stats.activeSubscriptions')}
            value={stats.activeSubscriptions.toLocaleString()}
            change={((stats.activeSubscriptions / stats.usersCount) * 100).toFixed(1)}
            icon={CreditCard}
            accentColor="violet"
          />

          <StatCard
            title={t('dashboard.stats.monthlyRevenue')}
            value={formatCurrency(stats.monthlyRevenue)}
            change={stats.revenueGrowth}
            icon={Activity}
            accentColor="pink"
          />
        </div>

        {/* İstatistik Grafiği ve Öneriler */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Ana Grafik */}
          <motion.div
            custom={2}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t('dashboard.analytics.title')}</CardTitle>
                    <CardDescription>{t('dashboard.analytics.description')}</CardDescription>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      {t('dashboard.analytics.weekly')}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                      {t('dashboard.analytics.monthly')}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      {t('dashboard.analytics.yearly')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px] w-full flex items-center justify-center">
                  {/* Buraya gerçek grafik bileşeni eklenecek */}
                  <BarChart2 className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Öneriler */}
          <motion.div custom={3} variants={fadeInUp} initial="initial" animate="animate">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t('dashboard.insights')}</CardTitle>
                <CardDescription>{t('dashboard.insightsDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex gap-3">
                      <div className={`p-2 rounded-full ${suggestion.color} h-fit`}>
                        <suggestion.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{suggestion.title}</h4>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-start">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  {t('dashboard.viewAllInsights')}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Hızlı Eylemler ve Son Aktiviteler */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Hızlı Eylemler */}
          <motion.div custom={4} variants={fadeInUp} initial="initial" animate="animate">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <Link href={action.href} key={index}>
                      <Button variant="outline" className="h-auto p-4 w-full justify-start">
                        <div className="flex flex-col items-start gap-1">
                          <span className="rounded-full bg-primary/10 p-1.5">
                            <action.icon className="h-4 w-4 text-primary" />
                          </span>
                          <span className="font-medium text-sm mt-1">{action.name}</span>
                        </div>
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Son Aktiviteler */}
          <motion.div custom={5} variants={fadeInUp} initial="initial" animate="animate">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
                  <Button size="sm" variant="ghost" className="gap-1 h-7 px-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs">{t('dashboard.viewAll')}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 px-6 border-b last:border-0 hover:bg-muted/50"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`rounded-full p-1.5 ${getActivityTypeColor(activity.type)}`}
                        >
                          {getActivityTypeIcon(activity.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.user} {getActivityActionText(activity.action)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-xs text-muted-foreground pr-2">{activity.time}</p>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-3">
                <Button variant="outline" className="w-full">
                  {t('dashboard.viewAllActivity')}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* En altta geniş kart - özet veya performans istatistikleri */}
        <motion.div custom={6} variants={fadeInUp} initial="initial" animate="animate">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>{t('dashboard.performanceOverview')}</CardTitle>
              <CardDescription>{t('dashboard.performanceDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-[3/1] bg-gradient-to-br from-muted/50 to-muted border-y flex items-center justify-center">
                <div className="max-w-md text-center p-6">
                  <Logo size="lg" animated className="mx-auto mb-6" />
                  <h3 className="text-xl font-bold mb-2">{t('dashboard.codexonxPlatform')}</h3>
                  <p className="text-muted-foreground">{t('dashboard.platformDescription')}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost">{t('dashboard.documentation')}</Button>
              <Button>{t('dashboard.getStarted')}</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );

  // Yardımcı fonksiyonlar
  function getActivityTypeColor(type: string) {
    switch (type) {
      case 'project':
        return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'subscription':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'api':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  }

  function getActivityTypeIcon(type: string) {
    switch (type) {
      case 'project':
        return <FileText className="h-3.5 w-3.5" />;
      case 'subscription':
        return <CreditCard className="h-3.5 w-3.5" />;
      case 'api':
        return <Activity className="h-3.5 w-3.5" />;
      default:
        return <Info className="h-3.5 w-3.5" />;
    }
  }

  function getActivityActionText(action: string) {
    switch (action) {
      case 'created':
        return 'oluşturdu';
      case 'upgraded':
        return 'yükseltme yaptı';
      case 'limit_changed':
        return 'limit değişikliği yaptı';
      default:
        return action;
    }
  }
}
