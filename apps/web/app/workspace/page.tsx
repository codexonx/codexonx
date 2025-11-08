'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Code,
  PlusCircle,
  Settings,
  Key,
  BarChart2 as BarChart,
  LayoutGrid,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export default function WorkspacePage() {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  // Mock data
  const projects = [
    { id: '1', name: 'API Projesi', apiKey: 'pk_test_123456789', status: 'active' },
    { id: '2', name: 'Web Uygulaması', apiKey: 'pk_test_987654321', status: 'active' },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-muted/40 border-r h-full flex flex-col">
        <div className="p-4 flex items-center space-x-2 border-b">
          <Code className="h-6 w-6" />
          <span className="font-bold">Codexonx</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/workspace"
            className="flex items-center space-x-2 p-2 rounded-md bg-primary/10 text-primary font-medium"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <div className="pt-4">
            <div className="flex items-center justify-between mb-2 text-sm font-medium text-muted-foreground">
              <span>PROJELERİM</span>
              <Button
                variant="ghost"
                size="icon"
                title="Yeni proje ekle"
                aria-label="Yeni proje ekle"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {projects.map(project => (
                <button
                  key={project.id}
                  className={`w-full flex items-center space-x-2 p-2 text-sm rounded-md hover:bg-primary/10 ${activeProject === project.id ? 'bg-primary/5 font-medium' : ''}`}
                  onClick={() => setActiveProject(project.id)}
                  aria-label={`${project.name} projesini seç`}
                >
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="truncate">{project.name}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">AK</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">Ali Kullanıcı</div>
                <div className="text-xs text-muted-foreground">Pro Plan</div>
              </div>
            </div>
            <Button variant="ghost" size="icon" title="Çıkış yap" aria-label="Çıkış yap">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-medium">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Ayarlar
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">Toplam Proje</h3>
                <LayoutGrid className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{projects.length}</p>
              <p className="text-sm text-muted-foreground mt-2">2 aktif proje</p>
            </div>
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">API Çağrıları</h3>
                <BarChart className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">1.2K</p>
              <p className="text-sm text-muted-foreground mt-2">Bu ay yapılan çağrılar</p>
            </div>
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">API Anahtarları</h3>
                <Key className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{projects.length}</p>
              <p className="text-sm text-muted-foreground mt-2">2 aktif anahtar</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">Projeler</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">Proje Adı</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      API Anahtarı
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Durum</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id} className="border-b hover:bg-muted/30">
                      <td className="p-4">
                        <div className="font-medium">{project.name}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-sm bg-muted px-2 py-1 rounded-md inline-block">
                          {project.apiKey.substring(0, 10)}...
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          <span>Aktif</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex">
                          <Button variant="ghost" size="sm" aria-label="Proje detaylarını göster">
                            Detaylar <ChevronDown className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
