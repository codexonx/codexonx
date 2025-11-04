'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pencil, Trash2, Plus, RefreshCw, Key, ExternalLink, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  description: string;
  apiKey: string;
  status: string;
  createdAt: string;
}

export function ProjectList() {
  const router = useRouter();
  const { getProjects, deleteProject, isLoading, error } = useApi();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});

  // Projeleri yükle
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await getProjects(data => {
      setProjects(data.data);
    });
  };

  // Proje silme
  const handleDelete = async (id: string) => {
    if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      setIsDeleting(id);

      await deleteProject(id, () => {
        // Başarılı silme
        setProjects(projects.filter(project => project.id !== id));
      });

      setIsDeleting(null);
    }
  };

  // API anahtarını göster/gizle
  const toggleApiKey = (id: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Proje kartı için durum göstergesi rengi
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2">Projeler yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-md">
        <p>Hata: {error}</p>
        <Button onClick={fetchProjects} variant="outline" className="mt-2">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tekrar Dene
        </Button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Henüz hiç projeniz yok</h3>
        <p className="text-muted-foreground mb-6">Yeni bir proje ekleyerek başlayabilirsiniz</p>
        <Button onClick={() => router.push('/admin/projects/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Proje Ekle
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <Card key={project.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="line-clamp-1" title={project.name}>
                  {project.name}
                </CardTitle>
                <CardDescription>{formatDate(project.createdAt)}</CardDescription>
              </div>
              <div
                className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(project.status)}`}
              >
                {project.status}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {project.description || 'Açıklama yok'}
            </p>

            <div className="mt-2">
              <div className="text-xs font-medium text-muted-foreground mb-1">API Anahtarı</div>
              <div className="flex items-center bg-muted p-2 rounded-md overflow-hidden">
                <code className="text-xs truncate flex-grow">
                  {showApiKey[project.id] ? project.apiKey : '•'.repeat(32)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-6 w-6 p-0 flex-shrink-0"
                  onClick={() => toggleApiKey(project.id)}
                >
                  <Key className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/projects/${project.id}`)}
            >
              <Pencil className="w-3 h-3 mr-2" />
              Düzenle
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/projects/${project.id}/docs`)}
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                Docs
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(project.id)}
                disabled={isDeleting === project.id}
              >
                {isDeleting === project.id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3 mr-0 sm:mr-2" />
                )}
                <span className="hidden sm:inline">Sil</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
