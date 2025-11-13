'use client';
// @ts-ignore - Tip tanımlarını geçici olarak görmezden gelelim

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MobileFriendlyLayout } from '@/components/layouts/mobile-friendly-layout';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useI18n } from '@/contexts/i18n-context';
import { cn } from '@/lib/utils';

// Renk paleti
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const cardShellClass =
  'relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_45px_90px_rgba(4,6,16,0.55)] backdrop-blur-xl';
const subtleOverlayClass =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.18),transparent_70%),radial-gradient(circle_at_bottom_right,rgba(84,120,255,0.18),transparent_72%)]';
const chartOverlayClass =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,44,0.14),transparent_72%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.18),transparent_74%)]';
const tableOverlayClass =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,44,0.18),transparent_70%),radial-gradient(circle_at_bottom_left,rgba(84,120,255,0.18),transparent_74%)]';
const toggleButtonBaseClass =
  'relative flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-white/70 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white';
const toggleButtonActiveClass =
  'border-primary/60 bg-primary/25 text-white shadow-[0_0_30px_rgba(255,107,44,0.35)]';
const sectionBadgeClass =
  'inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.4em] text-white/45';

const glowAccentDotClass =
  'h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(255,107,44,0.65)]';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
} as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: Math.min(index * 0.06, 0.3) },
  }),
} as const;

const tableRowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: 'easeOut', delay: Math.min(index * 0.05, 0.35) },
  }),
} as const;

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} as const;

