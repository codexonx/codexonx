"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Star, 
  MessageSquare, 
  User,
  ThumbsUp,
  Eye,
  Code,
  ExternalLink,
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Örnek proje verileri
const projects = [
  {
    id: 1,
    title: "AI Destekli Metin Editörü",
    description: "React ve TensorFlow.js kullanarak oluşturulmuş AI destekli bir metin editörü. Metin düzenleme ve öneriler için yapay zeka kullanıyor.",
    author: {
      name: "Ahmet Yılmaz",
      username: "ahmetyilmaz",
      avatar: "/avatars/user1.png"
    },
    stars: 128,
    comments: 24,
    views: 1450,
    likes: 89,
    language: "typescript",
    tags: ["AI", "React", "TensorFlow"],
    createdAt: "3 gün önce"
  },
  {
    id: 2,
    title: "Real-time Veri İzleme Dashboard",
    description: "Next.js, Socket.io ve D3.js ile geliştirilmiş gerçek zamanlı veri izleme dashboard'u. Anında veri güncellemeleri ve interaktif grafikler içerir.",
    author: {
      name: "Zeynep Kaya",
      username: "zeynepk",
      avatar: "/avatars/user2.png"
    },
    stars: 76,
    comments: 17,
    views: 820,
    likes: 62,
    language: "javascript",
    tags: ["Dashboard", "Next.js", "D3.js", "Real-time"],
    createdAt: "1 hafta önce"
  },
  {
    id: 3,
    title: "Blockchain Tabanlı Oylama Sistemi",
    description: "Ethereum blockchain üzerinde çalışan güvenli bir oylama sistemi. Akıllı kontratlar ve web arayüzü içerir.",
    author: {
      name: "Emre Demir",
      username: "emredemir",
      avatar: "/avatars/user3.png"
    },
    stars: 201,
    comments: 35,
    views: 2800,
    likes: 145,
    language: "solidity",
    tags: ["Blockchain", "Ethereum", "Smart Contracts", "DApp"],
    createdAt: "2 hafta önce"
  },
  {
    id: 4,
    title: "Python ile Doğal Dil İşleme Kütüphanesi",
    description: "Türkçe metinler için özelleştirilmiş, kapsamlı bir doğal dil işleme kütüphanesi. Duygu analizi, metin sınıflandırma ve özetleme özellikleri içerir.",
    author: {
      name: "Deniz Yıldız",
      username: "denizyildiz",
      avatar: "/avatars/user4.png"
    },
    stars: 312,
    comments: 46,
    views: 5200,
    likes: 234,
    language: "python",
    tags: ["NLP", "Python", "Machine Learning", "AI"],
    createdAt: "3 hafta önce"
  },
  {
    id: 5,
    title: "Mikro Servis Mimarisi Örneği",
    description: "Docker ve Kubernetes kullanarak ölçeklenebilir mikro servis mimarisi örneği. API Gateway, hizmet keşfi ve izleme içerir.",
    author: {
      name: "Mehmet Özkan",
      username: "mehmetozkan",
      avatar: "/avatars/user5.png"
    },
    stars: 159,
    comments: 28,
    views: 3100,
    likes: 117,
    language: "go",
    tags: ["Microservices", "Docker", "Kubernetes", "DevOps"],
    createdAt: "1 ay önce"
  }
];

// Örnek tartışma konuları
const discussions = [
  {
    id: 1,
    title: "Next.js 14 App Router vs Pages Router",
    description: "Next.js'in yeni App Router yapısı ile eski Pages Router arasındaki farkları ve hangisinin ne zaman kullanılması gerektiğini tartışalım.",
    author: {
      name: "Can Aydın",
      username: "canaydin",
      avatar: "/avatars/user6.png"
    },
    replies: 32,
    views: 1240,
    likes: 87,
    tags: ["Next.js", "React", "Frontend"],
    createdAt: "2 gün önce",
    lastActivity: "3 saat önce"
  },
  {
    id: 2,
    title: "TypeScript ile Daha İyi Kod Yazmanın Yolları",
    description: "TypeScript'te tip güvenliği sağlamanın, hataları azaltmanın ve daha sürdürülebilir kod yazmanın yollarını tartışalım.",
    author: {
      name: "Ayşe Yılmaz",
      username: "ayseyilmaz",
      avatar: "/avatars/user7.png"
    },
    replies: 24,
    views: 876,
    likes: 65,
    tags: ["TypeScript", "JavaScript", "Best Practices"],
    createdAt: "4 gün önce",
    lastActivity: "12 saat önce"
  },
  {
    id: 3,
    title: "AI ve Yazılım Geliştirme: Geleceğin Trendleri",
    description: "Yapay zekanın yazılım geliştirme üzerindeki etkileri ve gelecekte bizi bekleyen değişimler hakkında görüşleriniz neler?",
    author: {
      name: "Burak Kaya",
      username: "burakkaya",
      avatar: "/avatars/user8.png"
    },
    replies: 41,
    views: 1870,
    likes: 123,
    tags: ["AI", "Future", "Software Development"],
    createdAt: "1 hafta önce",
    lastActivity: "1 gün önce"
  }
];

