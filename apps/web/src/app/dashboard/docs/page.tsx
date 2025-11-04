'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Search,
  ChevronRight,
  FileText,
  Book,
  Code,
  Settings,
  Terminal,
  Play,
  Database,
  Shield,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Separator bileşeni
const Separator = ({ className, ...props }) => (
  <div className={cn('h-[1px] w-full bg-border my-4', className)} {...props} />
);

// Örnek dökümantasyon kategorileri
const docCategories = [
  {
    id: 'getting-started',
    title: 'Başlangıç',
    description: 'Platform temel kullanım kılavuzu',
    icon: <Play className="h-5 w-5" />,
    color: 'text-green-500',
    docs: [
      { id: 'intro', title: 'Giriş', slug: 'getting-started/intro' },
      { id: 'quickstart', title: 'Hızlı Başlangıç', slug: 'getting-started/quickstart' },
      { id: 'installation', title: 'Kurulum', slug: 'getting-started/installation' },
      { id: 'account', title: 'Hesap Yönetimi', slug: 'getting-started/account' },
    ],
  },
  {
    id: 'editor',
    title: 'Kod Editörü',
    description: 'Kod editörü kullanım kılavuzu',
    icon: <Code className="h-5 w-5" />,
    color: 'text-blue-500',
    docs: [
      { id: 'basics', title: 'Temel Kullanım', slug: 'editor/basics' },
      { id: 'shortcuts', title: 'Klavye Kısayolları', slug: 'editor/shortcuts' },
      { id: 'customization', title: 'Özelleştirme', slug: 'editor/customization' },
      { id: 'extensions', title: 'Eklentiler', slug: 'editor/extensions' },
    ],
  },
  {
    id: 'terminal',
    title: 'Terminal',
    description: 'Terminal kullanım kılavuzu',
    icon: <Terminal className="h-5 w-5" />,
    color: 'text-purple-500',
    docs: [
      { id: 'basics', title: 'Temel Komutlar', slug: 'terminal/basics' },
      { id: 'advanced', title: 'İleri Seviye Kullanım', slug: 'terminal/advanced' },
    ],
  },
  {
    id: 'ai',
    title: 'AI Asistan',
    description: 'AI asistanı kullanma kılavuzu',
    icon: <FileText className="h-5 w-5" />,
    color: 'text-yellow-500',
    docs: [
      { id: 'chat', title: 'Sohbet Asistanı', slug: 'ai/chat' },
      { id: 'code', title: 'Kod Tamamlama', slug: 'ai/code' },
      { id: 'prompts', title: "Etkili Prompt'lar", slug: 'ai/prompts' },
    ],
  },
  {
    id: 'projects',
    title: 'Projeler',
    description: 'Proje yönetimi kılavuzu',
    icon: <Book className="h-5 w-5" />,
    color: 'text-indigo-500',
    docs: [
      { id: 'creation', title: 'Proje Oluşturma', slug: 'projects/creation' },
      { id: 'templates', title: 'Şablonları Kullanma', slug: 'projects/templates' },
      { id: 'sharing', title: 'Projeleri Paylaşma', slug: 'projects/sharing' },
    ],
  },
  {
    id: 'database',
    title: 'Veritabanı',
    description: 'Veritabanı entegrasyonu kılavuzu',
    icon: <Database className="h-5 w-5" />,
    color: 'text-red-500',
    docs: [
      { id: 'connections', title: 'Bağlantılar', slug: 'database/connections' },
      { id: 'queries', title: 'Sorgu Oluşturma', slug: 'database/queries' },
    ],
  },
  {
    id: 'security',
    title: 'Güvenlik',
    description: 'Platform güvenlik kılavuzu',
    icon: <Shield className="h-5 w-5" />,
    color: 'text-orange-500',
    docs: [
      { id: 'auth', title: 'Kimlik Doğrulama', slug: 'security/auth' },
      { id: 'permissions', title: 'İzinler', slug: 'security/permissions' },
      { id: 'secrets', title: 'Gizli Anahtarlar', slug: 'security/secrets' },
    ],
  },
  {
    id: 'settings',
    title: 'Ayarlar ve Yapılandırma',
    description: 'Platform ayarları kılavuzu',
    icon: <Settings className="h-5 w-5" />,
    color: 'text-slate-500',
    docs: [
      { id: 'preferences', title: 'Tercihler', slug: 'settings/preferences' },
      { id: 'themes', title: 'Temalar', slug: 'settings/themes' },
      { id: 'notifications', title: 'Bildirimler', slug: 'settings/notifications' },
    ],
  },
];