export default function AnalyticsPage() {
  const { t } = useI18n();
  const [timeframe, setTimeframe] = useState('month');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Ekran boyutunu kontrol et
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const chartHeightClass = isMobile ? 'h-[260px]' : isTablet ? 'h-[320px]' : 'h-[360px]';

  // Veri yükleme simülasyonu
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gerçek uygulamada API isteği yapılacaktır
        // Şimdilik simüle edilmiş veriler kullanılacak
        setTimeout(() => {
          // Haftalık veriler
          const weeklyData = {
            userActivity: [
              { name: 'Pzt', users: 120, projects: 45, apiCalls: 780 },
              { name: 'Sal', users: 132, projects: 62, apiCalls: 890 },
              { name: 'Çar', users: 101, projects: 58, apiCalls: 678 },
              { name: 'Per', users: 134, projects: 51, apiCalls: 1090 },
              { name: 'Cum', users: 190, projects: 79, apiCalls: 1200 },
              { name: 'Cmt', users: 76, projects: 36, apiCalls: 310 },
              { name: 'Paz', users: 55, projects: 27, apiCalls: 170 },
            ],
            userGrowth: [
              { name: 'Pzt', value: 15 },
              { name: 'Sal', value: 12 },
              { name: 'Çar', value: 8 },
              { name: 'Per', value: 17 },
              { name: 'Cum', value: 24 },
              { name: 'Cmt', value: 9 },
              { name: 'Paz', value: 5 },
            ],
            trafficSources: [
              { name: 'Doğrudan', value: 400 },
              { name: 'Organik Arama', value: 300 },
              { name: 'Yönlendirme', value: 200 },
              { name: 'Sosyal Medya', value: 150 },
              { name: 'E-posta', value: 100 },
              { name: 'Diğer', value: 50 },
            ],
            topEndpoints: [
              { name: '/api/auth', calls: 320 },
              { name: '/api/projects', calls: 280 },
              { name: '/api/users', calls: 220 },
              { name: '/api/analytics', calls: 190 },
              { name: '/api/billing', calls: 120 },
            ],
            summary: {
              totalUsers: 808,
              activeUsers: 628,
              totalProjects: 358,
              activeProjects: 290,
              totalAPICalls: 5118,
              revenue: 12560,
            },
          };

          // Aylık veriler
          const monthlyData = {
            userActivity: [
              { name: '1 Haz', users: 450, projects: 190, apiCalls: 3200 },
              { name: '8 Haz', users: 520, projects: 230, apiCalls: 4100 },
              { name: '15 Haz', users: 580, projects: 245, apiCalls: 4800 },
              { name: '22 Haz', users: 650, projects: 290, apiCalls: 5200 },
              { name: '29 Haz', users: 808, projects: 358, apiCalls: 5118 },
            ],
            userGrowth: [
              { name: '1 Haz', value: 45 },
              { name: '8 Haz', value: 70 },
              { name: '15 Haz', value: 60 },
              { name: '22 Haz', value: 70 },
              { name: '29 Haz', value: 158 },
            ],
            trafficSources: [
              { name: 'Doğrudan', value: 1200 },
              { name: 'Organik Arama', value: 900 },
              { name: 'Yönlendirme', value: 700 },
              { name: 'Sosyal Medya', value: 450 },
              { name: 'E-posta', value: 350 },
              { name: 'Diğer', value: 180 },
            ],
            topEndpoints: [
              { name: '/api/auth', calls: 1250 },
              { name: '/api/projects', calls: 980 },
              { name: '/api/users', calls: 820 },
              { name: '/api/analytics', calls: 750 },
              { name: '/api/billing', calls: 680 },
            ],
            summary: {
              totalUsers: 808,
              activeUsers: 628,
              totalProjects: 358,
              activeProjects: 290,
              totalAPICalls: 22418,
              revenue: 45750,
            },
          };

          // Veri süresine göre set et
          setData(timeframe === 'week' ? weeklyData : monthlyData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Analitik veri yükleme hatası:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  // Para formatı
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const activeProjectPercent = data.summary.totalProjects
    ? Math.round((data.summary.activeProjects / data.summary.totalProjects) * 100)
    : 0;
  const activeUserPercent = data.summary.totalUsers
    ? Math.round((data.summary.activeUsers / data.summary.totalUsers) * 100)
    : 0;

  const summaryMetrics = [
    {
      title: t('dashboard.totalProjects'),
      value: data.summary.totalProjects.toLocaleString('tr-TR'),
      helper: `${activeProjectPercent}% aktif`,
      accentClass: 'text-sky-300',
    },
    {
      title: t('admin.totalRevenue'),
      value: formatCurrency(data.summary.revenue),
      helper: `+${timeframe === 'week' ? '18' : '32'}%`,
      accentClass: 'text-emerald-300',
    },
    {
      title: t('admin.activeUsers'),
      value: data.summary.activeUsers.toLocaleString('tr-TR'),
      helper: `${activeUserPercent}% aktif`,
      accentClass: 'text-amber-300',
    },
  ];

  return (
    <MobileFriendlyLayout className="space-y-8">
      <motion.div className="space-y-8" variants={pageVariants} initial="hidden" animate="visible">
        <motion.div className={cn(cardShellClass, 'px-6 py-6')} variants={sectionVariants}>
          <div className={subtleOverlayClass} aria-hidden />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-white/60">
                <span className={glowAccentDotClass} />
                <span className="uppercase tracking-[0.45em] text-white/45">
                  {t('admin.analytics')}
                </span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  Codexonx Analitik Kontrol Merkezi
                </h1>
                <p className="max-w-xl text-sm text-white/65">
                  Platformunuzun büyümesini, trafik kaynaklarını ve API performansını tek panelden
                  takip edin. Turuncu/siyah glow ile anlık durumunuza odaklanın.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={() => setTimeframe('week')}
                className={cn(
                  toggleButtonBaseClass,
                  timeframe === 'week' && toggleButtonActiveClass
                )}
              >
                Haftalık
              </Button>
              <Button
                type="button"
                onClick={() => setTimeframe('month')}
                className={cn(
                  toggleButtonBaseClass,
                  timeframe === 'month' && toggleButtonActiveClass
                )}
              >
                Aylık
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={gridVariants}
        >
          {summaryMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              className={cn(cardShellClass, 'px-5 py-5')}
              variants={itemVariants}
              custom={index}
            >
              <div className={subtleOverlayClass} aria-hidden />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span className="uppercase tracking-[0.32em] text-white/45">{metric.title}</span>
                  <span className={cn('font-medium', metric.accentClass)}>{metric.helper}</span>
                </div>
                <span className="text-3xl font-semibold text-white">{metric.value}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={cn('grid grid-cols-1 gap-6', !isMobile && 'lg:grid-cols-2')}
          variants={gridVariants}
        >
          <motion.div
            className={cn(cardShellClass, 'px-6 py-5')}
            variants={itemVariants}
            custom={0}
          >
            <div className={chartOverlayClass} aria-hidden />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.32em] text-white/45">
                  {t('dashboard.usageStats')}
                </span>
                <span className="text-xs text-white/45">
                  {timeframe === 'week' ? '7 gün' : '30 gün'}
                </span>
              </div>
              <div className={chartHeightClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.userActivity}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#ffffff60" tickLine={false} />
                    <YAxis stroke="#ffffff60" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f111a', borderRadius: 12 }} />
                    <Legend />
                    <Bar
                      dataKey="users"
                      name={t('admin.users')}
                      fill="#4f46e5"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="projects"
                      name={t('admin.projects')}
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={cn(cardShellClass, 'px-6 py-5')}
            variants={itemVariants}
            custom={1}
          >
            <div className={chartOverlayClass} aria-hidden />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.32em] text-white/45">
                  {t('dashboard.apiCalls')}
                </span>
                <span className="text-xs text-white/45">
                  {timeframe === 'week' ? 'API / Gün' : 'API / Gün'}
                </span>
              </div>
              <div className={chartHeightClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.userActivity}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#ffffff60" tickLine={false} />
                    <YAxis stroke="#ffffff60" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f111a', borderRadius: 12 }} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="apiCalls"
                      name="API Çağrıları"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ r: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={cn(cardShellClass, 'px-6 py-5')}
            variants={itemVariants}
            custom={2}
          >
            <div className={chartOverlayClass} aria-hidden />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.32em] text-white/45">
                  {t('dashboard.trafficSources')}
                </span>
                <span className="text-xs text-white/45">
                  {timeframe === 'week' ? 'Bu hafta' : 'Bu ay'}
                </span>
              </div>
              <div className={chartHeightClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.trafficSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                      outerRadius={isMobile ? 80 : 100}
                      innerRadius={isMobile ? 45 : 55}
                      dataKey="value"
                    >
                      {data.trafficSources.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip contentStyle={{ backgroundColor: '#0f111a', borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={cn(cardShellClass, 'px-6 py-5')}
            variants={itemVariants}
            custom={3}
          >
            <div className={chartOverlayClass} aria-hidden />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.32em] text-white/45">
                  {t('admin.userGrowth')}
                </span>
                <span className="text-xs text-white/45">Signup trendi</span>
              </div>
              <div className={chartHeightClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.userGrowth}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#ffffff60" tickLine={false} />
                    <YAxis stroke="#ffffff60" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f111a', borderRadius: 12 }} />
                    <Legend />
                    <Bar
                      dataKey="value"
                      name={t('admin.newSignups')}
                      fill="#8b5cf6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={cn(cardShellClass, 'overflow-hidden px-6 py-5')}
          variants={sectionVariants}
        >
          <div className={tableOverlayClass} aria-hidden />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                  {t('dashboard.popularEndpoints')}
                </p>
                <h3 className="text-lg font-semibold text-white">
                  Trafiğin yoğun olduğu API uçları
                </h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/60">
                {timeframe === 'week' ? '7 günlük görünüm' : '30 günlük görünüm'}
              </span>
            </div>

            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm text-white/70">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.3em] text-white/45">
                    <th className="py-3">Endpoint</th>
                    <th className="py-3 text-right">API Çağrıları</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topEndpoints.map(
                    (endpoint: { name: string; calls: number }, index: number) => (
                      <motion.tr
                        key={endpoint.name}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                        className="border-b border-white/[0.08] last:border-0"
                      >
                        <td className="py-3 font-medium text-white">{endpoint.name}</td>
                        <td className="py-3 text-right text-white/80">
                          {endpoint.calls.toLocaleString('tr-TR')}
                        </td>
                      </motion.tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </MobileFriendlyLayout>
  );
}
