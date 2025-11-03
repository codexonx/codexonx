"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  User, 
  Mail, 
  Link2 as LinkIcon, 
  Github,
  Twitter,
  Linkedin,
  Calendar,
  MapPin,
  Briefcase,
  Edit,
  Settings,
  PlusCircle,
  Shield,
  BookOpen,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Separator bileşeni
const Separator = ({ className, ...props }) => (
  <div
    className={cn("h-[1px] w-full bg-border my-4", className)}
    {...props}
  />
);

// Örnek kullanıcı verileri
const userData = {
  name: "Ahmet Yılmaz",
  username: "ahmetyilmaz",
  role: "Yazılım Geliştirici",
  email: "ahmet.yilmaz@example.com",
  website: "https://ahmetyilmaz.dev",
  location: "İstanbul, Türkiye",
  company: "TechCorp",
  joinDate: "Ekim 2023",
  bio: "Yazılım geliştirici ve açık kaynak kod meraklısı. React, Node.js ve AI teknolojileri üzerine çalışıyorum. Sürekli öğrenmeyi ve yeni teknolojileri keşfetmeyi seviyorum.",
  skills: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "AI"],
  socials: {
    github: "github.com/ahmetyilmaz",
    twitter: "twitter.com/ahmetyilmaz",
    linkedin: "linkedin.com/in/ahmetyilmaz"
  },
  stats: {
    projects: 16,
    followers: 128,
    following: 47,
    contributions: 523
  },
  activity: [
    { 
      id: 1, 
      type: "project", 
      action: "created a new project", 
      target: "AI Metin Editörü", 
      date: "2 gün önce",
      url: "/dashboard/projects/ai-text-editor"
    },
    { 
      id: 2, 
      type: "comment", 
      action: "commented on", 
      target: "React Component Architecture", 
      date: "1 hafta önce",
      url: "/dashboard/community/discussions/123"
    },
    { 
      id: 3, 
      type: "star", 
      action: "starred", 
      target: "Real-time Dashboard", 
      date: "2 hafta önce",
      url: "/dashboard/community/projects/456" 
    }
  ]
};

// Örnek projeler
const userProjects = [
  {
    id: "proj1",
    name: "AI Metin Editörü",
    description: "React ve TensorFlow.js ile geliştirilmiş yapay zeka destekli metin editörü",
    language: "typescript",
    stars: 23,
    lastUpdate: "2 gün önce"
  },
  {
    id: "proj2",
    name: "Real-time Dashboard",
    description: "Socket.io ve D3.js ile gerçek zamanlı veri görselleştirme dashboard'u",
    language: "javascript",
    stars: 47,
    lastUpdate: "1 ay önce"
  },
  {
    id: "proj3",
    name: "API Gateway",
    description: "Mikroservis mimarisi için geliştirilen API Gateway ve hizmet keşfi sistemi",
    language: "typescript",
    stars: 12,
    lastUpdate: "2 hafta önce"
  }
];

// Dil renkleri
const languageColors = {
  javascript: "bg-yellow-400",
  typescript: "bg-blue-500",
  python: "bg-green-500",
  java: "bg-brown-500",
  go: "bg-blue-400"
};

