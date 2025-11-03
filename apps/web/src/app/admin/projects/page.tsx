"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ExternalLink,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Proje veri tipi
type Project = {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  apiKey: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  usage: number;
  createdAt: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Simüle edilmiş proje verileri
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Gerçek uygulamada bir API isteği yapılacaktır
        setTimeout(() => {
          const mockProjects: Project[] = Array.from({ length: 28 }).map((_, index) => ({
            id: `project-${index + 1}`,
            name: `Proje ${index + 1}`,
            ownerId: `user-${(index % 7) + 1}`,
            ownerName: `Kullanıcı ${(index % 7) + 1}`,
            apiKey: `pk_test_${Math.random().toString(36).substring(2, 15)}`,
            description: `Bu proje için açıklama metni. Proje #${index + 1}`,
            status: index % 10 === 0 ? "SUSPENDED" : index % 5 === 0 ? "INACTIVE" : "ACTIVE",
            usage: Math.floor(Math.random() * 10000),
            createdAt: new Date(
              Date.now() - Math.floor(Math.random() * 10000000000)
            ).toISOString(),
          }));

          setProjects(mockProjects);
          setFilteredProjects(mockProjects);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Proje veri hatası:", error);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Arama işlevi
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, projects]);

  // Sayfalama
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  // Sayfa değiştirme işlevi
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Tarih formatı
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // API anahtarının bir kısmını gösterme
  const formatApiKey = (key: string) => {
    return `${key.substring(0, 8)}...`;
  };

  // Kullanım miktarını formatlama
  const formatUsage = (usage: number) => {
    if (usage < 1000) return `${usage} istek`;
    return `${(usage / 1000).toFixed(1)}K istek`;
  };

  // Duruma göre stil belirleme
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "SUSPENDED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Durumu Türkçe gösterme
  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Aktif";
      case "INACTIVE":
        return "Pasif";
      case "SUSPENDED":
        return "Askıya Alındı";
      default:
        return status;
    }
  };

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
        <h1 className="text-2xl font-bold tracking-tight">Proje Yönetimi</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Proje
        </Button>
      </div>

      {/* Filtreler ve Arama */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Proje adı veya açıklama ile ara..."
            className="pl-10 h-10 w-full rounded-md border border-input bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filtreler
        </Button>
      </div>

      {/* Proje Tablosu */}
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Proje Adı
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Kullanıcı
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  API Anahtarı
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Durum
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Kullanım
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Oluşturulma
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {currentItems.map((project) => (
                <tr
                  key={project.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {project.description}
                    </div>
                  </td>
                  <td className="p-4 align-middle">{project.ownerName}</td>
                  <td className="p-4 align-middle">
                    <div className="font-mono text-xs bg-muted px-2 py-1 rounded-md inline-block">
                      {formatApiKey(project.apiKey)}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(
                        project.status
                      )}`}
                    >
                      {getStatusText(project.status)}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    {formatUsage(project.usage)}
                  </td>
                  <td className="p-4 align-middle">
                    {formatDate(project.createdAt)}
                  </td>
                  <td className="p-4 text-right align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="İstatistikleri Görüntüle">
                        <BarChart className="h-4 w-4" />
                        <span className="sr-only">İstatistikler</span>
                      </Button>
                      <Button variant="ghost" size="icon" title="Düzenle">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Düzenle</span>
                      </Button>
                      <Button variant="ghost" size="icon" title="Ayrıntılar">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Ayrıntılar</span>
                      </Button>
                      <Button variant="ghost" size="icon" title="Daha Fazla">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Daha Fazla</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sayfalama */}
        <div className="flex items-center justify-between border-t px-4 py-4">
          <div className="text-sm text-muted-foreground">
            {filteredProjects.length} sonuçtan {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, filteredProjects.length)} arası gösteriliyor
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Önceki Sayfa</span>
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let pageNum: number;
              
              // Sayfa düğmelerini ortalamalı gösterme
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              }
              return null;
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Sonraki Sayfa</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
