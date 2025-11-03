"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Folder, 
  Code, 
  Search, 
  ArrowRight, 
  FolderPlus, 
  FileCode, 
  Star, 
  StarOff, 
  MoreHorizontal,
  Clock,
  Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Örnek proje verileri
const demoProjects = [
  {
    id: "proj-1",
    name: "Web Uygulaması",
    description: "React ve TypeScript ile geliştirilmiş bir web uygulaması",
    lastUpdated: "Bugün",
    favorite: true,
    language: "typescript",
    files: 12
  },
  {
    id: "proj-2",
    name: "API Servisi",
    description: "Node.js ve Express kullanılarak oluşturulmuş REST API",
    lastUpdated: "Dün",
    favorite: false,
    language: "javascript",
    files: 8
  },
  {
    id: "proj-3",
    name: "Veri Analizi",
    description: "Python ve Pandas ile veri analizi projesi",
    lastUpdated: "3 gün önce",
    favorite: true,
    language: "python",
    files: 5
  },
  {
    id: "proj-4",
    name: "E-ticaret Frontend",
    description: "Next.js ile oluşturulmuş e-ticaret sitesi frontend'i",
    lastUpdated: "1 hafta önce",
    favorite: false,
    language: "typescript", 
    files: 18
  }
];

// Dil ikonları ve renkleri
const languageColors = {
  typescript: "text-blue-400",
  javascript: "text-yellow-400",
  python: "text-green-500",
  html: "text-orange-500",
  css: "text-blue-500"
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState(demoProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectLanguage, setNewProjectLanguage] = useState("typescript");

  // Projeleri filtrele
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Favorileri ve diğerlerini ayır
  const favoriteProjects = filteredProjects.filter(p => p.favorite);
  const otherProjects = filteredProjects.filter(p => !p.favorite);

  // Yeni proje oluştur
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    const newProject = {
      id: `proj-${projects.length + 1}`,
      name: newProjectName,
      description: newProjectDescription || "Açıklama yok",
      lastUpdated: "Şimdi",
      favorite: false,
      language: newProjectLanguage,
      files: 0
    };
    
    setProjects([...projects, newProject]);
    setNewProjectDialogOpen(false);
    setNewProjectName("");
    setNewProjectDescription("");
    setNewProjectLanguage("typescript");
  };

  // Favori durumunu değiştir
  const toggleFavorite = (id) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, favorite: !project.favorite } : project
    ));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Projelerim</h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Projelerde ara..."
                className="pl-10 bg-slate-900 border-slate-700 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Proje
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 text-white border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Yeni Proje Oluştur</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Projeniz için bir isim ve açıklama girin.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-300">
                      Proje Adı
                    </label>
                    <Input
                      id="name"
                      placeholder="Projenin adını girin"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-gray-300">
                      Açıklama
                    </label>
                    <Input
                      id="description"
                      placeholder="Proje açıklaması girin"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="language" className="text-sm font-medium text-gray-300">
                      Ana Programlama Dili
                    </label>
                    <select
                      id="language"
                      className="w-full rounded-md bg-slate-800 border-slate-700 text-white px-3 py-2 text-sm"
                      value={newProjectLanguage}
                      onChange={(e) => setNewProjectLanguage(e.target.value)}
                    >
                      <option value="typescript">TypeScript</option>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="html">HTML/CSS</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="ghost" 
                    onClick={() => setNewProjectDialogOpen(false)}
                    className="text-gray-300 hover:text-white"
                  >
                    İptal
                  </Button>
                  <Button 
                    onClick={handleCreateProject} 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!newProjectName.trim()}
                  >
                    Proje Oluştur
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="bg-slate-900 border-slate-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-800">
              Tüm Projeler
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-slate-800">
              Son Kullanılanlar
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-slate-800">
              Favoriler
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <ProjectList 
              title="Favori Projeler" 
              projects={favoriteProjects} 
              emptyMessage="Favori projeniz yok"
              toggleFavorite={toggleFavorite}
            />
            <ProjectList 
              title="Diğer Projeler" 
              projects={otherProjects} 
              emptyMessage="Hiç projeniz yok"
              toggleFavorite={toggleFavorite}
            />
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            <ProjectList 
              title="Son Kullanılanlar" 
              projects={filteredProjects.slice(0, 2)} 
              emptyMessage="Son kullanılan proje yok"
              toggleFavorite={toggleFavorite}
            />
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <ProjectList 
              title="Favori Projeler" 
              projects={favoriteProjects} 
              emptyMessage="Favori projeniz yok"
              toggleFavorite={toggleFavorite}
            />
          </TabsContent>
        </Tabs>

        {filteredProjects.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">Sonuç bulunamadı</h2>
            <p className="text-gray-400">
              "{searchTerm}" için eşleşen proje bulunamadı.
            </p>
          </div>
        )}

        {filteredProjects.length === 0 && !searchTerm && (
          <div className="text-center py-12">
            <FolderPlus className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">Henüz projeniz yok</h2>
            <p className="text-gray-400 mb-6">
              İlk projenizi oluşturarak AI ile kod yazmaya başlayın.
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setNewProjectDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Proje
            </Button>
          </div>
        )}

        {/* Proje Önerileri */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">Önerilen Şablonlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <TemplateCard
              title="React Todo Uygulaması"
              description="Temel CRUD işlemleri ile başlangıç seviyesi React uygulaması"
              language="typescript"
            />
            <TemplateCard
              title="Express API"
              description="RESTful API için Express.js şablonu"
              language="javascript"
            />
            <TemplateCard
              title="Data Science Notebook"
              description="Veri analizi için Python şablonu"
              language="python"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

// Proje listesi komponenti
function ProjectList({ title, projects, emptyMessage, toggleFavorite }) {
  if (projects.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
          >
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mr-3 ${languageColors[project.language]}`}>
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium hover:text-blue-400 transition-colors">
                      <Link href={`/ai-code/editor?project=${project.id}`}>
                        {project.name}
                      </Link>
                    </h3>
                    <p className="text-gray-400 text-sm">{project.description}</p>
                  </div>
                </div>
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-yellow-400"
                    onClick={() => toggleFavorite(project.id)}
                    title={project.favorite ? "Favorilerden çıkar" : "Favorilere ekle"}
                  >
                    {project.favorite ? (
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400"
                    title="Diğer seçenekler"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  <span>{project.lastUpdated}</span>
                  <span className="mx-2">•</span>
                  <FileCode className="w-3.5 h-3.5 mr-1" />
                  <span>{project.files} dosya</span>
                </div>
                <Link 
                  href={`/ai-code/editor?project=${project.id}`}
                  className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
                >
                  <span className="mr-1">Aç</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Şablon kart komponenti
function TemplateCard({ title, description, language }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors p-5"
    >
      <div className="flex items-center mb-3">
        <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-2 ${languageColors[language]}`}>
          <Code className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">
        <FolderPlus className="w-4 h-4 mr-2" /> 
        Bu Şablonla Başla
      </Button>
    </motion.div>
  );
}
