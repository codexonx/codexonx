'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/use-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';

// Veri Tipleri
interface DataPoint {
  date: string;
  value: number;
}

interface ProjectDataPoint {
  date: string;
  active: number;
  inactive: number;
}

interface ChartDataItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface AnalyticsData {
  summary: {
    totalUsers: number;
    newUsers: number;
    userGrowth: number;
    activeProjects: number;
    totalProjects: number;
    projectGrowth: number;
    revenue: number;
    revenueGrowth: number;
    activeSubscriptions: number;
  };
  userData: DataPoint[];
  projectData: ProjectDataPoint[];
  revenueData: DataPoint[];
  subscriptionDistribution: ChartDataItem[];
  trafficSources: ChartDataItem[];
  userGeoDistribution: ChartDataItem[];
}
import {
  Users,
  Package,
  CreditCard,
  Activity,
  ArrowUp,
  ArrowDown,
  Calendar,
  LineChart,
  BarChart2 as BarChart,
  PieChart,
} from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { formatCurrency } from '@/lib/utils';

// Chart bileşenleri (react-chartjs-2 veya recharts kullanılabilir)
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalyticsProps {
  initialData?: any;
}

export function AnalyticsDashboard({ initialData }: AnalyticsProps) {
  const { t } = useI18n();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { callApi, isLoading, error } = useApi();

  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState<AnalyticsData>({
    summary: {
      totalUsers: 0,
      newUsers: 0,
      userGrowth: 0,
      activeProjects: 0,
      totalProjects: 0,
      projectGrowth: 0,
      revenue: 0,
      revenueGrowth: 0,
      activeSubscriptions: 0,
    },
    userData: [] as DataPoint[],
    projectData: [] as ProjectDataPoint[],
    revenueData: [] as DataPoint[],
    subscriptionDistribution: [] as ChartDataItem[],
    trafficSources: [] as ChartDataItem[],
    userGeoDistribution: [] as ChartDataItem[],
  });

  // Analitik verilerini yükle
  useEffect(() => {
    if (initialData) {
      setStats(initialData);
      return;
    }

    // Bu bir örnek simülasyon, gerçek uygulamada API çağrısı yapılacak
    const fetchAnalytics = async () => {
      try {
        // API çağrısını simüle ediyoruz
        await new Promise(resolve => setTimeout(resolve, 1000));

        const currentDate = new Date();
        const timeframeData = generateTimeframeData(timeframe, currentDate);

        const userData: DataPoint[] = timeframeData.map(date => ({
          date,
          value: Math.floor(Math.random() * 50) + 20,
        }));

        const projectData: ProjectDataPoint[] = timeframeData.map(date => ({
          date,
          active: Math.floor(Math.random() * 30) + 10,
          inactive: Math.floor(Math.random() * 20) + 5,
        }));

        const revenueData: DataPoint[] = timeframeData.map(date => ({
          date,
          value: Math.floor(Math.random() * 5000) + 1000,
        }));

        const subscriptionDistribution: ChartDataItem[] = [
          { name: 'Ücretsiz', value: 320 },
          { name: 'Başlangıç', value: 180 },
          { name: 'Pro', value: 250 },
          { name: 'Kurumsal', value: 122 },
        ];

        const trafficSources: ChartDataItem[] = [
          { name: 'Doğrudan', value: 45 },
          { name: 'Organik Arama', value: 30 },
          { name: 'Referans', value: 15 },
          { name: 'Sosyal Medya', value: 10 },
        ];

        const userGeoDistribution: ChartDataItem[] = [
          { name: 'Türkiye', value: 55 },
          { name: 'ABD', value: 15 },
          { name: 'Almanya', value: 10 },
          { name: 'İngiltere', value: 8 },
          { name: 'Diğer', value: 12 },
        ];

        setStats({
          summary: {
            totalUsers: 872,
            newUsers: 43,
            userGrowth: 8.7,
            activeProjects: 356,
            totalProjects: 512,
            projectGrowth: 12.3,
            revenue: 24850,
            revenueGrowth: 15.2,
            activeSubscriptions: 218,
          },
          userData,
          projectData,
          revenueData,
          subscriptionDistribution,
          trafficSources,
          userGeoDistribution,
        });
      } catch (error) {
        console.error('Analytics verileri yüklenemedi', error);
      }
    };

    fetchAnalytics();
  }, [initialData, timeframe]);

  // Seçilen zaman dilimine göre tarihleri üretir
  const generateTimeframeData = (timeframe: string, endDate: Date): string[] => {
    const dates: string[] = [];
    const end = new Date(endDate);

    let dataPoints = 0;
    let dateIncrement = 0;

    switch (timeframe) {
      case 'day':
        dataPoints = 24;
        dateIncrement = 1 / 24; // Gün içinde saatlik
        break;
      case 'week':
        dataPoints = 7;
        dateIncrement = 1; // Günlük
        break;
      case 'month':
        dataPoints = 30;
        dateIncrement = 1; // Günlük
        break;
      case 'year':
        dataPoints = 12;
        dateIncrement = 30; // Aylık
        break;
      default:
        dataPoints = 30;
        dateIncrement = 1;
    }

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date(end);
      date.setDate(date.getDate() - i * dateIncrement);

      let dateStr = '';
      if (timeframe === 'day') {
        dateStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      } else if (timeframe === 'year') {
        dateStr = date.toLocaleDateString('tr-TR', { month: 'short' });
      } else {
        dateStr = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      }

      dates.push(dateStr);
    }

    return dates;
  };

  // Grafik renkleri
  const COLORS = ['#4f46e5', '#06b6d4', '#7c3aed', '#ec4899', '#f59e0b'];

  // İstatistik kartı
  const StatCard = ({ title, value, growth, icon: Icon, colorClass }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-md p-2 ${colorClass || 'bg-primary/10'}`}>
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {growth !== undefined && (
          <div className="flex items-center pt-1 text-xs">
            {growth >= 0 ? (
              <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span className={growth >= 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(growth)}%
            </span>
            <span className="text-muted-foreground ml-2">geçen döneme göre</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
        <h2 className="text-3xl font-bold tracking-tight">{t('analytics.title')}</h2>

        <div className="flex items-center gap-2">
          <Tabs defaultValue={timeframe} onValueChange={(v: any) => setTimeframe(v)}>
            <TabsList>
              <TabsTrigger value="day">{t('analytics.day')}</TabsTrigger>
              <TabsTrigger value="week">{t('analytics.week')}</TabsTrigger>
              <TabsTrigger value="month">{t('analytics.month')}</TabsTrigger>
              <TabsTrigger value="year">{t('analytics.year')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('analytics.totalUsers')}
          value={stats.summary.totalUsers}
          growth={stats.summary.userGrowth}
          icon={Users}
        />
        <StatCard
          title={t('analytics.activeProjects')}
          value={stats.summary.activeProjects}
          growth={stats.summary.projectGrowth}
          icon={Package}
        />
        <StatCard
          title={t('analytics.revenue')}
          value={formatCurrency(stats.summary.revenue)}
          growth={stats.summary.revenueGrowth}
          icon={CreditCard}
        />
        <StatCard
          title={t('analytics.activeSubscriptions')}
          value={stats.summary.activeSubscriptions}
          icon={Activity}
        />
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Kullanıcı Grafiği */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.userChart')}</CardTitle>
            <CardDescription>{t('analytics.userChartDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ReLineChart data={stats.userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4f46e5"
                  name={t('analytics.users')}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
              </ReLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gelir Grafiği */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.revenueChart')}</CardTitle>
            <CardDescription>{t('analytics.revenueChartDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ReBarChart data={stats.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="value" fill="#4f46e5" name={t('analytics.revenue')} />
              </ReBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Abonelik Dağılımı */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.subscriptionDistribution')}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-[250px] h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={stats.subscriptionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.subscriptionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => value} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trafik Kaynakları */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.trafficSources')}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-[250px] h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={stats.trafficSources}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `${value}%`} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Coğrafi Dağılım */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.userGeoDistribution')}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-[250px] h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={stats.userGeoDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.userGeoDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `${value}%`} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* İndirilebilir Rapor Düğmesi */}
      <div className="flex justify-end mt-6">
        <Button className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          {t('analytics.downloadReport')}
        </Button>
      </div>
    </div>
  );
}