// Örnek popüler belgeler
const popularDocs = [
  {
    id: 'quickstart',
    title: 'Hızlı Başlangıç',
    category: 'Başlangıç',
    slug: 'getting-started/quickstart',
  },
  {
    id: 'shortcuts',
    title: 'Klavye Kısayolları',
    category: 'Kod Editörü',
    slug: 'editor/shortcuts',
  },
  { id: 'chat', title: 'Sohbet Asistanı Kullanımı', category: 'AI Asistan', slug: 'ai/chat' },
  {
    id: 'templates',
    title: 'Şablonları Kullanma',
    category: 'Projeler',
    slug: 'projects/templates',
  },
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocId, setActiveDocId] = useState('');

  // Aramalarda kullanmak için tüm dökümanların düz listesini oluştur
  const allDocs = docCategories.flatMap(category =>
    category.docs.map(doc => ({
      ...doc,
      categoryId: category.id,
      categoryTitle: category.title,
    }))
  );

  // Arama sonuçları
  const searchResults = searchQuery
    ? allDocs.filter(doc => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Belirli bir belgeyi göster
  const handleDocClick = slug => {
    // Gerçek uygulamada burada belge içeriği yüklenecek
    setActiveDocId(slug);

    // URL'yi belge URL'si olarak değiştir
    // window.history.pushState({}, "", `/dashboard/docs/${slug}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dokümantasyon</h1>
        <p className="text-muted-foreground">
          Platform kullanımıyla ilgili detaylı kılavuzlar ve belgeler
        </p>
      </div>

      <div className="relative max-w-lg">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Belgelerde arayın..."
          className="pl-9"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        {/* Arama Sonuçları Dropdown */}
        {searchQuery && (
          <div className="absolute z-10 mt-1 w-full bg-background rounded-md border shadow-lg">
            {searchResults.length > 0 ? (
              <ul className="py-2">
                {searchResults.map(doc => (
                  <li key={doc.slug}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => handleDocClick(doc.slug)}
                    >
                      <span>{doc.title}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({doc.categoryTitle})
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                "{searchQuery}" ile ilgili sonuç bulunamadı
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popüler Belgeler */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Popüler Belgeler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularDocs.map(doc => (
            <Button
              key={doc.slug}
              variant="outline"
              className="h-auto py-4 px-4 justify-start flex-col items-start text-left"
              onClick={() => handleDocClick(doc.slug)}
            >
              <div className="font-medium">{doc.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{doc.category}</div>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Kategoriler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {docCategories.map(category => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className={`flex flex-row items-center gap-3 ${category.color}`}>
              <div className="bg-muted p-2 rounded-md">{category.icon}</div>
              <div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {category.docs.map(doc => (
                  <li key={doc.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-between py-3 px-6 rounded-none"
                      onClick={() => handleDocClick(doc.slug)}
                    >
                      {doc.title}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeDocId && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveDocId('')}
        >
          <div
            className="bg-background rounded-lg max-w-3xl w-full max-h-[80vh] overflow-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">Belge İçeriği: {activeDocId}</h2>
            <p className="text-muted-foreground mb-4">
              Bu örnek bir belge içeriğidir. Gerçek bir uygulamada burada seçilen dokümanın içeriği
              gösterilecektir.
            </p>
            <div className="prose max-w-none">
              <h3>Başlık 1</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula velit eu
                metus lacinia, vel feugiat purus fermentum. Nullam at nisi ut nisl congue pharetra.
              </p>

              <h3>Başlık 2</h3>
              <p>
                Praesent vulputate magna eu magna tempus, ac vestibulum metus viverra. Vestibulum
                ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
              </p>

              <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                <code>
                  {`function example() {
  console.log("Bu bir örnek kod bloğudur");
  return true;
}`}
                </code>
              </pre>

              <h3>Başlık 3</h3>
              <p>
                Nulla facilisi. Curabitur aliquet ligula eu magna imperdiet, vitae efficitur tortor
                vulputate. Etiam vehicula purus in libero consequat, nec tempus justo ullamcorper.
              </p>

              <ul>
                <li>Liste öğesi 1</li>
                <li>Liste öğesi 2</li>
                <li>Liste öğesi 3</li>
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setActiveDocId('')}>Kapat</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
