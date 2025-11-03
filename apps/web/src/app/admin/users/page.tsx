"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  MoreHorizontal,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Kullanıcı veri tipi
type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Simüle edilmiş kullanıcı verileri
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Gerçek uygulamada bir API isteği yapılacaktır
        setTimeout(() => {
          const mockUsers: User[] = Array.from({ length: 35 }).map((_, index) => ({
            id: `user-${index + 1}`,
            name: `Kullanıcı ${index + 1}`,
            email: `user${index + 1}@example.com`,
            role: index % 10 === 0 ? "ADMIN" : "USER",
            status: index % 5 === 0 ? "INACTIVE" : "ACTIVE",
            createdAt: new Date(
              Date.now() - Math.floor(Math.random() * 10000000000)
            ).toISOString(),
          }));

          setUsers(mockUsers);
          setFilteredUsers(mockUsers);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Kullanıcı veri hatası:", error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Arama işlevi
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, users]);

  // Sayfalama
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

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
        <h1 className="text-2xl font-bold tracking-tight">Kullanıcı Yönetimi</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kullanıcı
        </Button>
      </div>

      {/* Filtreler ve Arama */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="İsim veya e-posta ile ara..."
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

      {/* Kullanıcı Tablosu */}
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Ad Soyad
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  E-posta
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Rol
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Durum
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Kayıt Tarihi
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {currentItems.map((user) => (
                <tr
                  key={user.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">{user.name}</td>
                  <td className="p-4 align-middle">{user.email}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {user.role === "ADMIN" ? "Admin" : "Kullanıcı"}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {user.status === "ACTIVE" ? (
                        <>
                          <Check className="mr-1 h-3 w-3" />
                          Aktif
                        </>
                      ) : (
                        <>
                          <X className="mr-1 h-3 w-3" />
                          Pasif
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-4 text-right align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Düzenle</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Sil</span>
                      </Button>
                      <Button variant="ghost" size="icon">
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
            {filteredUsers.length} sonuçtan {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, filteredUsers.length)} arası gösteriliyor
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
