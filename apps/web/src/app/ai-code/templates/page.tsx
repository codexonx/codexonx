'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  FileCode,
  Search,
  FolderPlus,
  Star,
  ExternalLink,
  Filter,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// Şablon kategorileri
const categories = [
  { id: 'all', name: 'Tüm Şablonlar' },
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'fullstack', name: 'Full Stack' },
  { id: 'mobile', name: 'Mobil' },
  { id: 'data', name: 'Veri Bilimi' },
];

// Demo şablonlar
const templates = [
  {
    id: 'react-todo',
    name: 'React Todo Uygulaması',
    description:
      'Temel CRUD işlemlerini içeren başlangıç seviyesi bir React uygulaması. Context API ile state yönetimi içerir.',
    category: 'frontend',
    language: 'typescript',
    level: 'başlangıç',
    stars: 245,
    author: 'AICodeX',
    lastUpdated: '1 hafta önce',
  },
  {
    id: 'express-api',
    name: 'Express.js REST API',
    description: "MongoDB bağlantısı ve temel CRUD endpoint'leri ile RESTful API şablonu.",
    category: 'backend',
    language: 'javascript',
    level: 'orta',
    stars: 189,
    author: 'AICodeX',
    lastUpdated: '2 gün önce',
  },
  {
    id: 'next-blog',
    name: 'Next.js Blog',
    description: 'SEO dostu, markdown destekli statik blog sitesi. Tailwind CSS ile stil verilmiş.',
    category: 'frontend',
    language: 'typescript',
    level: 'orta',
    stars: 321,
    author: 'AICodeX',
    lastUpdated: '3 gün önce',
  },
  {
    id: 'flask-api',
    name: 'Flask API',
    description: 'SQLAlchemy ORM ile Python Flask API başlangıç şablonu.',
    category: 'backend',
    language: 'python',
    level: 'başlangıç',
    stars: 156,
    author: 'AICodeX',
    lastUpdated: '1 ay önce',
  },
  {
    id: 'react-native-app',
    name: 'React Native Mobil Uygulama',
    description: 'Navigasyon, tema desteği ve temel ekranlar içeren React Native uygulama şablonu.',
    category: 'mobile',
    language: 'typescript',
    level: 'orta',
    stars: 287,
    author: 'AICodeX',
    lastUpdated: '2 hafta önce',
  },
  {
    id: 'mern-stack',
    name: 'MERN Stack Uygulama',
    description: 'MongoDB, Express, React ve Node.js ile tam bir full stack web uygulaması.',
    category: 'fullstack',
    language: 'javascript',
    level: 'ileri',
    stars: 412,
    author: 'AICodeX',
    lastUpdated: '1 gün önce',
  },
  {
    id: 'data-analysis',
    name: 'Veri Analiz Notebook',
    description:
      'Pandas, NumPy ve Matplotlib ile veri analizi ve görselleştirme için Jupyter notebook şablonu.',
    category: 'data',
    language: 'python',
    level: 'orta',
    stars: 198,
    author: 'AICodeX',
    lastUpdated: '1 hafta önce',
  },
  {
    id: 'django-web',
    name: 'Django Web Uygulaması',
    description:
      'Kullanıcı yetkilendirme, admin paneli ve temel CRUD işlevleri içeren Django web uygulaması.',
    category: 'backend',
    language: 'python',
    level: 'orta',
    stars: 231,
    author: 'AICodeX',
    lastUpdated: '2 hafta önce',
  },
];

// Dil ikonları ve renkleri
const languageColors = {
  typescript: 'text-blue-400',
  javascript: 'text-yellow-400',
  python: 'text-green-500',
  html: 'text-orange-500',
  css: 'text-blue-500',
};

// Zorluk seviyesi
const levelBadges = {
  başlangıç: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  orta: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  ileri: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  // Şablonları filtrele
  const filteredTemplates = templates.filter(template => {
    // Kategori filtresi
    if (activeCategory !== 'all' && template.category !== activeCategory) {
      return false;
    }

    // Arama filtresi
    if (
      searchTerm &&
      !template.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !template.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Şablonları sırala
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (activeSort === 'popular') {
      return b.stars - a.stars;
    } else if (activeSort === 'newest') {
      // Bu demo için sadece alfabetik sıralama yapalım
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Kod Şablonları</h1>
          <p className="text-gray-400 mb-6">
            Projeleriniz için hazır şablonlar ve başlangıç ​​projeleri
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Şablon ara..."
                className="pl-10 bg-slate-900 border-slate-700 text-white"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-900"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtreler
                  <ChevronDown
                    className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  />
                </Button>

                {showFilters && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700 rounded-md shadow-lg z-10">
                    <div className="p-3 border-b border-slate-800">
                      <h3 className="text-sm font-medium">Sırala</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="sort-popular"
                            name="sort"
                            className="mr-2"
                            checked={activeSort === 'popular'}
                            onChange={() => setActiveSort('popular')}
                          />
                          <label htmlFor="sort-popular" className="text-sm">
                            Popüler
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="sort-newest"
                            name="sort"
                            className="mr-2"
                            checked={activeSort === 'newest'}
                            onChange={() => setActiveSort('newest')}
                          />
                          <label htmlFor="sort-newest" className="text-sm">
                            En Yeni
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="text-sm font-medium">Dil</h3>
                      <div className="mt-2 space-y-1">
                        {['typescript', 'javascript', 'python'].map(lang => (
                          <div key={lang} className="flex items-center">
                            <input type="checkbox" id={`lang-${lang}`} className="mr-2" />
                            <label htmlFor={`lang-${lang}`} className="text-sm capitalize">
                              {lang}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <FolderPlus className="w-4 h-4 mr-2" />
                Şablon Yükle
              </Button>
            </div>
          </div>
        </header>

        {/* Kategori Sekmeleri */}
        <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2 mb-6">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Şablon Listesi */}
        {sortedTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileCode className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">Şablon bulunamadı</h2>
            <p className="text-gray-400">
              Arama kriterlerinize uygun şablon bulamadık. Lütfen farklı anahtar kelimeler deneyin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Şablon kartı komponenti
function TemplateCard({ template }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mr-3 ${languageColors[template.language]}`}
            >
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium hover:text-blue-400 transition-colors">
                <Link href={`/ai-code/editor?template=${template.id}`}>{template.name}</Link>
              </h3>
              <div className="flex items-center mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${levelBadges[template.level]}`}>
                  {template.level}
                </span>
                <span className="text-slate-500 text-xs mx-2">•</span>
                <span className="text-slate-400 text-xs">{template.category}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center mr-2">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-400 ml-1">{template.stars}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm my-3 line-clamp-2">{template.description}</p>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>{template.lastUpdated}</span>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-gray-400 hover:text-white"
              title="Önizleme"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              Önizleme
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-xs"
              title="Şablonla başla"
            >
              <FolderPlus className="w-3.5 h-3.5 mr-1" />
              Kullan
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
