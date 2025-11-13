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
import { cn } from '@/lib/utils';

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
      <Card className="relative overflow-hidden border-white/12 bg-white/[0.03] shadow-[0_30px_70px_rgba(4,6,16,0.45)] backdrop-blur-xl">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,44,0.16),transparent_70%),radial-gradient(circle_at_bottom_left,rgba(84,120,255,0.16),transparent_75%)]"
          aria-hidden
        />
        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-white/90">{title}</CardTitle>
            <div
              className={cn(
                'rounded-lg border border-white/10 bg-black/40 p-2 text-white/80 shadow-[0_0_22px_rgba(255,107,44,0.3)]',
                accentColor === 'emerald' &&
                  'shadow-[0_0_22px_rgba(16,185,129,0.3)] text-emerald-200',
                accentColor === 'violet' &&
                  'shadow-[0_0_22px_rgba(139,92,246,0.28)] text-violet-200',
                accentColor === 'pink' && 'shadow-[0_0_22px_rgba(236,72,153,0.28)] text-pink-200',
                accentColor === 'indigo' && 'shadow-[0_0_22px_rgba(99,102,241,0.3)] text-indigo-200'
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-semibold text-white">{value}</div>
          {change !== undefined && (
            <div className="mt-2 flex items-center text-xs">
              {change >= 0 ? (
                <span className="flex items-center text-emerald-300">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span>{change}%</span>
                </span>
              ) : (
                <span className="flex items-center text-rose-300">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  <span>{Math.abs(change)}%</span>
                </span>
              )}
              <span className="ml-1.5 text-white/60">{t('dashboard.comparedToPrevious')}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Hoş Geldiniz Bölümü */}
        <div className="flex flex-col gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_45px_85px_rgba(4,6,16,0.48)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div
            className="pointer-events-none absolute inset-0 hidden rounded-3xl bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.18),transparent_70%),radial-gradient(circle_at_bottom_right,rgba(84,120,255,0.18),transparent_70%)] md:block"
            aria-hidden
          />
          <motion.div
            custom={0}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="relative space-y-0.5"
          >
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              {t('dashboard.welcome')}
            </h1>
            <p className="text-sm text-white/60">
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
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Ana Grafik */}
          <motion.div
            custom={2}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="lg:col-span-2"
          >
            <Card className="relative overflow-hidden border-white/10 bg-white/[0.03] shadow-[0_40px_85px_rgba(4,6,16,0.55)] backdrop-blur-xl">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,44,0.22),transparent_72%),radial-gradient(circle_at_bottom_left,rgba(84,120,255,0.2),transparent_72%)]"
                aria-hidden
              />
              <CardHeader className="relative pb-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg font-semibold text-white">
                      {t('dashboard.analytics.title')}
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      {t('dashboard.analytics.description')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 p-1">
                    {[
                      t('dashboard.analytics.weekly'),
                      t('dashboard.analytics.monthly'),
                      t('dashboard.analytics.yearly'),
                    ].map((label, index) => (
                      <Button
                        key={label}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-7 rounded-full px-3 text-xs text-white/70 transition',
                          index === 1
                            ? 'border border-primary/40 bg-primary/20 text-white shadow-[0_0_25px_rgba(255,107,44,0.35)]'
                            : 'hover:border-primary/35 hover:bg-primary/15'
                        )}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative flex h-[300px] w-full items-center justify-center">
                <div
                  className="pointer-events-none absolute inset-6 rounded-3xl border border-dashed border-white/10"
                  aria-hidden
                />
                <BarChart2 className="h-16 w-16 text-white/40" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Öneriler */}
          <motion.div custom={3} variants={fadeInUp} initial="initial" animate="animate">
            <Card className="relative h-full overflow-hidden border-white/10 bg-white/[0.03] shadow-[0_40px_85px_rgba(4,6,16,0.55)] backdrop-blur-xl">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,107,44,0.18),transparent_70%),radial-gradient(circle_at_bottom,rgba(84,120,255,0.18),transparent_72%)]"
                aria-hidden
              />
              <CardHeader className="relative">
                <CardTitle className="text-white">{t('dashboard.insights')}</CardTitle>
                <CardDescription className="text-white/65">
                  {t('dashboard.insightsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative pb-2">
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={fadeInUp}
                      className="flex gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
                    >
                      <div className={cn('h-fit rounded-full p-2 text-white/90', suggestion.color)}>
                        <suggestion.icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white/90">{suggestion.title}</h4>
                        <p className="text-sm text-white/65">{suggestion.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="relative">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/15 hover:text-white"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  {t('dashboard.viewAllInsights')}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Hızlı Eylemler ve Son Aktiviteler */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Hızlı Eylemler */}
          <motion.div custom={4} variants={fadeInUp} initial="initial" animate="animate">
            <Card className="relative overflow-hidden border-white/10 bg-white/[0.03] shadow-[0_35px_85px_rgba(4,6,16,0.55)] backdrop-blur-xl">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,44,0.2),transparent_72%),radial-gradient(circle_at_bottom_left,rgba(84,120,255,0.18),transparent_74%)]"
                aria-hidden
              />
              <CardHeader className="relative">
                <CardTitle className="text-white">{t('dashboard.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <Link href={action.href} key={index}>
                      <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }}>
                        <div className="flex h-full flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-4 text-white/80 transition hover:border-primary/40 hover:bg-primary/15 hover:text-white">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/25 text-white shadow-[0_0_25px_rgba(255,107,44,0.35)]">
                            <action.icon className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-medium">{action.name}</span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Son Aktiviteler */}
          <motion.div custom={5} variants={fadeInUp} initial="initial" animate="animate">
            <Card className="relative overflow-hidden border-white/10 bg-white/[0.03] shadow-[0_35px_85px_rgba(4,6,16,0.55)] backdrop-blur-xl">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,44,0.18),transparent_70%),radial-gradient(circle_at_bottom_left,rgba(84,120,255,0.18),transparent_72%)]"
                aria-hidden
              />
              <CardHeader className="relative pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{t('dashboard.recentActivity')}</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 gap-1 rounded-full border border-white/15 px-3 text-xs text-white/75 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>{t('dashboard.viewAll')}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="relative p-0">
                <div className="divide-y divide-white/10">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={fadeInUp}
                      className="flex items-center justify-between px-6 py-4 transition hover:bg-white/[0.04]"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'rounded-full border border-white/15 p-2 text-white',
                            getActivityTypeColor(activity.type)
                          )}
                        >
                          {getActivityTypeIcon(activity.type)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{activity.title}</p>
                          <p className="text-xs text-white/65">
                            {activity.user} {getActivityActionText(activity.action)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/55">
                        <span>{activity.time}</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="relative pt-3">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-white/15 bg-white/[0.06] text-white/80 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white"
                >
                  {t('dashboard.viewAllActivity')}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* En altta geniş kart - özet veya performans istatistikleri */}
        <motion.div custom={6} variants={fadeInUp} initial="initial" animate="animate">
          <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-black/80 via-black/70 to-black/60 shadow-[0_45px_100px_rgba(4,6,16,0.6)] backdrop-blur-2xl">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.22),transparent_70%),radial-gradient(circle_at_bottom_right,rgba(84,120,255,0.22),transparent_72%)]"
              aria-hidden
            />
            <CardHeader className="relative">
              <CardTitle className="text-white">{t('dashboard.performanceOverview')}</CardTitle>
              <CardDescription className="text-white/65">
                {t('dashboard.performanceDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative p-0">
              <div className="flex aspect-[3/1] items-center justify-center border-y border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,107,44,0.08),transparent_75%)]">
                <div className="max-w-2xl p-8 text-center text-white">
                  <Logo size="lg" animated className="mx-auto mb-6" />
                  <h3 className="mb-2 text-2xl font-semibold">{t('dashboard.codexonxPlatform')}</h3>
                  <p className="text-sm text-white/70">{t('dashboard.platformDescription')}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative flex flex-wrap justify-between gap-3">
              <Button
                variant="ghost"
                className="rounded-full border border-white/15 px-4 text-white/80 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/15 hover:text-white"
              >
                {t('dashboard.documentation')}
              </Button>
              <Button className="rounded-full bg-primary/80 px-4 text-white shadow-[0_0_40px_rgba(255,107,44,0.5)] transition hover:-translate-y-0.5 hover:bg-primary">
                {t('dashboard.getStarted')}
              </Button>
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
        return 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200';
      case 'subscription':
        return 'border-purple-400/30 bg-purple-400/15 text-purple-200';
      case 'api':
        return 'border-sky-400/30 bg-sky-400/15 text-sky-200';
      default:
        return 'border-white/10 bg-white/10 text-white/75';
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
