"use client";
// @ts-ignore - Tip tanımlarını geçici olarak görmezden gelelim

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MobileFriendlyLayout } from "@/components/layouts/mobile-friendly-layout";
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
} from "recharts";
import { useI18n } from "@/contexts/i18n-context";

// Renk paleti
const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AnalyticsPage() {
  const { t } = useI18n();
  const [timeframe, setTimeframe] = useState("month");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Ekran boyutunu kontrol et
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

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
              { name: "Pzt", users: 120, projects: 45, apiCalls: 780 },
              { name: "Sal", users: 132, projects: 62, apiCalls: 890 },
              { name: "Çar", users: 101, projects: 58, apiCalls: 678 },
              { name: "Per", users: 134, projects: 51, apiCalls: 1090 },
              { name: "Cum", users: 190, projects: 79, apiCalls: 1200 },
              { name: "Cmt", users: 76, projects: 36, apiCalls: 310 },
              { name: "Paz", users: 55, projects: 27, apiCalls: 170 },
            ],
            userGrowth: [
              { name: "Pzt", value: 15 },
              { name: "Sal", value: 12 },
              { name: "Çar", value: 8 },
              { name: "Per", value: 17 },
              { name: "Cum", value: 24 },
              { name: "Cmt", value: 9 },
              { name: "Paz", value: 5 },
            ],
            trafficSources: [
              { name: "Doğrudan", value: 400 },
              { name: "Organik Arama", value: 300 },
              { name: "Yönlendirme", value: 200 },
              { name: "Sosyal Medya", value: 150 },
              { name: "E-posta", value: 100 },
              { name: "Diğer", value: 50 },
            ],
            topEndpoints: [
              { name: "/api/auth", calls: 320 },
              { name: "/api/projects", calls: 280 },
              { name: "/api/users", calls: 220 },
              { name: "/api/analytics", calls: 190 },
              { name: "/api/billing", calls: 120 },
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
              { name: "1 Haz", users: 450, projects: 190, apiCalls: 3200 },
              { name: "8 Haz", users: 520, projects: 230, apiCalls: 4100 },
              { name: "15 Haz", users: 580, projects: 245, apiCalls: 4800 },
              { name: "22 Haz", users: 650, projects: 290, apiCalls: 5200 },
              { name: "29 Haz", users: 808, projects: 358, apiCalls: 5118 },
            ],
            userGrowth: [
              { name: "1 Haz", value: 45 },
              { name: "8 Haz", value: 70 },
              { name: "15 Haz", value: 60 },
              { name: "22 Haz", value: 70 },
              { name: "29 Haz", value: 158 },
            ],
            trafficSources: [
              { name: "Doğrudan", value: 1200 },
              { name: "Organik Arama", value: 900 },
              { name: "Yönlendirme", value: 700 },
              { name: "Sosyal Medya", value: 450 },
              { name: "E-posta", value: 350 },
              { name: "Diğer", value: 180 },
            ],
            topEndpoints: [
              { name: "/api/auth", calls: 1250 },
              { name: "/api/projects", calls: 980 },
              { name: "/api/users", calls: 820 },
              { name: "/api/analytics", calls: 750 },
              { name: "/api/billing", calls: 680 },
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
          setData(timeframe === "week" ? weeklyData : monthlyData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Analitik veri yükleme hatası:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  // Para formatı
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
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

  return (
    <MobileFriendlyLayout className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("admin.analytics")}</h1>
        <div className="flex items-center space-x-2">
          <button
            className={`px-4 py-2 text-sm rounded-md ${
              timeframe === "week"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => setTimeframe("week")}
          >
            {t("dashboard.weeklyStats")}
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-md ${
              timeframe === "month"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => setTimeframe("month")}
          >
            {t("dashboard.monthlyStats")}
          </button>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 shadow">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t("dashboard.totalProjects")}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">{data.summary.totalProjects}</h3>
              <p className="text-sm text-emerald-500">
                {Math.round((data.summary.activeProjects / data.summary.totalProjects) * 100)}% aktif
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t("admin.totalRevenue")}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">{formatCurrency(data.summary.revenue)}</h3>
              <p className="text-sm text-emerald-500">+{timeframe === "week" ? "18" : "32"}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t("admin.activeUsers")}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">{data.summary.activeUsers}</h3>
              <p className="text-sm text-emerald-500">
                {Math.round((data.summary.activeUsers / data.summary.totalUsers) * 100)}% aktif
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Aktivite Grafikleri */}
      <div className={`grid grid-cols-1 gap-6 ${!isMobile ? 'lg:grid-cols-2' : ''}`}>
        {/* Kullanıcı ve Proje Aktivitesi */}
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">{t("dashboard.usageStats")}</h3>
          <div className="h-80">
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" name={t("admin.users")} fill="#4f46e5" />
                <Bar dataKey="projects" name={t("admin.projects")} fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* API Çağrıları */}
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">{t("dashboard.apiCalls")}</h3>
          <div className="h-80">
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="apiCalls"
                  name="API Çağrıları"
                  stroke="#f59e0b"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trafik Kaynakları */}
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">{t("dashboard.trafficSources")}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.trafficSources.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kullanıcı Büyümesi */}
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">{t("admin.userGrowth")}</h3>
          <div className="h-80">
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name={t("admin.newSignups")} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popüler Endpoint'ler */}
      <div className="rounded-lg border bg-card p-4 shadow">
        <h3 className="mb-4 text-lg font-medium">{t("dashboard.popularEndpoints")}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Endpoint</th>
                <th className="py-2 text-right">API Çağrıları</th>
              </tr>
            </thead>
            <tbody>
              {data.topEndpoints.map((endpoint: { name: string; calls: number }, index: number) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-2 font-medium">{endpoint.name}</td>
                  <td className="py-2 text-right">{endpoint.calls.toLocaleString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MobileFriendlyLayout>
  );
}
