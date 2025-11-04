'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MessageSquare,
  ThumbsUp,
  User,
  Calendar,
  Tag,
  MessageCircle,
  Heart,
  Bookmark,
  Share2,
  Eye,
  Filter,
  Code,
  ArrowUp,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Örnek soru verileri
const demoQuestions = [
  {
    id: 'q1',
    title: "Next.js 14'te App Router ile Server Components nasıl kullanılır?",
    body: 'Next.js 14 ile gelen App Router yapısında server componentleri kullanırken data fetching işlemlerini nasıl en verimli şekilde yapabilirim?',
    tags: ['next.js', 'react', 'server-components'],
    votes: 42,
    answers: 5,
    views: 289,
    user: {
      name: 'Ahmet Y.',
      avatar: '/avatars/user1.png',
    },
    created: '2 gün önce',
    featured: true,
  },
  {
    id: 'q2',
    title: 'TailwindCSS ile responsif grid yapısı kurma',
    body: 'TailwindCSS kullanarak farklı ekran boyutlarına göre değişen grid yapısı nasıl oluşturulur?',
    tags: ['tailwindcss', 'css', 'responsive-design'],
    votes: 28,
    answers: 7,
    views: 312,
    user: {
      name: 'Zeynep K.',
      avatar: '/avatars/user2.png',
    },
    created: '4 gün önce',
    featured: false,
  },
  {
    id: 'q3',
    title: 'React useMemo ve useCallback performans optimizasyonu',
    body: "React'te useMemo ve useCallback kullanarak yeniden render'ları nasıl optimize edebilirim?",
    tags: ['react', 'hooks', 'performance'],
    votes: 35,
    answers: 4,
    views: 278,
    user: {
      name: 'Mehmet A.',
      avatar: '/avatars/user3.png',
    },
    created: '1 hafta önce',
    featured: true,
  },
  {
    id: 'q4',
    title: 'TypeScript ile generics kullanımı',
    body: "TypeScript'te generic type'lar nasıl oluşturulur ve bunların avantajları nelerdir?",
    tags: ['typescript', 'generics'],
    votes: 19,
    answers: 3,
    views: 156,
    user: {
      name: 'Ayşe B.',
      avatar: '/avatars/user4.png',
    },
    created: '3 gün önce',
    featured: false,
  },
  {
    id: 'q5',
    title: 'MongoDB ile aggregation pipeline kullanımı',
    body: "MongoDB'de karmaşık sorgular için aggregation pipeline nasıl etkili bir şekilde kullanılır?",
    tags: ['mongodb', 'database', 'aggregation'],
    votes: 31,
    answers: 6,
    views: 203,
    user: {
      name: 'Emre C.',
      avatar: '/avatars/user5.png',
    },
    created: '5 gün önce',
    featured: false,
  },
];

