'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Kullanıcı veri tipi
type User = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
};

const cardShellClass =
  'relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_45px_90px_rgba(4,6,16,0.55)] backdrop-blur-xl';
const subtleOverlayClass =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.18),transparent_70%),radial-gradient(circle_at_bottom_right,rgba(84,120,255,0.18),transparent_72%)]';
const tableCardOverlayClass =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,44,0.16),transparent_72%),radial-gradient(circle_at_bottom_left,rgba(84,120,255,0.18),transparent_74%)]';

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.45, ease: 'easeOut' },
  }),
} as const;

const tableRowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(index * 0.04, 0.4), duration: 0.25, ease: 'easeOut' },
  }),
} as const;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
            role: index % 10 === 0 ? 'ADMIN' : 'USER',
            status: index % 5 === 0 ? 'INACTIVE' : 'ACTIVE',
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          }));

          setUsers(mockUsers);
          setFilteredUsers(mockUsers);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Kullanıcı veri hatası:', error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Arama işlevi
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        user =>
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
  const safeTotalPages = Math.max(totalPages, 1);
  const showingStart = filteredUsers.length === 0 ? 0 : indexOfFirstItem + 1;
  const showingEnd = Math.min(indexOfLastItem, filteredUsers.length);

  // Sayfa değiştirme işlevi
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Tarih formatı
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={cardShellClass} variants={containerVariants} custom={0.05}>
        <div className={subtleOverlayClass} aria-hidden />
        <div className="relative flex flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.45em] text-white/45">Yönetim</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Kullanıcı Yönetimi</h1>
            <p className="text-sm text-white/60">
              Takımınızı yönetin, roller atayın ve erişim izinlerini tek noktadan kontrol edin.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="ghost"
              className="gap-2 rounded-full border border-white/15 px-4 text-white/80 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/15 hover:text-white"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtreler
            </Button>
            <Button className="gap-2 rounded-full bg-primary/80 px-4 text-white shadow-[0_0_35px_rgba(255,107,44,0.45)] transition hover:-translate-y-0.5 hover:bg-primary">
              <Plus className="h-4 w-4" />
              Yeni Kullanıcı
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className={cn(cardShellClass, 'px-6 py-5')}
        variants={containerVariants}
        custom={0.12}
      >
        <div className={subtleOverlayClass} aria-hidden />
        <motion.div
          className="relative grid gap-4 md:grid-cols-[2fr_1fr]"
          variants={containerVariants}
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55" />
            <input
              type="text"
              placeholder="İsim veya e-posta ile ara..."
              className="h-11 w-full rounded-full border border-white/15 bg-black/40 pl-12 pr-4 text-sm text-white placeholder:text-white/50 transition focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/35"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 text-xs text-white/60">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              Aktif kullanıcılar: {users.filter(user => user.status === 'ACTIVE').length}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.6)]" />
              Adminler: {users.filter(user => user.role === 'ADMIN').length}
            </span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className={cn(cardShellClass, 'overflow-hidden')}
        variants={containerVariants}
        custom={0.18}
      >
        <div className={tableCardOverlayClass} aria-hidden />
        <div className="relative">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Üye Tablosu</h2>
              <p className="text-sm text-white/60">
                Kullanıcı aktivitelerini, rollerini ve durumlarını izleyin.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-white/65">
                Toplam {filteredUsers.length} kayıt
              </span>
            </div>
          </div>

          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.32em] text-white/45">
                  <th className="h-12 px-6 align-middle font-medium">Ad Soyad</th>
                  <th className="h-12 px-6 align-middle font-medium">E-posta</th>
                  <th className="h-12 px-6 align-middle font-medium">Rol</th>
                  <th className="h-12 px-6 align-middle font-medium">Durum</th>
                  <th className="h-12 px-6 align-middle font-medium">Kayıt Tarihi</th>
                  <th className="h-12 px-6 text-right align-middle font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="border-b border-white/8 text-white/80 transition hover:bg-white/[0.04]"
                  >
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{user.name}</span>
                        <span className="text-xs text-white/50">ID: {user.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/75">
                        {user.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition',
                          user.role === 'ADMIN'
                            ? 'border-purple-400/40 bg-purple-500/20 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                            : 'border-white/12 bg-white/[0.08] text-white/70 hover:border-primary/40 hover:bg-primary/20'
                        )}
                      >
                        {user.role === 'ADMIN' ? 'Admin' : 'Kullanıcı'}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
                          user.status === 'ACTIVE'
                            ? 'border-emerald-400/40 bg-emerald-500/25 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                            : 'border-rose-400/40 bg-rose-500/25 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                        )}
                      >
                        {user.status === 'ACTIVE' ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <span className="h-2 w-2 rounded-full bg-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.6)]" />
                            Pasif
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="text-xs text-white/60">{formatDate(user.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4 text-right align-middle">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Düzenle</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full border border-white/12 bg-white/[0.05] text-rose-200 transition hover:-translate-y-0.5 hover:border-rose-400/60 hover:bg-rose-400/20 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Sil</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Daha Fazla</span>
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-4 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
            <div>
              {filteredUsers.length} sonuçtan {showingStart} - {showingEnd} arası gösteriliyor
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Önceki Sayfa</span>
              </Button>
              {Array.from({ length: Math.min(safeTotalPages, 5) }).map((_, i) => {
                let pageNum: number;

                if (safeTotalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= safeTotalPages - 2) {
                  pageNum = safeTotalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                if (pageNum > 0 && pageNum <= safeTotalPages) {
                  const isActive = currentPage === pageNum;
                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={cn(
                        'rounded-full border px-3 text-xs transition',
                        isActive
                          ? 'border-primary/50 bg-primary/25 text-white shadow-[0_0_25px_rgba(255,107,44,0.4)]'
                          : 'border-white/10 bg-white/[0.04] text-white/70 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/15 hover:text-white'
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                return null;
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(Math.min(safeTotalPages, currentPage + 1))}
                disabled={currentPage === safeTotalPages}
                className="rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Sonraki Sayfa</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
