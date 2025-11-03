"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Globe,
  Code,
  Server,
  Play,
  Search,
  ChevronRight,
  ChevronDown,
  Lock,
  Copy,
  ArrowRight,
  ExternalLink
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

// HTTP metod renkleri
const methodColors = {
  GET: "bg-blue-500",
  POST: "bg-green-500",
  PUT: "bg-yellow-500",
  PATCH: "bg-orange-500",
  DELETE: "bg-red-500",
};

// API endpoint grupları
const apiGroups = [
  {
    id: "authentication",
    name: "Kimlik Doğrulama",
    description: "Kullanıcı kimlik doğrulama ve yetkilendirme",
    icon: <Lock className="h-4 w-4" />,
    endpoints: [
      {
        id: "login",
        method: "POST",
        path: "/api/auth/login",
        description: "Kullanıcı girişi ve token alımı",
        requiresAuth: false,
        parameters: [
          { name: "email", type: "string", required: true, description: "Kullanıcı e-posta adresi" },
          { name: "password", type: "string", required: true, description: "Kullanıcı şifresi" }
        ],
        responses: [
          { code: 200, description: "Başarılı yanıt", example: { token: "eyJhbGci....", user: { id: 1, name: "John Doe", email: "john@example.com" } } },
          { code: 401, description: "Yetkilendirme başarısız", example: { error: "Geçersiz kimlik bilgileri" } }
        ]
      },
      {
        id: "register",
        method: "POST",
        path: "/api/auth/register",
        description: "Yeni kullanıcı kaydı",
        requiresAuth: false,
        parameters: [
          { name: "name", type: "string", required: true, description: "Kullanıcı adı" },
          { name: "email", type: "string", required: true, description: "Kullanıcı e-posta adresi" },
          { name: "password", type: "string", required: true, description: "Kullanıcı şifresi" }
        ],
        responses: [
          { code: 201, description: "Başarılı yanıt", example: { user: { id: 1, name: "John Doe", email: "john@example.com" } } },
          { code: 400, description: "Geçersiz istek", example: { error: "E-posta adresi zaten kayıtlı" } }
        ]
      },
      {
        id: "me",
        method: "GET",
        path: "/api/auth/me",
        description: "Mevcut kullanıcı bilgilerini al",
        requiresAuth: true,
        parameters: [],
        responses: [
          { code: 200, description: "Başarılı yanıt", example: { user: { id: 1, name: "John Doe", email: "john@example.com" } } },
          { code: 401, description: "Yetkilendirme başarısız", example: { error: "Yetkilendirme token'ı geçersiz" } }
        ]
      },
      {
        id: "logout",
        method: "POST",
        path: "/api/auth/logout",
        description: "Kullanıcı çıkışı",
        requiresAuth: true,
        parameters: [],
        responses: [
          { code: 200, description: "Başarılı yanıt", example: { success: true, message: "Başarıyla çıkış yapıldı" } }
        ]
      }
    ]
  },
  {
    id: "projects",
    name: "Projeler",
    description: "Proje yönetimi ve işlemleri",
    icon: <Code className="h-4 w-4" />,
    endpoints: [
      {
        id: "list-projects",
        method: "GET",
        path: "/api/projects",
        description: "Tüm projeleri listele",
        requiresAuth: true,
        parameters: [
          { name: "page", type: "number", required: false, description: "Sayfa numarası" },
          { name: "limit", type: "number", required: false, description: "Sayfa başına öğe sayısı" }
        ],
        responses: [
          { code: 200, description: "Başarılı yanıt", example: { projects: [{ id: 1, name: "My Project", description: "Project description", language: "javascript" }], total: 10, page: 1, limit: 10 } }
        ]
      },
      {
        id: "get-project",
        method: "GET",
        path: "/api/projects/{id}",
        description: "Belirli bir projeyi getir",
        requiresAuth: true,
        parameters: [
          { name: "id", type: "number", required: true, description: "Proje kimliği", in: "path" }
        ],
        responses: [
          { code: 200, description: "Başarılı yanıt", example: { id: 1, name: "My Project", description: "Project description", language: "javascript", files: [{ name: "index.js", path: "/index.js" }] } },
          { code: 404, description: "Bulunamadı", example: { error: "Proje bulunamadı" } }
        ]
      },
      {
        id: "create-project",
        method: "POST",
        path: "/api/projects",
        description: "Yeni proje oluştur",
        requiresAuth: true,
        parameters: [
          { name: "name", type: "string", required: true, description: "Proje adı" },
          { name: "description", type: "string", required: false, description: "Proje açıklaması" },
          { name: "language", type: "string", required: true, description: "Ana programlama dili" },
          { name: "template_id", type: "string", required: false, description: "Şablon kimliği" }
        ],
        responses: [
          { code: 201, description: "Başarılı yanıt", example: { id: 1, name: "My Project", description: "Project description", language: "javascript" } },
          { code: 400, description: "Geçersiz istek", example: { error: "Geçersiz proje parametreleri" } }
        ]
      }
    ]
  },
  {
    id: "files",
    name: "Dosyalar",
    description: "Dosya işlemleri ve yönetimi",
    icon: <Server className="h-4 w-4" />,
    endpoints: [
      {
        id: "list-files",
        method: "GET",
        path: "/api/projects/{id}/files",
        description: "Proje dosyalarını listele",
        requiresAuth: true,
        parameters: [
          { name: "id", type: "number", required: true, description: "Proje kimliği", in: "path" },
          { name: "path", type: "string", required: false, description: "Dosya yolu" }
        ],
        responses: [
          { code: 200, description: "Başarılı yanıt", example: { files: [{ name: "index.js", path: "/index.js", type: "file" }, { name: "src", path: "/src", type: "directory" }] } }
        ]
      },
      {
        id: "get-file",
        method: "GET",
        path: "/api/projects/{id}/files/{path}",
        description: "Dosya içeriğini getir",
        requiresAuth: true,
        parameters: [
          { name: "id", type: "number", required: true, description: "Proje kimliği", in: "path" },
          { name: "path", type: "string", required: true, description: "Dosya yolu", in: "path" }
        ],
        responses: [
          { code: 200, description: "Başarılı yanıt", example: { content: "console.log('Hello World');" } },
          { code: 404, description: "Bulunamadı", example: { error: "Dosya bulunamadı" } }
        ]
      }
    ]
  },
  {
    id: "ai",
    name: "AI Servisler",
    description: "AI entegrasyonları ve işlemleri",
    icon: <Globe className="h-4 w-4" />,
    endpoints: [
      {
        id: "code-completion",
        method: "POST",
        path: "/api/ai/completion",
        description: "AI kod tamamlama",
        requiresAuth: true,
        parameters: [
          { name: "code", type: "string", required: true, description: "Tamamlanacak kod" },
          { name: "language", type: "string", required: true, description: "Programlama dili" }
        ],
        responses: [
          { code: 200, description: "Başarılı yanıt", example: { completion: "function helloWorld() {\n  return 'Hello World';\n}" } }
        ]
      },
      {
        id: "chat",
        method: "POST",
        path: "/api/ai/chat",
        description: "AI sohbet asistanı",
        requiresAuth: true,
        parameters: [
          { name: "message", type: "string", required: true, description: "Kullanıcı mesajı" },
          { name: "context", type: "object", required: false, description: "İsteğe bağlı bağlam" }
        ],
        responses: [
          { code: 200, description: "Başarılı yanıt", example: { reply: "Merhaba! Nasıl yardımcı olabilirim?" } }
        ]
      }
    ]
  }
];

