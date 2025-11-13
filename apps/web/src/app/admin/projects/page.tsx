'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  BarChart2 as BarChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Proje veri tipi
type Project = {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  apiKey: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  usage: number;
  createdAt: string;
};

const heroShellClass =
  'relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 px-6 py-8 shadow-[0_45px_120px_rgba(8,12,32,0.65)] backdrop-blur-2xl';
const heroOverlayClass =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.45),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(84,120,255,0.35),transparent_60%)] opacity-80';
const badgeGlowClass =
  'inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.4em] text-white/60';
const primaryActionButtonClass =
  'inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/80 px-6 py-2 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,107,44,0.45)] transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50';
const ghostPillButtonClass =
  'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-white/70 transition hover:border-white/35 hover:text-white';
const filterInputClass =
  'h-11 w-full rounded-2xl border border-white/12 bg-black/40 pl-11 pr-4 text-sm text-white placeholder:text-white/45 focus-visible:border-primary/50 focus-visible:ring-primary/40';
const tableShellClass =
  'relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] shadow-[0_45px_110px_rgba(4,6,16,0.6)] backdrop-blur-2xl';
const tableOverlayClass =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.18),transparent_70%),radial-gradient(circle_at_bottom_right,rgba(84,120,255,0.18),transparent_72%)]';
const statusBadgeMap: Record<Project['status'], string> = {
  ACTIVE:
    'border border-emerald-400/40 bg-emerald-400/15 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.25)]',
  INACTIVE:
    'border border-white/15 bg-white/[0.08] text-white/60 shadow-[0_0_18px_rgba(148,163,184,0.2)]',
  SUSPENDED:
    'border border-rose-500/40 bg-rose-500/15 text-rose-100 shadow-[0_0_18px_rgba(244,63,94,0.25)]',
};

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.08, delayChildren: 0.08 },
  },
} as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
} as const;

const listVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut', staggerChildren: 0.04 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
} as const;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
            status: index % 10 === 0 ? 'SUSPENDED' : index % 5 === 0 ? 'INACTIVE' : 'ACTIVE',
            usage: Math.floor(Math.random() * 10000),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          }));

          setProjects(mockProjects);
          setFilteredProjects(mockProjects);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Proje veri hatası:', error);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Arama işlevi
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        project =>
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
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
  // Durumu Türkçe gösterme
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Aktif';
      case 'INACTIVE':
        return 'Pasif';
      case 'SUSPENDED':
        return 'Askıya Alındı';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/15 border-t-primary/80" />
          <div className="absolute inset-2 rounded-full border border-primary/30 blur-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={sectionVariants} className={heroShellClass}>
        <div className={heroOverlayClass} />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <span className={badgeGlowClass}>Codexonx</span>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Proje Yönetimi</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Tüm müşteri projelerinizi merkezi bir panelde yönetin. Kullanım durumlarını takip edin
              ve hızlı aksiyonlar alın.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button className={ghostPillButtonClass}>
              <SlidersHorizontal className="h-4 w-4" />
              Filtreler
            </Button>
            <Button className={primaryActionButtonClass}>
              <Plus className="h-4 w-4" />
              Yeni Proje
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={sectionVariants} className="relative">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
            <input
              type="text"
              placeholder="Proje adı veya açıklama ile ara..."
              className={filterInputClass}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 text-sm text-white/60"
          >
            <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1">
              {projects.length} toplam proje
            </span>
            <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1">
              {filteredProjects.length} filtrelenmiş sonuç
            </span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={sectionVariants} className={tableShellClass}>
        <div className={tableOverlayClass} />
        <div className="relative overflow-hidden">
          <motion.table variants={listVariants} className="relative w-full text-sm text-white/80">
            <thead className="bg-white/[0.05] text-xs uppercase tracking-[0.3em] text-white/50">
              <tr>
                {[
                  'Proje Adı',
                  'Kullanıcı',
                  'API Anahtarı',
                  'Durum',
                  'Kullanım',
                  'Oluşturulma',
                  'İşlemler',
                ].map(heading => (
                  <motion.th
                    key={heading}
                    variants={itemVariants}
                    className="px-6 py-4 text-left font-semibold"
                  >
                    {heading}
                  </motion.th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map(project => (
                <motion.tr
                  key={project.id}
                  variants={itemVariants}
                  className="group border-t border-white/8 transition hover:bg-white/[0.04]"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-white">{project.name}</div>
                    <div className="text-xs text-white/55 line-clamp-1">{project.description}</div>
                  </td>
                  <td className="px-6 py-4 text-white/70">{project.ownerName}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-xl border border-white/15 bg-white/[0.08] px-3 py-1 font-mono text-xs text-white">
                      {formatApiKey(project.apiKey)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs',
                        statusBadgeMap[project.status]
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {getStatusText(project.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/70">{formatUsage(project.usage)}</td>
                  <td className="px-6 py-4 text-white/70">{formatDate(project.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {(
                        [
                          {
                            icon: BarChart,
                            label: 'İstatistikler',
                            title: 'İstatistikleri Görüntüle',
                          },
                          { icon: Edit, label: 'Düzenle', title: 'Düzenle' },
                          { icon: ExternalLink, label: 'Ayrıntılar', title: 'Ayrıntılar' },
                          { icon: MoreHorizontal, label: 'Daha Fazla', title: 'Daha Fazla' },
                          { icon: Trash2, label: 'Sil', title: 'Sil' },
                        ] as const
                      ).map(action => (
                        <Button
                          key={action.label}
                          variant="ghost"
                          size="icon"
                          title={action.title}
                          className="rounded-full border border-transparent bg-white/[0.04] text-white/60 transition hover:border-white/20 hover:text-white"
                        >
                          <action.icon className="h-4 w-4" />
                          <span className="sr-only">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 border-t border-white/10 px-6 py-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between"
        >
          <div>
            {filteredProjects.length} sonuçtan {indexOfFirstItem + 1} -{' '}
            {Math.min(indexOfLastItem, filteredProjects.length)} arası gösteriliyor
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-white/12 bg-white/[0.05] px-4 text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Önceki Sayfa</span>
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let pageNum: number;

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
                const isActive = currentPage === pageNum;
                return (
                  <Button
                    key={pageNum}
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      'rounded-full border px-4 transition',
                      isActive
                        ? 'border-primary/70 bg-primary/80 text-black shadow-[0_0_30px_rgba(255,107,44,0.35)]'
                        : 'border-white/12 bg-white/[0.05] text-white/70 hover:border-white/30 hover:text-white'
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
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-white/12 bg-white/[0.05] px-4 text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Sonraki Sayfa</span>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
