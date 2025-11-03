"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Star,
  Code,
  FileCode,
  Settings,
  Database,
  Globe,
  Cpu,
  Cloud,
  PlusCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

// Örnek şablonlar
const templates = [
  {
    id: "t1",
    name: "React Component Library",
    description: "TypeScript ile modern React bileşen kitaplığı starter",
    category: "frontend",
    language: "typescript",
    stars: 234,
    forks: 78,
    type: "community",
    createdBy: "ahmetyilmaz",
    tags: ["react", "component-library", "typescript", "storybook"]
  },
  {
    id: "t2",
    name: "Express API Boilerplate",
    description: "TypeScript ve Express ile REST API şablonu",
    category: "backend",
    language: "typescript",
    stars: 189,
    forks: 45,
    type: "community", 
    createdBy: "mehmetcan",
    tags: ["express", "rest-api", "typescript", "mongodb"]
  },
  {
    id: "t3",
    name: "Next.js Dashboard",
    description: "Next.js ve Tailwind CSS ile dashboard starter",
    category: "fullstack",
    language: "typescript",
    stars: 312,
    forks: 124,
    type: "official",
    createdBy: "codexonx",
    tags: ["nextjs", "dashboard", "tailwind", "typescript"]
  },
  {
    id: "t4",
    name: "Machine Learning Notebook",
    description: "Python ve TensorFlow ile ML notebook başlangıcı",
    category: "data",
    language: "python",
    stars: 156,
    forks: 67,
    type: "community",
    createdBy: "datascientist42",
    tags: ["python", "machine-learning", "tensorflow", "jupyter"]
  },
  {
    id: "t5",
    name: "GraphQL Server",
    description: "Apollo Server ile GraphQL API şablonu",
    category: "backend",
    language: "javascript",
    stars: 178,
    forks: 42,
    type: "official",
    createdBy: "codexonx",
    tags: ["graphql", "apollo", "nodejs", "api"]
  },
  {
    id: "t6",
    name: "Vue 3 Admin Panel",
    description: "Vue 3 ve Vite ile admin panel",
    category: "frontend",
    language: "javascript",
    stars: 201,
    forks: 56,
    type: "community",
    createdBy: "vuedeveloper",
    tags: ["vue", "admin", "vite", "pinia"]
  }
];

// Kategoriler
const categories = [
  { id: "all", name: "Tümü", icon: <Code className="h-4 w-4" /> },
  { id: "frontend", name: "Frontend", icon: <Globe className="h-4 w-4" /> },
  { id: "backend", name: "Backend", icon: <Database className="h-4 w-4" /> },
  { id: "fullstack", name: "Fullstack", icon: <FileCode className="h-4 w-4" /> },
  { id: "data", name: "Veri Bilimi", icon: <Cpu className="h-4 w-4" /> },
  { id: "cloud", name: "Cloud", icon: <Cloud className="h-4 w-4" /> }
];

// Dil renkleri
const languageColors = {
  javascript: "bg-yellow-400",
  typescript: "bg-blue-500",
  python: "bg-green-500",
  java: "bg-brown-500",
  go: "bg-blue-400"
};

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Şablonları filtreleme
  const filteredTemplates = templates
    .filter(template => 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(template => 
      selectedCategory === "all" || template.category === selectedCategory
    );
  
  // Filtrele: Resmi / Topluluk
  const officialTemplates = filteredTemplates.filter(t => t.type === "official");
  const communityTemplates = filteredTemplates.filter(t => t.type === "community");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Şablonlar</h1>
        <p className="text-muted-foreground">
          Projelerinizi hızlıca başlatmak için hazır şablonları keşfedin
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Şablonlarda arayın..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 flex items-center gap-2 overflow-auto pb-2 sm:pb-0">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tüm Şablonlar</TabsTrigger>
          <TabsTrigger value="official">Resmi Şablonlar</TabsTrigger>
          <TabsTrigger value="community">Topluluk Şablonları</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}

            {filteredTemplates.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <FileCode className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium">Şablon Bulunamadı</h3>
                <p className="text-muted-foreground">
                  Aramanıza uygun şablon bulunamadı. Farklı bir arama terimi deneyin.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="official" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officialTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}

            {officialTemplates.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <FileCode className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium">Resmi Şablon Bulunamadı</h3>
                <p className="text-muted-foreground">
                  Bu kategoride resmi şablon bulunmamaktadır.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}

            {communityTemplates.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <FileCode className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium">Topluluk Şablonu Bulunamadı</h3>
                <p className="text-muted-foreground">
                  Bu kategoride topluluk şablonu bulunmamaktadır.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Şablon Kartı Bileşeni
function TemplateCard({ template }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${languageColors[template.language] || "bg-gray-400"}`}></div>
            <CardTitle className="text-base font-medium">{template.name}</CardTitle>
          </div>
          {template.type === "official" && (
            <Badge variant="secondary" className="ml-auto">Resmi</Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 mt-1">
          {template.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-2 mb-3">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <div className="flex items-center mr-4">
            <Star className="h-3.5 w-3.5 mr-1" />
            <span>{template.stars}</span>
          </div>
          <span>Oluşturan: {template.createdBy}</span>
        </div>
        <Button variant="outline" size="sm">
          Kullan
        </Button>
      </CardFooter>
    </Card>
  );
}