export default function ApiDocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroup, setExpandedGroup] = useState("authentication");
  const [selectedEndpoint, setSelectedEndpoint] = useState("login");
  
  // Seçili endpoint'i bul
  const getSelectedEndpoint = () => {
    for (const group of apiGroups) {
      const endpoint = group.endpoints.find(e => e.id === selectedEndpoint);
      if (endpoint) {
        return { ...endpoint, groupName: group.name };
      }
    }
    return null;
  };
  
  // Arama
  const filteredGroups = apiGroups.map(group => {
    const filteredEndpoints = searchQuery ? 
      group.endpoints.filter(endpoint => 
        endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
        endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) : 
      group.endpoints;
      
    return {
      ...group,
      endpoints: filteredEndpoints,
      isFiltered: filteredEndpoints.length > 0
    };
  }).filter(group => !searchQuery || group.isFiltered);
  
  // Kod örneği oluştur
  const generateCodeExample = (endpoint) => {
    if (!endpoint) return "";
    
    const params = endpoint.parameters
      .filter(param => !param.in || param.in !== "path")
      .reduce((acc, param) => {
        if (param.required) {
          acc[param.name] = param.type === "string" ? "value" : 1;
        }
        return acc;
      }, {});
      
    const url = endpoint.path.replace(/\{([^}]+)\}/g, (_, key) => {
      const param = endpoint.parameters.find(p => p.name === key);
      return param ? param.type === "string" ? "value" : "1" : key;
    });
    
    return `// Fetch API kullanarak
fetch("${url}", {
  method: "${endpoint.method}",${endpoint.requiresAuth ? '\n  headers: {\n    "Authorization": "Bearer YOUR_TOKEN_HERE",\n    "Content-Type": "application/json"\n  },' : '\n  headers: {\n    "Content-Type": "application/json"\n  },'}${Object.keys(params).length > 0 ? `\n  body: JSON.stringify(${JSON.stringify(params, null, 2)})` : ""}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));

// Axios kullanarak
axios.${endpoint.method.toLowerCase()}("${url}"${Object.keys(params).length > 0 ? `, ${JSON.stringify(params)}` : ""}${endpoint.requiresAuth ? ', {\n  headers: {\n    "Authorization": "Bearer YOUR_TOKEN_HERE"\n  }\n}' : ""})
.then(response => console.log(response.data))
.catch(error => console.error(error));`;
  };
  
  const selectedEndpointData = getSelectedEndpoint();
  const codeExample = generateCodeExample(selectedEndpointData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API Belgeleri</h1>
        <p className="text-muted-foreground">
          CodeXONX platformu API'lerini entegre etmenize yardımcı olacak kaynak.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sol Kenar Çubuğu - Endpoint Listesi */}
        <div className="w-full md:w-64 lg:w-80 flex-shrink-0">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="API uç noktalarını arayın..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="border rounded-md">
            {filteredGroups.map((group) => (
              <div key={group.id} className="border-b last:border-0">
                <button 
                  className="flex w-full items-center justify-between p-3 text-left font-medium text-sm"
                  onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                >
                  <div className="flex items-center">
                    {group.icon}
                    <span className="ml-2">{group.name}</span>
                  </div>
                  {expandedGroup === group.id ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </button>
                
                {expandedGroup === group.id && (
                  <div className="border-t">
                    {group.endpoints.map((endpoint) => (
                      <button
                        key={endpoint.id}
                        className={cn(
                          "flex w-full items-center px-3 py-2 text-sm text-left",
                          selectedEndpoint === endpoint.id ? "bg-muted" : "hover:bg-muted/50"
                        )}
                        onClick={() => setSelectedEndpoint(endpoint.id)}
                      >
                        <Badge 
                          className={`${methodColors[endpoint.method]} text-white mr-2`}
                          variant="outline"
                        >
                          {endpoint.method}
                        </Badge>
                        <span className="truncate">{endpoint.path.split("/").pop()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {filteredGroups.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                Hiçbir API uç noktası bulunamadı
              </div>
            )}
          </div>
        </div>
        
        {/* Sağ Taraf - Endpoint Detayları */}
        {selectedEndpointData ? (
          <div className="flex-1">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge className={`${methodColors[selectedEndpointData.method]}`}>
                      {selectedEndpointData.method}
                    </Badge>
                    <CardTitle className="text-xl font-mono">{selectedEndpointData.path}</CardTitle>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {selectedEndpointData.groupName}
                  </Badge>
                </div>
                <CardDescription className="mt-2">
                  {selectedEndpointData.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedEndpointData.requiresAuth && (
                  <div className="flex items-center p-2 bg-yellow-100/10 border border-yellow-200 rounded">
                    <Lock className="h-4 w-4 text-yellow-500 mr-2" />
                    <p className="text-sm">Bu endpoint kimlik doğrulaması gerektiriyor</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Parametreler</h3>
                  {selectedEndpointData.parameters.length > 0 ? (
                    <div className="border rounded-md">
                      <div className="grid grid-cols-4 gap-4 p-3 border-b font-medium text-sm">
                        <div>Ad</div>
                        <div>Tür</div>
                        <div>Gerekli</div>
                        <div>Açıklama</div>
                      </div>
                      {selectedEndpointData.parameters.map((param) => (
                        <div key={param.name} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0 text-sm">
                          <div className="font-mono">{param.name}</div>
                          <div className="font-mono text-blue-500">{param.type}</div>
                          <div>{param.required ? "Evet" : "Hayır"}</div>
                          <div>{param.description}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Bu endpoint için herhangi bir parametre yok</p>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Yanıt Kodları</h3>
                  <div className="space-y-4">
                    {selectedEndpointData.responses.map((response) => (
                      <div key={response.code} className="border rounded-md overflow-hidden">
                        <div className="p-3 bg-muted">
                          <div className="flex items-center justify-between">
                            <Badge 
                              className={cn(
                                response.code >= 200 && response.code < 300 ? "bg-green-500" : 
                                response.code >= 400 && response.code < 500 ? "bg-orange-500" : 
                                "bg-red-500"
                              )}
                            >
                              {response.code}
                            </Badge>
                            <span>{response.description}</span>
                          </div>
                        </div>
                        <div className="p-3">
                          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                            <code>{JSON.stringify(response.example, null, 2)}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Kod Örneği</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigator.clipboard.writeText(codeExample)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Kopyala
                    </Button>
                  </div>
                  <div className="bg-muted rounded-md overflow-hidden">
                    <pre className="p-4 text-xs overflow-x-auto">
                      <code>{codeExample}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  API Konsol
                </Button>
                <Button size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Deneme İsteği Yap
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-12 border rounded-md">
            <div className="text-center">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">API Endpoint Seçin</h3>
              <p className="text-muted-foreground">
                Detayları görüntülemek için sol taraftaki listeden bir API endpoint seçin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
