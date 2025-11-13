'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, ChevronLeft, ChevronRight, SlidersHorizontal, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18n-context';
import { cn } from '@/lib/utils';

// Abonelik veri tipi
type Subscription = {
  id: string;
  userId: string;
  userName: string;
  planName: string;
  price: number;
  status: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
  startDate: string;
  endDate: string | null;
  createdAt: string;
};

const cardShellClass =
  'relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_45px_90px_rgba(4,6,16,0.55)] backdrop-blur-xl';
const subtleOverlayClass =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.18),transparent_70%),radial-gradient(circle_at_bottom_right,rgba(84,120,255,0.18),transparent_72%)]';
const tableOverlayClass =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,44,0.18),transparent_70%),radial-gradient(circle_at_bottom_left,rgba(84,120,255,0.19),transparent_74%)]';
const toggleButtonBaseClass =
  'relative flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-white/70 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white';
const toggleButtonActiveClass =
  'border-primary/60 bg-primary/25 text-white shadow-[0_0_30px_rgba(255,107,44,0.35)]';
const infoPillClass =
  'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.38em] text-white/50';
const searchInputClass =
  'h-11 w-full rounded-full border border-white/15 bg-black/40 pl-12 pr-4 text-sm text-white placeholder:text-white/50 transition focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/35';
const paginationButtonClass =
  'rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white disabled:opacity-50';
const paginationActiveClass =
  'border-primary/50 bg-primary/25 text-white shadow-[0_0_25px_rgba(255,107,44,0.4)]';
const tableActionButtonClass =
  'rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.08, delayChildren: 0.08 },
  },
} as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
} as const;

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: Math.min(index * 0.06, 0.3) },
  }),
} as const;

const tableRowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: 'easeOut', delay: Math.min(index * 0.05, 0.35) },
  }),
} as const;