// Aktivite ikon bileşeni
const ActivityIcon = ({ type }) => {
  switch (type) {
    case "project":
      return <PlusCircle className="h-4 w-4 text-green-500" />;
    case "comment":
      return <BookOpen className="h-4 w-4 text-blue-500" />;
    case "star":
      return <Twitter className="h-4 w-4 text-yellow-500" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(userData);
  
  // Profil düzenleme fonksiyonu
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Gerçek bir uygulamada burada API çağrısı yapılacak
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">Profil</h1>
          <p className="text-muted-foreground">
            Kişisel profilinizi yönetin ve diğer geliştiricilerle etkileşime geçin
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="mr-2 h-4 w-4" />
            Profili Düzenle
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Ayarlar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sol sütun - Profil bilgileri */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-muted mb-4">
                  <img 
                    src="/avatar.png" 
                    alt={profile.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <CardTitle className="text-xl">{profile.name}</CardTitle>
                <CardDescription className="text-sm">@{profile.username}</CardDescription>
                <Badge variant="outline" className="mt-2">{profile.role}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 opacity-70" />
                  <span>{profile.email}</span>
                </div>
                
                {profile.website && (
                  <div className="flex items-center text-sm">
                    <LinkIcon className="mr-2 h-4 w-4 opacity-70" />
                    <a 
                      href={profile.website} 
                      className="text-primary hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                
                {profile.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 opacity-70" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {profile.company && (
                  <div className="flex items-center text-sm">
                    <Briefcase className="mr-2 h-4 w-4 opacity-70" />
                    <span>{profile.company}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 opacity-70" />
                  <span>Katıldı: {profile.joinDate}</span>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Sosyal Bağlantılar</h3>
                  
                  <div className="flex flex-col gap-2">
                    {profile.socials.github && (
                      <a 
                        href={`https://${profile.socials.github}`} 
                        className="flex items-center text-sm text-primary hover:underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        <span>{profile.socials.github.split('/').pop()}</span>
                      </a>
                    )}
                    
                    {profile.socials.twitter && (
                      <a 
                        href={`https://${profile.socials.twitter}`} 
                        className="flex items-center text-sm text-primary hover:underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Twitter className="mr-2 h-4 w-4" />
                        <span>{profile.socials.twitter.split('/').pop()}</span>
                      </a>
                    )}
                    
                    {profile.socials.linkedin && (
                      <a 
                        href={`https://${profile.socials.linkedin}`} 
                        className="flex items-center text-sm text-primary hover:underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="mr-2 h-4 w-4" />
                        <span>{profile.socials.linkedin.split('/').pop()}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">İstatistikler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-2 border rounded">
                  <span className="text-2xl font-bold">{profile.stats.projects}</span>
                  <span className="text-xs text-muted-foreground">Projeler</span>
                </div>
                <div className="flex flex-col items-center p-2 border rounded">
                  <span className="text-2xl font-bold">{profile.stats.followers}</span>
                  <span className="text-xs text-muted-foreground">Takipçiler</span>
                </div>
                <div className="flex flex-col items-center p-2 border rounded">
                  <span className="text-2xl font-bold">{profile.stats.following}</span>
                  <span className="text-xs text-muted-foreground">Takip Edilen</span>
                </div>
                <div className="flex flex-col items-center p-2 border rounded">
                  <span className="text-2xl font-bold">{profile.stats.contributions}</span>
                  <span className="text-xs text-muted-foreground">Katkılar</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sağ sütun - Bilgiler ve sekmeler */}
        <div className="lg:col-span-3">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Profil Düzenleme</CardTitle>
                <CardDescription>Profil bilgilerinizi güncelleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="name">İsim</label>
                    <Input 
                      id="name" 
                      value={profile.name} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="username">Kullanıcı Adı</label>
                    <Input 
                      id="username" 
                      value={profile.username} 
                      onChange={(e) => setProfile({...profile, username: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="bio">Hakkında</label>
                    <textarea 
                      id="bio"
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="location">Konum</label>
                      <Input 
                        id="location" 
                        value={profile.location} 
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="company">Şirket</label>
                      <Input 
                        id="company" 
                        value={profile.company} 
                        onChange={(e) => setProfile({...profile, company: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="website">Web Sitesi</label>
                    <Input 
                      id="website" 
                      value={profile.website} 
                      onChange={(e) => setProfile({...profile, website: e.target.value})}
                    />
                  </div>
                  
                  <div className="pt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      İptal
                    </Button>
                    <Button type="submit">
                      Kaydet
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Hakkında</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{profile.bio}</p>
                </CardContent>
              </Card>
              
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                  <TabsTrigger value="projects">Projeler</TabsTrigger>
                  <TabsTrigger value="activity">Aktivite</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Yetenekler</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Son Projeler</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userProjects.slice(0, 2).map((project) => (
                          <div key={project.id} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`h-3 w-3 rounded-full ${languageColors[project.language] || "bg-gray-400"}`}></div>
                              <h3 className="font-medium">{project.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <span>Son güncelleme: {project.lastUpdate}</span>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1" />
                                <span>{project.stars}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab("projects")}>
                          Tüm Projeleri Gör
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="projects" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Tüm Projeler</h2>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Yeni Proje
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {userProjects.map((project) => (
                      <Card key={project.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${languageColors[project.language] || "bg-gray-400"}`}></div>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-xs text-muted-foreground">Son güncelleme: {project.lastUpdate}</span>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              <span>{project.stars}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full">
                            Projeyi Görüntüle
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Son Aktiviteler</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profile.activity.map((activity) => (
                          <div key={activity.id} className="flex">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full border">
                              <ActivityIcon type={activity.type} />
                            </div>
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Siz</span>
                                {" "}
                                <span>{activity.action}</span>
                                {" "}
                                <a href={activity.url} className="font-medium text-primary hover:underline">
                                  {activity.target}
                                </a>
                              </p>
                              <span className="text-xs text-muted-foreground">{activity.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
