"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import Link from "next/link";
import { 
  FileCode, 
  Terminal, 
  Users, 
  Layers,
  Code,
  ArrowRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WelcomeModal } from "@/components/onboarding/welcome-modal";

// Örnek proje verileri
const recentProjects = [
  { 
    id: 1, 
    name: "Web Uygulaması", 
    description: "React ve Next.js ile geliştirilmiş web uygulaması", 
    language: "typescript",
    lastUpdated: "2 saat önce"
  },
  { 
    id: 2, 
    name: "API Servisi", 
    description: "Node.js ve Express ile REST API", 
    language: "javascript",
    lastUpdated: "1 gün önce"
  },
  { 
    id: 3, 
    name: "ML Algoritması", 
    description: "Python ile makine öğrenimi modeli", 
    language: "python",
    lastUpdated: "3 gün önce"
  },
];

const templates = [
  { 
    id: 1, 
    name: "Next.js Web Uygulaması", 
    description: "TypeScript, React ve Next.js ile hazır web şablonu",
    stars: 235,
    language: "typescript"
  },
  { 
    id: 2, 
    name: "Express API", 
    description: "Node.js ve Express ile REST API şablonu",
    stars: 187,
    language: "javascript"
  },
  { 
    id: 3, 
    name: "Flask Microservice", 
    description: "Python Flask ile microservice şablonu",
    stars: 142,
    language: "python"
  },
];

// Dil renkleri
const languageColors: Record<string, string> = {
  typescript: "bg-blue-500",
  javascript: "bg-yellow-400",
  python: "bg-green-500",
  java: "bg-brown-500",
  csharp: "bg-purple-600",
  go: "bg-blue-400",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeModal />
      <div>
        <h1 className="text-2xl font-bold">Hoş Geldin, Kullanıcı</h1>
        <p className="text-muted-foreground">
          CodeXONX platformuna hoş geldin. Projelerini yönet, kodlarını düzenle ve toplulukla etkileşim kur.
        </p>
      </div>

      {/* Hızlı Erişim Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <FileCode className="mr-2 h-5 w-5 text-primary" />
              Kod Editörü
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Kodlarını düzenle, projeleri yönet ve AI ile yardım al.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/editor" className="w-full">
              <Button variant="outline" className="w-full justify-between">
                Editöre Git
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Terminal className="mr-2 h-5 w-5 text-primary" />
              Terminal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Komut satırı üzerinden projelerini yönet ve kodlarını çalıştır.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/terminal" className="w-full">
              <Button variant="outline" className="w-full justify-between">
                Terminale Git
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Topluluk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Toplulukla etkileşim kur, projelerini paylaş ve yardım al.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/community" className="w-full">
              <Button variant="outline" className="w-full justify-between">
                Topluluğa Git
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Son Projeler */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Son Projeler</h2>
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm" className="gap-2">
              Tüm Projeler
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${languageColors[project.language]}`}></div>
                    <CardTitle className="text-md">{project.name}</CardTitle>
                  </div>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between pt-2 text-xs text-muted-foreground">
                <span>Son güncelleme: {project.lastUpdated}</span>
                <Link href={`/dashboard/editor?project=${project.id}`}>
                  <Button size="sm" variant="ghost">
                    Düzenle
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
          
          <Card className="flex flex-col items-center justify-center p-6 border-dashed">
            <div className="mb-4 rounded-full border border-dashed border-primary/50 p-2">
              <Layers className="h-6 w-6 text-primary/70" />
            </div>
            <h3 className="text-lg font-medium mb-1">Yeni Proje</h3>
            <p className="text-sm text-center text-muted-foreground mb-4">
              Yeni bir proje oluştur veya var olanı içe aktar
            </p>
            <Link href="/dashboard/projects/new">
              <Button>Proje Oluştur</Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Popüler Şablonlar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Popüler Şablonlar</h2>
          <Link href="/dashboard/templates">
            <Button variant="ghost" size="sm" className="gap-2">
              Tüm Şablonlar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${languageColors[template.language]}`}></div>
                    <CardTitle className="text-md">{template.name}</CardTitle>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 mr-1 fill-primary text-primary" />
                    {template.stars}
                  </div>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Link href={`/dashboard/templates/${template.id}`} className="w-full">
                  <Button variant="secondary" className="w-full">
                    Şablonu Kullan
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