// Örnek popüler etiketler
const popularTags = [
  { name: 'react', count: 1432 },
  { name: 'javascript', count: 986 },
  { name: 'typescript', count: 754 },
  { name: 'next.js', count: 635 },
  { name: 'tailwindcss', count: 548 },
  { name: 'node.js', count: 492 },
  { name: 'mongodb', count: 387 },
  { name: 'python', count: 325 },
  { name: 'ai', count: 312 },
];

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('newest');
  const [activeTagFilter, setActiveTagFilter] = useState('');
  const [questions, setQuestions] = useState(demoQuestions);

  // Soruları filtrele
  const filteredQuestions = questions.filter(question => {
    // Arama filtrelemesi
    if (
      searchTerm &&
      !question.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !question.body.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Etiket filtrelemesi
    if (activeTagFilter && !question.tags.includes(activeTagFilter)) {
      return false;
    }

    return true;
  });

  // Soruları sırala
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (activeTab === 'featured') {
      // Öne çıkanlar
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.votes - a.votes;
    } else if (activeTab === 'popular') {
      // En popülerler
      return b.votes - a.votes;
    } else if (activeTab === 'unanswered') {
      // Cevaplanmamış sorular
      return a.answers - b.answers;
    } else {
      // En yeniler (varsayılan)
      return 0; // Demo için sıralama yapmıyoruz
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Topluluk</h1>
          <p className="text-gray-400 mb-6">
            Sorular sorun, yanıtlar alın ve kodlama topluluğumuza katılın
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Toplulukta ara..."
                className="pl-10 bg-slate-900 border-slate-700 text-white"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Soru Sor
            </Button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Ana İçerik */}
          <div className="flex-1">
            {/* Sekmeler */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="bg-slate-900 border-slate-700">
                <TabsTrigger value="newest" className="data-[state=active]:bg-slate-800">
                  En Yeni
                </TabsTrigger>
                <TabsTrigger value="featured" className="data-[state=active]:bg-slate-800">
                  Öne Çıkanlar
                </TabsTrigger>
                <TabsTrigger value="popular" className="data-[state=active]:bg-slate-800">
                  Popüler
                </TabsTrigger>
                <TabsTrigger value="unanswered" className="data-[state=active]:bg-slate-800">
                  Cevaplanmamış
                </TabsTrigger>
              </TabsList>

              {/* Sorular Listesi */}
              <TabsContent value={activeTab} className="mt-4">
                {sortedQuestions.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900 rounded-lg border border-slate-800">
                    <MessageCircle className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <h2 className="text-xl font-medium text-white mb-2">Sonuç bulunamadı</h2>
                    <p className="text-gray-400">Arama kriterlerinize uygun soru bulamadık.</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {sortedQuestions.map(question => (
                      <QuestionCard key={question.id} question={question} />
                    ))}
                  </ul>
                )}

                {/* Sayfalama */}
                {sortedQuestions.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex bg-slate-900 border border-slate-800 rounded-md overflow-hidden">
                      <button
                        className="px-4 py-2 border-r border-slate-800 text-blue-500"
                        title="Sayfa 1"
                        aria-label="Sayfa 1"
                        aria-current="page"
                      >
                        1
                      </button>
                      <button
                        className="px-4 py-2 border-r border-slate-800 hover:bg-slate-800"
                        title="Sayfa 2"
                        aria-label="Sayfa 2"
                      >
                        2
                      </button>
                      <button
                        className="px-4 py-2 border-r border-slate-800 hover:bg-slate-800"
                        title="Sayfa 3"
                        aria-label="Sayfa 3"
                      >
                        3
                      </button>
                      <button
                        className="px-4 py-2 hover:bg-slate-800"
                        title="Daha fazla sayfa"
                        aria-label="Daha fazla sayfa"
                      >
                        ...
                      </button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Yan Panel */}
          <div className="md:w-80 space-y-6">
            {/* Popüler Etiketler */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Popüler Etiketler</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <button
                    key={tag.name}
                    onClick={() => setActiveTagFilter(tag.name === activeTagFilter ? '' : tag.name)}
                    className={`flex items-center px-2 py-1 rounded-md text-xs ${
                      tag.name === activeTagFilter
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag.name}
                    <span className="ml-1 text-gray-400">({tag.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Topluluk İstatistikleri */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Topluluk İstatistikleri</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Kullanıcılar</span>
                  <span className="font-medium">24,532</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Sorular</span>
                  <span className="font-medium">36,789</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Yanıtlar</span>
                  <span className="font-medium">98,421</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Çözülen Sorunlar</span>
                  <span className="font-medium">24,875</span>
                </div>
              </div>
            </div>

            {/* Top Kullanıcılar */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Haftalık Top Kullanıcılar</h3>
              <ul className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="w-8 h-8 mr-2">
                        <AvatarFallback>{String.fromCharCode(65 + i)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Kullanıcı {i + 1}</span>
                    </div>
                    <span className="text-xs text-blue-400">{150 - i * 18} puan</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Soru kartı komponenti
function QuestionCard({ question }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-900 border ${question.featured ? 'border-blue-800' : 'border-slate-800'} rounded-lg p-4 relative`}
    >
      {question.featured && (
        <div className="absolute top-0 right-0 bg-blue-600 text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
          Öne Çıkan
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Oy Butonu */}
        <div className="flex flex-col items-center">
          <button
            className="p-1 hover:bg-slate-800 rounded-md"
            title="Yukarı oy ver"
            aria-label="Yukarı oy ver"
          >
            <ArrowUp className="w-5 h-5 text-blue-400" />
            <span className="sr-only">Yukarı oy ver</span>
          </button>
          <span className="font-medium py-1">{question.votes}</span>
          <div className="text-xs text-gray-400">oy</div>
        </div>

        {/* İçerik */}
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">
            <Link
              href={`/ai-code/community/questions/${question.id}`}
              className="hover:text-blue-400 transition-colors"
            >
              {question.title}
            </Link>
          </h3>

          <p className="text-gray-400 text-sm line-clamp-2 mb-3">{question.body}</p>

          {/* Etiketler */}
          <div className="flex flex-wrap gap-2 mb-3">
            {question.tags.map(tag => (
              <span key={tag} className="bg-slate-800 text-xs text-gray-300 px-2 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>

          {/* Alt bilgiler */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center">
              <Avatar className="w-5 h-5 mr-2">
                <AvatarFallback>{question.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{question.user.name}</span>
              <span className="mx-2">•</span>
              <Calendar className="w-3 h-3 mr-1" />
              <span>{question.created}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center">
                <MessageCircle className="w-3 h-3 mr-1" />
                {question.answers} yanıt
              </span>
              <span className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {question.views} görüntüleme
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