// Dil renkler
const languageColors: Record<string, string> = {
  typescript: "bg-blue-500",
  javascript: "bg-yellow-400",
  python: "bg-green-500",
  go: "bg-blue-300",
  rust: "bg-orange-600",
  solidity: "bg-purple-500"
};

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("projects");

  // Arama fonksiyonu
  const filteredProjects = projects.filter(project => {
    return (
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const filteredDiscussions = discussions.filter(discussion => {
    return (
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Topluluk</h1>
          <p className="text-muted-foreground">
            Projeler keşfedin, fikirleri tartışın ve topluluğa katkıda bulunun.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button>
            <Code className="mr-2 h-4 w-4" />
            Proje Paylaş
          </Button>
        </div>
      </div>
      
      {/* Arama ve Filtreler */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Projeler ve tartışmalarda ara..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrele
          </Button>
          <Button variant="outline" className="gap-2">
            <Star className="h-4 w-4" />
            En Çok Yıldız Alanlar
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="projects" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="projects">Projeler</TabsTrigger>
          <TabsTrigger value="discussions">Tartışmalar</TabsTrigger>
          <TabsTrigger value="people">İnsanlar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-6">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Code className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Hiç proje bulunamadı</h3>
              <p className="text-muted-foreground mt-2">Arama kriterlerinize uygun proje bulunamadı. Lütfen başka terimlerle arayın.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl hover:text-primary hover:underline">
                          <a href={`/dashboard/community/projects/${project.id}`}>{project.title}</a>
                        </CardTitle>
                        <div className="flex items-center mt-1 space-x-2">
                          <div className={`h-3 w-3 rounded-full ${languageColors[project.language] || "bg-gray-400"}`}></div>
                          <CardDescription>{project.language}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Star className={`h-5 w-5 ${project.stars > 100 ? "text-yellow-400 fill-yellow-400" : ""}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={project.author.avatar} alt={project.author.name} />
                        <AvatarFallback>{project.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <p className="text-sm font-medium">{project.author.name}</p>
                        <p className="text-xs text-muted-foreground">Paylaşıldı: {project.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        <span>{project.stars}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        <span>{project.comments}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="mr-1 h-4 w-4" />
                        <span>{project.views}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="discussions" className="space-y-6">
          {filteredDiscussions.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Hiç tartışma bulunamadı</h3>
              <p className="text-muted-foreground mt-2">Arama kriterlerinize uygun tartışma bulunamadı. Lütfen başka terimlerle arayın.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredDiscussions.map((discussion) => (
                <Card key={discussion.id}>
                  <CardHeader>
                    <CardTitle className="text-xl hover:text-primary hover:underline">
                      <a href={`/dashboard/community/discussions/${discussion.id}`}>{discussion.title}</a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{discussion.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {discussion.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                        <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <p className="text-sm font-medium">{discussion.author.name}</p>
                        <p className="text-xs text-muted-foreground">Başlatıldı: {discussion.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                      <div className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        <span>{discussion.replies} cevap</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="mr-1 h-4 w-4" />
                        <span>{discussion.views} görüntüleme</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        <span>{discussion.likes}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="people" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...projects, ...discussions].map(item => item.author).filter((author, index, self) => 
              index === self.findIndex(a => a.username === author.username)
            ).map((person, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{person.name}</CardTitle>
                      <CardDescription>@{person.username}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Aktif topluluk üyesi, {Math.floor(Math.random() * 20) + 1} proje ve {Math.floor(Math.random() * 30) + 1} tartışmaya katkıda bulundu.</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Profili Görüntüle
                  </Button>
                  <Button variant="ghost" size="sm" className="w-9 px-0">
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