export default function SubscriptionsPage() {
  const { t } = useI18n();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Simüle edilmiş abonelik verileri
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        // Gerçek uygulamada bir API isteği yapılacaktır
        setTimeout(() => {
          const mockSubscriptions: Subscription[] = Array.from({ length: 35 }).map((_, index) => {
            const startDate = new Date(Date.now() - Math.floor(Math.random() * 10000000000));

            // Status belirle
            let status: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
            const rand = Math.random();
            if (rand > 0.8) {
              status = 'CANCELED';
            } else if (rand > 0.6) {
              status = 'EXPIRED';
            } else {
              status = 'ACTIVE';
            }

            // Bitiş tarihi
            let endDate: string | null = null;
            if (status === 'ACTIVE') {
              // Aktif aboneliklerin bitiş tarihi gelecekte olmalı
              const futureDate = new Date(startDate);
              futureDate.setMonth(futureDate.getMonth() + 1); // 1 ay sonra
              endDate = futureDate.toISOString();
            } else if (status === 'EXPIRED') {
              // Sona ermiş aboneliklerin bitiş tarihi geçmiş olmalı
              const pastDate = new Date(startDate);
              pastDate.setDate(pastDate.getDate() + 30); // 30 gün sonra
              endDate = pastDate.toISOString();
            } else if (status === 'CANCELED') {
              // İptal edilmiş abonelikler için gelecekteki bir tarih (iptal edilen abonelik hala aktif olabilir)
              const cancelDate = new Date(startDate);
              cancelDate.setDate(cancelDate.getDate() + Math.floor(Math.random() * 30)); // 0-30 gün arasında
              endDate = cancelDate.toISOString();
            }

            const planNames = ['Başlangıç', 'Profesyonel', 'Kurumsal', 'Ücretsiz'];
            const planPrices = [99, 249, 999, 0];
            const planIndex = Math.floor(Math.random() * planNames.length);

            return {
              id: `sub-${index + 1}`,
              userId: `user-${(index % 20) + 1}`,
              userName: `Kullanıcı ${(index % 20) + 1}`,
              planName: planNames[planIndex],
              price: planPrices[planIndex],
              status,
              startDate: startDate.toISOString(),
              endDate,
              createdAt: startDate.toISOString(),
            };
          });

          setSubscriptions(mockSubscriptions);
          setFilteredSubscriptions(mockSubscriptions);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Abonelik veri hatası:', error);
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Arama ve filtreleme işlevi
  useEffect(() => {
    let filtered = [...subscriptions];

    // Arama sorgusuna göre filtrele
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        subscription =>
          subscription.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subscription.planName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Duruma göre filtrele
    if (filterStatus !== null) {
      filtered = filtered.filter(subscription => subscription.status === filterStatus);
    }

    setFilteredSubscriptions(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterStatus, subscriptions]);

  // Sayfalama
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem);

  // Sayfa değiştirme işlevi
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Tarih formatı
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Para formatı
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  // Duruma göre stil belirleme
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'border-emerald-400/50 bg-emerald-500/25 text-emerald-50 shadow-[0_0_18px_rgba(16,185,129,0.45)]';
      case 'CANCELED':
        return 'border-amber-400/50 bg-amber-500/25 text-amber-50 shadow-[0_0_18px_rgba(245,158,11,0.45)]';
      case 'EXPIRED':
        return 'border-rose-400/50 bg-rose-500/25 text-rose-50 shadow-[0_0_18px_rgba(244,63,94,0.45)]';
      default:
        return 'border-white/15 bg-white/[0.12] text-white/75';
    }
  };

  // Durumu Türkçe gösterme
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Aktif';
      case 'CANCELED':
        return 'İptal Edildi';
      case 'EXPIRED':
        return 'Süresi Doldu';
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

  const safeTotalPages = Math.max(totalPages, 1);
  const showingStart = filteredSubscriptions.length === 0 ? 0 : indexOfFirstItem + 1;
  const showingEnd = Math.min(indexOfLastItem, filteredSubscriptions.length);
  const activeCount = subscriptions.filter(sub => sub.status === 'ACTIVE').length;
  const canceledCount = subscriptions.filter(sub => sub.status === 'CANCELED').length;
  const expiredCount = subscriptions.filter(sub => sub.status === 'EXPIRED').length;
  const averagePrice =
    subscriptions.length > 0
      ? Math.round(
          subscriptions.reduce((total, sub) => total + sub.price, 0) / subscriptions.length
        )
      : 0;

  return (
    <motion.div className="space-y-8" variants={pageVariants} initial="hidden" animate="visible">
      <motion.div className={cn(cardShellClass, 'px-6 py-6')} variants={sectionVariants}>
        <div className={subtleOverlayClass} aria-hidden />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <span className={infoPillClass}>{t('admin.subscriptions')}</span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                Abonelik Akışını Tek Panelden Yönet
              </h1>
              <p className="max-w-xl text-sm text-white/65">
                Takımınızdaki planları izleyin, risk altındaki abonelikleri yakalayın ve iptalleri
                Codexonx parıltısıyla zahmetsizce yönetin.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-white/60">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                Aktif: {activeCount.toLocaleString('tr-TR')}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.65)]" />
                İptal: {canceledCount.toLocaleString('tr-TR')}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.65)]" />
                Süresi Doldu: {expiredCount.toLocaleString('tr-TR')}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(255,107,44,0.7)]" />
                Ortalama Ücret: {formatCurrency(averagePrice)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button className="gap-2 rounded-full bg-primary/80 px-4 text-white shadow-[0_0_35px_rgba(255,107,44,0.45)] transition hover:-translate-y-0.5 hover:bg-primary">
              <Plus className="h-4 w-4" />
              Yeni Abonelik
            </Button>
            <Button variant="ghost" className={cn(tableActionButtonClass, 'px-4')}>
              İçe Aktar
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div className={cn(cardShellClass, 'px-6 py-5')} variants={sectionVariants}>
        <div className={subtleOverlayClass} aria-hidden />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55" />
            <input
              type="text"
              placeholder="Kullanıcı veya plan adı ile ara..."
              className={searchInputClass}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Button
              variant="ghost"
              className={cn(
                toggleButtonBaseClass,
                filterStatus === null && toggleButtonActiveClass
              )}
              onClick={() => setFilterStatus(null)}
            >
              Tümü
            </Button>
            <Button
              variant="ghost"
              className={cn(
                toggleButtonBaseClass,
                filterStatus === 'ACTIVE' && toggleButtonActiveClass
              )}
              onClick={() => setFilterStatus('ACTIVE')}
            >
              Aktif
            </Button>
            <Button
              variant="ghost"
              className={cn(
                toggleButtonBaseClass,
                filterStatus === 'CANCELED' && toggleButtonActiveClass
              )}
              onClick={() => setFilterStatus('CANCELED')}
            >
              İptal
            </Button>
            <Button
              variant="ghost"
              className={cn(
                toggleButtonBaseClass,
                filterStatus === 'EXPIRED' && toggleButtonActiveClass
              )}
              onClick={() => setFilterStatus('EXPIRED')}
            >
              Süresi Doldu
            </Button>
            <Button variant="ghost" className={cn(toggleButtonBaseClass, 'px-5')}>
              <SlidersHorizontal className="h-4 w-4" />
              Gelişmiş Filtreler
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div className={cn(cardShellClass, 'overflow-hidden')} variants={sectionVariants}>
        <div className={tableOverlayClass} aria-hidden />
        <div className="relative">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Abonelik Tablosu</h2>
              <p className="text-sm text-white/60">
                Toplam {filteredSubscriptions.length.toLocaleString('tr-TR')} kayıt görüntüleniyor.
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/60">
              Sayfa {currentPage} / {safeTotalPages}
            </span>
          </div>

          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.32em] text-white/45">
                  <th className="h-12 px-6 align-middle font-medium">Kullanıcı</th>
                  <th className="h-12 px-6 align-middle font-medium">Plan</th>
                  <th className="h-12 px-6 align-middle font-medium">Fiyat</th>
                  <th className="h-12 px-6 align-middle font-medium">Durum</th>
                  <th className="h-12 px-6 align-middle font-medium">Başlangıç</th>
                  <th className="h-12 px-6 align-middle font-medium">Bitiş</th>
                  <th className="h-12 px-6 text-right align-middle font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((subscription, index) => (
                  <motion.tr
                    key={subscription.id}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="border-b border-white/[0.08] text-white/80 transition hover:bg-white/[0.04]"
                  >
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{subscription.userName}</span>
                        <span className="text-xs text-white/50">ID: {subscription.userId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-xs text-white/75">
                        {subscription.planName}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2">
                        <span>{formatCurrency(subscription.price)}</span>
                        {subscription.price === 0 && (
                          <span className="text-xs text-white/50">(Ücretsiz)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
                          getStatusStyle(subscription.status)
                        )}
                      >
                        {subscription.status === 'ACTIVE' && <Check className="h-3.5 w-3.5" />}
                        {subscription.status === 'CANCELED' && <X className="h-3.5 w-3.5" />}
                        {getStatusText(subscription.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="text-xs text-white/65">
                        {formatDate(subscription.startDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="text-xs text-white/65">
                        {formatDate(subscription.endDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className={tableActionButtonClass}>
                          Detaylar
                        </Button>
                        {subscription.status === 'ACTIVE' && (
                          <Button variant="ghost" size="sm" className={tableActionButtonClass}>
                            İptal Et
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-4 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
            <div>
              {filteredSubscriptions.length} sonuçtan {showingStart} - {showingEnd} arası
              gösteriliyor
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={paginationButtonClass}
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
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={cn(paginationButtonClass, isActive && paginationActiveClass)}
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
                className={paginationButtonClass}
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
