"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/contexts/i18n-context";
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
  AreaChart,
  Area,
} from "recharts";

// Renk paleti
const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

// Ülke bazlı kullanıcı dağılımı için veriler
const countryData = [
  { name: "Türkiye", value: 430 },
  { name: "ABD", value: 285 },
  { name: "Almanya", value: 163 },
  { name: "İngiltere", value: 142 },
  { name: "Fransa", value: 118 },
  { name: "Diğer", value: 237 },
];

// Kullanıcı etkileşim skor verileri
const engagementData = [
  { name: "1 Haz", yüksek: 20, orta: 45, düşük: 35 },
  { name: "8 Haz", yüksek: 24, orta: 48, düşük: 28 },
  { name: "15 Haz", yüksek: 27, orta: 52, düşük: 21 },
  { name: "22 Haz", yüksek: 32, orta: 48, düşük: 20 },
  { name: "29 Haz", yüksek: 35, orta: 50, düşük: 15 },
];

// Aktif kullanıcı verisi (son 30 gün)
const activeUserData = [
  { name: "1 Haz", günlük: 320, haftalık: 630, aylık: 925 },
  { name: "5 Haz", günlük: 350, haftalık: 650, aylık: 940 },
  { name: "10 Haz", günlük: 370, haftalık: 670, aylık: 960 },
  { name: "15 Haz", günlük: 390, haftalık: 685, aylık: 975 },
  { name: "20 Haz", günlük: 415, haftalık: 710, aylık: 1010 },
  { name: "25 Haz", günlük: 442, haftalık: 730, aylık: 1025 },
  { name: "30 Haz", günlük: 460, haftalık: 760, aylık: 1050 },
];

// Kullanıcı kaynak verileri
const acquisitionData = [
  { name: "Organik Arama", value: 35 },
  { name: "Doğrudan", value: 22 },
  { name: "Referans", value: 18 },
  { name: "Sosyal Medya", value: 15 },
  { name: "E-posta", value: 7 },
  { name: "Diğer", value: 3 },
];

// Kullanıcı yaş grupları
const ageData = [
  { name: "18-24", değer: 15 },
  { name: "25-34", değer: 38 },
  { name: "35-44", değer: 27 },
  { name: "45-54", değer: 12 },
  { name: "55+", değer: 8 },
];

// Kullanıcı platformları
const platformData = [
  { name: "Web", value: 65 },
  { name: "Mobil Web", value: 25 },
  { name: "Mobil Uygulama", value: 10 },
];

// Kullanıcı cihazları
const deviceData = [
  { name: "Masaüstü", value: 62 },
  { name: "Telefon", value: 33 },
  { name: "Tablet", value: 5 },
];

// Kullanıcı sadakat eğrisi (tutma oranı)
const retentionData = [
  { hafta: "W1", oran: 100 },
  { hafta: "W2", oran: 82 },
  { hafta: "W3", oran: 74 },
  { hafta: "W4", oran: 68 },
  { hafta: "W5", oran: 64 },
  { hafta: "W6", oran: 61 },
  { hafta: "W7", oran: 58 },
  { hafta: "W8", oran: 56 },
  { hafta: "W9", oran: 54 },
  { hafta: "W10", oran: 53 },
  { hafta: "W11", oran: 52 },
  { hafta: "W12", oran: 51 },
];

// Oturum süresi
const sessionData = [
  { süre: "<1 dk", yüzde: 15 },
  { süre: "1-3 dk", yüzde: 25 },
  { süre: "3-5 dk", yüzde: 22 },
  { süre: "5-10 dk", yüzde: 20 },
  { süre: "10-30 dk", yüzde: 13 },
  { süre: ">30 dk", yüzde: 5 },
];

export default function UserAnalyticsPage() {
  const { t } = useI18n();
  const [timeframe, setTimeframe] = useState("month");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simüle edilmiş yükleme
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [timeframe]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("admin.userAnalytics", "Kullanıcı Analitikleri")}</h1>
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t("admin.totalUsers", "Toplam Kullanıcı")}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">1,375</h3>
              <p className="text-sm text-emerald-500">+14.6%</p>
            </div>
            <p className="text-xs text-muted-foreground">Geçen aya göre</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t("admin.activeUsers", "Aktif Kullanıcılar")}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">628</h3>
              <p className="text-sm text-emerald-500">+8.2%</p>
            </div>
            <p className="text-xs text-muted-foreground">Son 30 gün</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t("admin.conversionRate", "Dönüşüm Oranı")}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">3.8%</h3>
              <p className="text-sm text-amber-500">-0.4%</p>
            </div>
            <p className="text-xs text-muted-foreground">Ziyaretçilerden üyelere</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t("admin.avgSessionDuration", "Ortalama Oturum")}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">4:35</h3>
              <p className="text-sm text-emerald-500">+0:42</p>
            </div>
            <p className="text-xs text-muted-foreground">Dakika:Saniye</p>
          </div>
        </div>
      </div>

      {/* Grafik Konteynerları */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Aktif Kullanıcılar Zaman Grafiği */}
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">{t("admin.activeUsers", "Aktif Kullanıcılar")}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activeUserData}
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
                  dataKey="günlük"
                  name="Günlük Aktif"
                  stroke="#4f46e5"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="haftalık" name="Haftalık Aktif" stroke="#10b981" />
                <Line type="monotone" dataKey="aylık" name="Aylık Aktif" stroke="#f59e0b" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kullanıcı Sadakat Eğrisi (Tutma Oranı) */}
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">{t("admin.retentionCurve", "Kullanıcı Tutma Eğrisi")}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={retentionData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hafta" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="oran"
                  name="Tutma Oranı (%)"
                  stroke="#8b5cf6"
                  fill="#8b5cf680"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kullanıcı Edinme Kaynakları */}
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">{t("admin.acquisitionChannels", "Kullanıcı Edinme Kanalları")}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={acquisitionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {acquisitionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kullanıcı Etkileşim Skorları */}
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">{t("admin.engagementScores", "Kullanıcı Etkileşim Skorları")}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={engagementData}
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
                <Bar dataKey="düşük" name="Düşük Etkileşim" stackId="a" fill="#ef4444" />
                <Bar dataKey="orta" name="Orta Etkileşim" stackId="a" fill="#f59e0b" />
                <Bar dataKey="yüksek" name="Yüksek Etkileşim" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kullanıcı Coğrafi Dağılımı */}
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">{t("admin.geographicDistribution", "Coğrafi Dağılım")}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={countryData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 60,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Kullanıcı Sayısı" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kullanıcı Platformları */}
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">{t("admin.userPlatforms", "Kullanıcı Platformları")}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* İkinci Row Grafik Konteynerları */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Oturum Süreleri */}
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">{t("admin.sessionDuration", "Oturum Süreleri")}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sessionData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="süre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="yüzde" name="Kullanıcı Yüzdesi" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kullanıcı Yaş Grupları */}
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">{t("admin.ageGroups", "Yaş Grupları")}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageData}
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
                <Bar dataKey="değer" name="Yüzde (%)" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
