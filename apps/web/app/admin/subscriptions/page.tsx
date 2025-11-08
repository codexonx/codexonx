'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, SlidersHorizontal, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18n-context';

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
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'CANCELED':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.subscriptions')}</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Abonelik
        </Button>
      </div>

      {/* Filtreler ve Arama */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Kullanıcı veya plan adı ile ara..."
            className="pl-10 h-10 w-full rounded-md border border-input bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filterStatus === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(null)}
          >
            Tümü
          </Button>
          <Button
            variant={filterStatus === 'ACTIVE' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('ACTIVE')}
          >
            Aktif
          </Button>
          <Button
            variant={filterStatus === 'CANCELED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('CANCELED')}
          >
            İptal Edildi
          </Button>
          <Button
            variant={filterStatus === 'EXPIRED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('EXPIRED')}
          >
            Süresi Doldu
          </Button>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Gelişmiş Filtreler
        </Button>
      </div>

      {/* Abonelik Tablosu */}
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Kullanıcı
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Plan
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Fiyat
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Durum
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Başlangıç
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Bitiş
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {currentItems.map(subscription => (
                <tr
                  key={subscription.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">{subscription.userName}</td>
                  <td className="p-4 align-middle">{subscription.planName}</td>
                  <td className="p-4 align-middle">
                    {formatCurrency(subscription.price)}
                    {subscription.price === 0 && (
                      <span className="ml-1 text-xs text-muted-foreground">(Ücretsiz)</span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(
                        subscription.status
                      )}`}
                    >
                      {subscription.status === 'ACTIVE' && <Check className="mr-1 h-3 w-3" />}
                      {subscription.status === 'CANCELED' && <X className="mr-1 h-3 w-3" />}
                      {getStatusText(subscription.status)}
                    </span>
                  </td>
                  <td className="p-4 align-middle">{formatDate(subscription.startDate)}</td>
                  <td className="p-4 align-middle">{formatDate(subscription.endDate)}</td>
                  <td className="p-4 text-right align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Detaylar
                      </Button>
                      {subscription.status === 'ACTIVE' && (
                        <Button variant="outline" size="sm">
                          İptal Et
                        </Button>
                      )}
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
            {filteredSubscriptions.length} sonuçtan {indexOfFirstItem + 1} -{' '}
            {Math.min(indexOfLastItem, filteredSubscriptions.length)} arası gösteriliyor
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
                    variant={currentPage === pageNum ? 'default' : 'outline'}
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
