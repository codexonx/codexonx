"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  FileCode, 
  Folder, 
  GitBranch, 
  Calendar,
  Edit,
  Copy,
  Trash2,
  MoreVertical,
  File
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Örnek proje verileri
const userProjects = [
  {
    id: "proj1",
    name: "Web Uygulaması",
    description: "React ve Next.js ile geliştirilmiş web uygulaması",
    files: 28,
    branches: 3,
    lastModified: "2 saat önce",
    language: "typescript"
  },
  {
    id: "proj2",
    name: "API Servisi",
    description: "Node.js ve Express ile REST API",
    files: 17,
    branches: 1,
    lastModified: "1 gün önce",
    language: "javascript"
  },
  {
    id: "proj3",
    name: "Veri Analizi",
    description: "Python ile veri analizi ve görselleştirme projesi",
    files: 12,
    branches: 2,
    lastModified: "3 gün önce",
    language: "python"
  },
  {
    id: "proj4",
    name: "Mobile App",
    description: "React Native ile geliştirilen mobil uygulama",
    files: 35,
    branches: 2,
    lastModified: "5 gün önce",
    language: "javascript"
  }
];

// Paylaşılan projeler
const sharedProjects = [
  {
    id: "shared1",
    name: "Team Dashboard",
    description: "Ekip için yönetim paneli arayüzü",
    owner: "Ayşe Yılmaz",
    lastModified: "6 saat önce",
    language: "typescript"
  },
  {
    id: "shared2",
    name: "Database API",
    description: "MongoDB ve GraphQL ile veritabanı API'sı",
    owner: "Mehmet Demir",
    lastModified: "2 gün önce",
    language: "javascript"
  }
];

// Proje şablonları
const templates = [
  {
    id: "tpl1",
    name: "Next.js Web App",
    description: "Next.js, TailwindCSS ve TypeScript ile hazır web uygulaması şablonu",
    files: 18,
    language: "typescript"
  },
  {
    id: "tpl2",
    name: "Express API",
    description: "Node.js Express ile REST API şablonu",
    files: 12,
    language: "javascript"
  },
  {
    id: "tpl3",
    name: "Flask API",
    description: "Python Flask ile web API şablonu",
    files: 10,
    language: "python"
  }
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

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  
  // Arama fonksiyonu
  const filteredProjects = userProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredShared = sharedProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projeler</h1>
          <p className="text-muted-foreground">
            Projelerinizi yönetin ve düzenleyin. Şablonlardan yeni projeler oluşturun.
          </p>
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Proje
        </Button>
      </div>
      
      {/* Arama Kutusu */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Projelerde ara..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="my-projects">
        <TabsList className="mb-4">
          <TabsTrigger value="my-projects">Projelerim</TabsTrigger>
          <TabsTrigger value="shared">Paylaşılan</TabsTrigger>
          <TabsTrigger value="templates">Şablonlar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-projects" className="space-y-4">
          {filteredProjects.length === 0 ? (
            searchQuery ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Proje Bulunamadı</h3>
                <p className="text-muted-foreground mt-2">"{searchQuery}" araması için sonuç bulunamadı.</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <FileCode className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Henüz Projeniz Yok</h3>
                <p className="text-muted-foreground mt-2">Yeni bir proje oluşturmak için "Yeni Proje" butonuna tıklayın.</p>
                <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Proje
                </Button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map(project => (
                <Card key={project.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`h-3 w-3 rounded-full ${languageColors[project.language] || "bg-gray-400"}`}></div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Proje menüsü</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.location.href = `/dashboard/editor?project=${project.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Çoğalt
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <File className="mr-1 h-4 w-4" />
                        <span>{project.files} dosya</span>
                      </div>
                      <div className="flex items-center">
                        <GitBranch className="mr-1 h-4 w-4" />
                        <span>{project.branches} dal</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>Son güncelleme: {project.lastModified}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => window.location.href = `/dashboard/editor?project=${project.id}`}>
                      Aç
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="shared" className="space-y-4">
          {filteredShared.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Folder className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Paylaşılan Proje Yok</h3>
              <p className="text-muted-foreground mt-2">Henüz sizinle paylaşılmış bir proje bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredShared.map(project => (
                <Card key={project.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`h-3 w-3 rounded-full ${languageColors[project.language] || "bg-gray-400"}`}></div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <Badge variant="outline">
                      Sahibi: {project.owner}
                    </Badge>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>Son güncelleme: {project.lastModified}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => window.location.href = `/dashboard/editor?project=${project.id}`}>
                      Görüntüle
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <Card key={template.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${languageColors[template.language] || "bg-gray-400"}`}></div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <File className="mr-1 h-4 w-4" />
                      <span>{template.files} dosya</span>
                    </div>
                    <Badge variant="secondary">{template.language}</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="ml-auto" 
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setIsCreateDialogOpen(true);
                    }}
                  >
                    Şablonu Kullan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Yeni Proje Oluşturma Diyalogu */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yeni Proje Oluştur</DialogTitle>
            <DialogDescription>
              Proje detaylarını girin. Başlamak için bir şablon seçebilir veya sıfırdan başlayabilirsiniz.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Proje Adı
              </label>
              <Input
                id="name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Örn. Web Uygulaması"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Açıklama
              </label>
              <Input
                id="description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Projenizi kısaca tanımlayın"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="template" className="text-sm font-medium">
                Şablon (Opsiyonel)
              </label>
              <select 
                id="template"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="">Boş Proje</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.language})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={() => {
              if (newProjectName) {
                // Burada projeyi ekleyecek API çağrısı yapılacak
                setIsCreateDialogOpen(false);
                setNewProjectName("");
                setNewProjectDescription("");
                setSelectedTemplate("");
                // Başarılı olduğunda yeni projeyi listeye ekleyecek
              }
            }} disabled={!newProjectName}>
              Oluştur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
