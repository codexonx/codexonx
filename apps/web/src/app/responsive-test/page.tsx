"use client";

import { useState, ChangeEvent } from 'react';
import { useMediaQuery } from "@/hooks/use-media-query";
import { MobileFriendlyLayout } from "@/components/layouts/mobile-friendly-layout";
import { useI18n } from "@/contexts/i18n-context";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Sun, 
  Moon,
  Search,
  Check,
  X,
  Menu,
  ExternalLink
} from "lucide-react";

export default function ResponsiveTestPage() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Ekran boyutlarını kontrol et
  const isMobile = useMediaQuery("(max-width: 639px)");
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Cihaz tipini belirle
  const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
  
  // Cihaza göre simge seç
  const DeviceIcon = isMobile ? Smartphone : isTablet ? Tablet : Monitor;

  return (
    <MobileFriendlyLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold">Responsive Test</h1>
            <p className="text-muted-foreground">Farklı ekran boyutlarında uyumluluk testi</p>
          </div>
          
          <div className="flex items-center gap-2">
            <DeviceIcon className="w-5 h-5" />
            <span className="capitalize">{deviceType}</span>
            <span className="text-xs bg-secondary rounded px-2 py-1 hidden md:inline-block">
              {window.innerWidth}x{window.innerHeight}px
            </span>
          </div>
        </div>

        {/* Responsive Search Bar */}
        <div className="mb-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="text"
              placeholder="Ara..."
              className="w-full pl-10 pr-4"
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchTerm("")}
                aria-label="Aramayı temizle"
                title="Aramayı temizle"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Responsive Tabs */}
        <Tabs defaultValue="cards" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="cards">Kartlar</TabsTrigger>
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="table" className="hidden md:block">Tablo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cards" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((num) => (
                <Card key={num} className="h-full">
                  <CardHeader>
                    <CardTitle>Kart {num}</CardTitle>
                    <CardDescription>Responsive kart örneği</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Bu bir örnek kart içeriğidir. Farklı ekran boyutlarında otomatik olarak düzenlenir.</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size={isMobile ? "sm" : "default"}>İptal</Button>
                    <Button size={isMobile ? "sm" : "default"}>Tamam</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="form" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgileri</CardTitle>
                <CardDescription>Profil bilgilerinizi güncelleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input id="name" placeholder="Ad Soyad" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input id="email" placeholder="E-posta adresi" type="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Hakkında</Label>
                  <textarea 
                    id="bio" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Kendiniz hakkında kısa bilgi"
                  ></textarea>
                </div>
              </CardContent>
              <CardFooter className={isMobile ? "flex-col space-y-2" : "flex-row justify-between"}>
                <Button variant="outline" className={isMobile ? "w-full" : ""}>İptal</Button>
                <Button className={isMobile ? "w-full" : ""}>Kaydet</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="table" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Son İşlemler</CardTitle>
                <CardDescription>Son 5 işlem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-2 text-left font-medium">İşlem ID</th>
                        <th className="py-3 px-2 text-left font-medium">Tarih</th>
                        <th className="py-3 px-2 text-left font-medium">Durum</th>
                        <th className="py-3 px-2 text-left font-medium">Tutar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((item) => (
                        <tr key={item} className="border-b">
                          <td className="py-3 px-2 font-mono">#TRX-{item}42{item}</td>
                          <td className="py-3 px-2">{new Date().toLocaleDateString()}</td>
                          <td className="py-3 px-2">
                            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              <Check className="w-3 h-3 mr-1" /> Tamamlandı
                            </span>
                          </td>
                          <td className="py-3 px-2 font-medium">₺{item * 100}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Responsive Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>Onayla</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <X className="w-4 h-4" />
            <span>Reddet</span>
          </Button>
          <Button variant="secondary" className="items-center justify-center gap-2 hidden sm:inline-flex">
            <Menu className="w-4 h-4" />
            <span>Menü</span>
          </Button>
          <Button variant="link" className="items-center justify-center gap-2 hidden md:inline-flex">
            <ExternalLink className="w-4 h-4" />
            <span>Daha Fazla</span>
          </Button>
        </div>
      </div>
    </MobileFriendlyLayout>
  );
}
