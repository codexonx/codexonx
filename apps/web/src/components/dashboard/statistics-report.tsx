"use client";

import { useState, useEffect } from "react";
import "@/styles/statistics.css";
import { useRouter } from "next/navigation";
import { useI18n } from "@/contexts/i18n-context";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronDown,
  Download,
  FileBarChart,
  FileSpreadsheet,
  FilePieChart,
  Calendar,
  Share2,
  Loader2,
  BarChart,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StatisticsReportProps {
  period?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  startDate?: Date;
  endDate?: Date;
  projectId?: string;
  onExport?: (format: "pdf" | "csv" | "excel" | "json") => void;
}

export function StatisticsReport({
  period = "monthly",
  startDate,
  endDate,
  projectId,
  onExport,
}: StatisticsReportProps) {
  const router = useRouter();
  const { t } = useI18n();
  
  const [isLoading, setIsLoading] = useState(true);
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv" | "excel" | "json">("pdf");
  const [exportLoading, setExportLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  // Rapor verilerini yükle
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);

      // Simüle edilmiş API isteği
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Örnek rapor verileri
        const data = {
          title: `${getPeriodTitle(period)} Raporu`,
          summary: {
            totalRequests: 12487,
            successfulRequests: 12245,
            failedRequests: 242,
            avgResponseTime: 326, // ms
            p95ResponseTime: 892, // ms
            uniqueUsers: 873,
            revenue: 4256.78,
            costEstimate: 1239.45,
            profit: 3017.33,
          },
          trends: {
            requestsGrowth: 8.2, // %
            usersGrowth: 12.5, // %
            revenueGrowth: 15.7, // %
          },
          topEndpoints: [
            { path: "/api/users", count: 4532, avgTime: 215 },
            { path: "/api/projects", count: 3281, avgTime: 342 },
            { path: "/api/analytics", count: 2145, avgTime: 528 },
            { path: "/api/auth/login", count: 1876, avgTime: 189 },
            { path: "/api/payments", count: 653, avgTime: 412 },
          ],
          errorBreakdown: [
            { code: 404, description: "Not Found", count: 124 },
            { code: 401, description: "Unauthorized", count: 67 },
            { code: 500, description: "Internal Server Error", count: 31 },
            { code: 429, description: "Too Many Requests", count: 18 },
            { code: 400, description: "Bad Request", count: 2 },
          ],
          dailyStats: Array(30)
            .fill(0)
            .map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (29 - i));
              return {
                date: date.toISOString().split("T")[0],
                requests: Math.floor(Math.random() * 600) + 200,
                users: Math.floor(Math.random() * 100) + 50,
                errors: Math.floor(Math.random() * 15),
                avgTime: Math.floor(Math.random() * 200) + 200,
              };
            }),
          userLocation: [
            { country: "Türkiye", count: 425, percentage: 48.7 },
            { country: "ABD", count: 137, percentage: 15.7 },
            { country: "Almanya", count: 86, percentage: 9.9 },
            { country: "İngiltere", count: 72, percentage: 8.2 },
            { country: "Diğer", count: 153, percentage: 17.5 },
          ],
          deviceBreakdown: [
            { type: "Desktop", count: 502, percentage: 57.5 },
            { type: "Mobile", count: 284, percentage: 32.5 },
            { type: "Tablet", count: 87, percentage: 10.0 },
          ],
          periodRange: {
            start: startDate || getPeriodStartDate(period),
            end: endDate || new Date(),
          },
        };

        setReportData(data);
      } catch (error) {
        console.error("Rapor verileri yüklenirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [period, startDate, endDate, projectId]);

  // Dönemi alınabilir başlığa çevir
  const getPeriodTitle = (p: string) => {
    switch (p) {
      case "daily":
        return "Günlük";
      case "weekly":
        return "Haftalık";
      case "monthly":
        return "Aylık";
      case "quarterly":
        return "Üç Aylık";
      case "yearly":
        return "Yıllık";
      default:
        return "Özel";
    }
  };

  // Dönem başlangıç tarihini hesapla
  const getPeriodStartDate = (p: string) => {
    const now = new Date();
    switch (p) {
      case "daily":
        return new Date(now.setHours(0, 0, 0, 0));
      case "weekly":
        const day = now.getDay();
        const diff = day === 0 ? 6 : day - 1; // Pazartesi gününe ayarla
        return new Date(now.setDate(now.getDate() - diff));
      case "monthly":
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case "quarterly":
        const quarter = Math.floor(now.getMonth() / 3);
        return new Date(now.getFullYear(), quarter * 3, 1);
      case "yearly":
        return new Date(now.getFullYear(), 0, 1);
      default:
        return now;
    }
  };

  // Rapor dışa aktarma
  const handleExport = async () => {
    setExportLoading(true);

    try {
      // Simüle edilmiş dışa aktarma işlemi
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (onExport) {
        onExport(exportFormat);
      } else {
        console.log(`${exportFormat.toUpperCase()} formatında dışa aktarma işlemi tamamlandı`);
      }
    } catch (error) {
      console.error("Dışa aktarma hatası:", error);
    } finally {
      setExportLoading(false);
    }
  };

  // Tarih formatı
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Rapor yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Rapor verileri bulunamadı</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Yeniden Dene
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rapor Başlığı ve Araçlar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{reportData.title}</h1>
          <p className="text-muted-foreground">
            {formatDate(reportData.periodRange.start)} - {formatDate(reportData.periodRange.end)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              title="Dışa Aktarma Formatı"
              aria-label="Dışa Aktarma Formatı"
            >
              <option value="pdf">PDF Dosyası</option>
              <option value="csv">CSV Dosyası</option>
              <option value="excel">Excel Dosyası</option>
              <option value="json">JSON Dosyası</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              disabled={exportLoading}
              onClick={handleExport}
            >
              {exportLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Dışa Aktar
            </Button>
          </div>

          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Paylaş
          </Button>

          <Button variant="outline" size="sm" onClick={() => router.push("/admin/analytics")}>
            <BarChart className="h-4 w-4 mr-2" />
            Analitiklere Git
          </Button>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam İstek</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.summary.totalRequests.toLocaleString()}
            </div>
            <div className="flex items-center pt-1 text-xs">
              {reportData.trends.requestsGrowth >= 0 ? (
                <span className="flex items-center text-green-500">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  <span className="ml-1">{reportData.trends.requestsGrowth}%</span>
                </span>
              ) : (
                <span className="flex items-center text-red-500">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <span className="ml-1">{Math.abs(reportData.trends.requestsGrowth)}%</span>
                </span>
              )}
              <span className="ml-1.5 text-muted-foreground">önceki döneme göre</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Benzersiz Kullanıcı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.summary.uniqueUsers.toLocaleString()}
            </div>
            <div className="flex items-center pt-1 text-xs">
              {reportData.trends.usersGrowth >= 0 ? (
                <span className="flex items-center text-green-500">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  <span className="ml-1">{reportData.trends.usersGrowth}%</span>
                </span>
              ) : (
                <span className="flex items-center text-red-500">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <span className="ml-1">{Math.abs(reportData.trends.usersGrowth)}%</span>
                </span>
              )}
              <span className="ml-1.5 text-muted-foreground">önceki döneme göre</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Yanıt Süresi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.summary.avgResponseTime} ms
            </div>
            <div className="flex items-center pt-1 text-xs">
              <span className="text-muted-foreground">
                P95: {reportData.summary.p95ResponseTime} ms
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gelir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(reportData.summary.revenue)}
            </div>
            <div className="flex items-center pt-1 text-xs">
              {reportData.trends.revenueGrowth >= 0 ? (
                <span className="flex items-center text-green-500">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  <span className="ml-1">{reportData.trends.revenueGrowth}%</span>
                </span>
              ) : (
                <span className="flex items-center text-red-500">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <span className="ml-1">{Math.abs(reportData.trends.revenueGrowth)}%</span>
                </span>
              )}
              <span className="ml-1.5 text-muted-foreground">önceki döneme göre</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* En Popüler Endpoint'ler */}
      <Card>
        <CardHeader>
          <CardTitle>En Çok Kullanılan Endpoint'ler</CardTitle>
          <CardDescription>Dönem içinde en çok istek yapılan API endpoint'leri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium">Endpoint</th>
                  <th className="py-3 px-4 text-left font-medium">İstek Sayısı</th>
                  <th className="py-3 px-4 text-left font-medium">Ort. Yanıt Süresi</th>
                  <th className="py-3 px-4 text-left font-medium">Oran</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topEndpoints.map((endpoint: any, index: number) => {
                  const percentage = (endpoint.count / reportData.summary.totalRequests) * 100;
                  
                  return (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-xs">{endpoint.path}</td>
                      <td className="py-3 px-4">{endpoint.count.toLocaleString()}</td>
                      <td className="py-3 px-4">{endpoint.avgTime} ms</td>
                      <td className="py-3 px-4">
                        <ProgressBar 
                          percentage={percentage} 
                          variant="primary"
                          showLabel
                          labelPosition="right"
                          label={`%${percentage.toFixed(1)}`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Hata Dağılımı */}
      <Card>
        <CardHeader>
          <CardTitle>Hata Dağılımı</CardTitle>
          <CardDescription>Dönem içinde karşılaşılan hatalar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium">Hata Kodu</th>
                  <th className="py-3 px-4 text-left font-medium">Açıklama</th>
                  <th className="py-3 px-4 text-left font-medium">Sayı</th>
                  <th className="py-3 px-4 text-left font-medium">Oran</th>
                </tr>
              </thead>
              <tbody>
                {reportData.errorBreakdown.map((error: any, index: number) => {
                  const percentage = (error.count / reportData.summary.failedRequests) * 100;
                  
                  return (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <span className={`inline-block rounded px-2 py-1 text-xs 
                          ${error.code >= 500 ? 'bg-red-100 text-red-800' : 
                            error.code >= 400 ? 'bg-amber-100 text-amber-800' : 
                              'bg-blue-100 text-blue-800'}`}>
                          {error.code}
                        </span>
                      </td>
                      <td className="py-3 px-4">{error.description}</td>
                      <td className="py-3 px-4">{error.count}</td>
                      <td className="py-3 px-4">
                        <ProgressBar 
                          percentage={percentage} 
                          variant={error.code >= 500 ? 'error' : error.code >= 400 ? 'warning' : 'info'}
                          showLabel
                          labelPosition="right"
                          label={`%${percentage.toFixed(1)}`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Kullanıcı Konumu ve Cihaz Dağılımı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kullanıcı Konumu */}
        <Card>
          <CardHeader>
            <CardTitle>Kullanıcı Konumu</CardTitle>
            <CardDescription>Kullanıcıların coğrafi dağılımı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium">Ülke</th>
                    <th className="py-3 px-4 text-left font-medium">Kullanıcı</th>
                    <th className="py-3 px-4 text-left font-medium">Oran</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.userLocation.map((location: any, index: number) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">{location.country}</td>
                      <td className="py-3 px-4">{location.count}</td>
                      <td className="py-3 px-4">
                        <ProgressBar 
                          percentage={location.percentage} 
                          variant="secondary"
                          showLabel
                          labelPosition="right"
                          label={`%${location.percentage.toFixed(1)}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Cihaz Dağılımı */}
        <Card>
          <CardHeader>
            <CardTitle>Cihaz Dağılımı</CardTitle>
            <CardDescription>Kullanıcıların cihaz türüne göre dağılımı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium">Cihaz Türü</th>
                    <th className="py-3 px-4 text-left font-medium">Kullanıcı</th>
                    <th className="py-3 px-4 text-left font-medium">Oran</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.deviceBreakdown.map((device: any, index: number) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">{device.type}</td>
                      <td className="py-3 px-4">{device.count}</td>
                      <td className="py-3 px-4">
                        <ProgressBar 
                          percentage={device.percentage} 
                          variant="accent"
                          showLabel
                          labelPosition="right"
                          label={`%${device.percentage.toFixed(1)}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maliyet ve Gelir Özeti */}
      <Card>
        <CardHeader>
          <CardTitle>Finansal Özet</CardTitle>
          <CardDescription>Dönem için maliyet ve gelir dağılımı</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Toplam Gelir</div>
              <div className="text-xl font-bold text-green-700 dark:text-green-500">
                {formatCurrency(reportData.summary.revenue)}
              </div>
            </div>
            
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Tahmini Maliyet</div>
              <div className="text-xl font-bold text-red-700 dark:text-red-500">
                {formatCurrency(reportData.summary.costEstimate)}
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Net Kâr</div>
              <div className="text-xl font-bold text-blue-700 dark:text-blue-500">
                {formatCurrency(reportData.summary.profit)}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => router.push("/admin/finances")}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Detaylı Finansal Rapor
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
