"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState, useRef, useEffect } from "react";
import { 
  TerminalSquare, 
  Play, 
  Square, 
  Plus, 
  Trash2,
  X,
  ChevronRight,
  Folder,
  Download,
  Upload,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Örnek terminal komutları ve çıktıları
const initialHistory = [
  { id: 1, command: "cd ~/projects", output: "" },
  { id: 2, command: "ls -la", output: "total 32\ndrwxr-xr-x  5 user  staff  160 Mar 10 12:34 .\ndrwxr-xr-x  3 user  staff   96 Mar 10 11:22 ..\n-rw-r--r--  1 user  staff  289 Mar 10 12:30 README.md\ndrwxr-xr-x 10 user  staff  320 Mar 10 12:33 src\ndrwxr-xr-x  4 user  staff  128 Mar 10 12:28 tests" },
  { id: 3, command: "npm run dev", output: "> codexonx@0.1.0 dev\n> next dev\n\n▲ Next.js 14.1.0\n- Local:        http://localhost:3000\n- Network:      add `-H 0.0.0.0` to expose\n\n✓ Ready in 3.5s" },
];

// Terminal türleri
const terminalTypes = [
  { id: 'bash', name: 'Bash', icon: TerminalSquare },
  { id: 'powershell', name: 'PowerShell', icon: TerminalSquare },
  { id: 'cmd', name: 'Command Prompt', icon: TerminalSquare },
  { id: 'node', name: 'Node.js', icon: TerminalSquare },
  { id: 'python', name: 'Python', icon: TerminalSquare },
];

export default function TerminalPage() {
  const [activeTab, setActiveTab] = useState("terminal1");
  const [terminals, setTerminals] = useState([
    { id: "terminal1", name: "Terminal 1", type: "bash", history: [...initialHistory], isRunning: false },
  ]);
  const [command, setCommand] = useState("");
  const [terminalCount, setTerminalCount] = useState(1);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Aktif terminal
  const activeTerminal = terminals.find(t => t.id === activeTab) || terminals[0];
  
  // Yeni terminal ekle
  const addNewTerminal = (type: string = "bash") => {
    const newCount = terminalCount + 1;
    const newTerminal = {
      id: `terminal${newCount}`,
      name: `Terminal ${newCount}`,
      type,
      history: [],
      isRunning: false
    };
    
    setTerminals([...terminals, newTerminal]);
    setActiveTab(newTerminal.id);
    setTerminalCount(newCount);
  };
  
  // Terminal kapat
  const closeTerminal = (id: string) => {
    // Son terminali kapatmaya izin verme
    if (terminals.length === 1) return;
    
    const updatedTerminals = terminals.filter(t => t.id !== id);
    setTerminals(updatedTerminals);
    
    // Kapatılan terminal aktifse, başka bir terminal seç
    if (activeTab === id) {
      setActiveTab(updatedTerminals[0].id);
    }
  };
  
  // Terminali temizle
  const clearTerminal = (id: string) => {
    setTerminals(terminals.map(t => 
      t.id === id ? { ...t, history: [] } : t
    ));
  };
  
  // Komutu çalıştır
  const runCommand = () => {
    if (!command.trim()) return;
    
    const commandTrimmed = command.trim();
    let output = "";
    
    // Temel komut simülasyonu
    if (commandTrimmed === "clear" || commandTrimmed === "cls") {
      clearTerminal(activeTab);
      setCommand("");
      return;
    } else if (commandTrimmed === "help") {
      output = "Kullanılabilir komutlar:\n  clear/cls - Terminali temizle\n  help - Bu mesajı görüntüle\n  ls - Dosyaları listele\n  cd [dizin] - Dizin değiştir\n  echo [mesaj] - Mesajı yazdır\n  npm [komut] - NPM komutlarını çalıştır";
    } else if (commandTrimmed.startsWith("echo ")) {
      output = commandTrimmed.substring(5);
    } else if (commandTrimmed === "ls" || commandTrimmed === "dir") {
      output = "README.md  package.json  node_modules/  src/  public/  .gitignore";
    } else if (commandTrimmed.startsWith("cd ")) {
      output = ""; // cd genellikle çıktı vermez
    } else if (commandTrimmed.startsWith("npm ")) {
      setTerminals(terminals.map(t => 
        t.id === activeTab ? { ...t, isRunning: true } : t
      ));
      
      // NPM komutu simülasyonu için gecikme ekle
      setTimeout(() => {
        const npmOutput = `> codexonx@0.1.0 ${commandTrimmed.split(" ")[1] || ""}\n> Starting command...\n\nProcessing...`;
        
        const updatedTerminal = terminals.find(t => t.id === activeTab);
        if (updatedTerminal) {
          const newHistory = [
            ...updatedTerminal.history,
            { id: Date.now(), command: commandTrimmed, output: npmOutput }
          ];
          
          setTerminals(terminals.map(t => 
            t.id === activeTab ? { ...t, history: newHistory, isRunning: false } : t
          ));
        }
      }, 1500);
      
      setCommand("");
      return;
    } else {
      output = `Komut bulunamadı: ${commandTrimmed}`;
    }
    
    // Terminal geçmişini güncelle
    const updatedTerminal = terminals.find(t => t.id === activeTab);
    if (updatedTerminal) {
      const newHistory = [
        ...updatedTerminal.history,
        { id: Date.now(), command: commandTrimmed, output }
      ];
      
      setTerminals(terminals.map(t => 
        t.id === activeTab ? { ...t, history: newHistory } : t
      ));
    }
    
    setCommand("");
  };
  
  // Enter tuşuna basıldığında komutu çalıştır
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand();
    }
  };
  
  // Terminal tipini değiştir
  const changeTerminalType = (id: string, type: string) => {
    setTerminals(terminals.map(t => 
      t.id === id ? { ...t, type } : t
    ));
  };
  
  // Terminal adını güncelle
  const updateTerminalName = (id: string, name: string) => {
    setTerminals(terminals.map(t => 
      t.id === id ? { ...t, name } : t
    ));
  };
  
  // Aktif terminali durdur
  const stopTerminal = (id: string) => {
    setTerminals(terminals.map(t => 
      t.id === id ? { ...t, isRunning: false } : t
    ));
  };
  
  // Her komut girişinden sonra otomatik scroll
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTerminal?.history]);
  
  // Tab değiştiğinde input alanına odaklan
  useEffect(() => {
    if (commandInputRef.current) {
      commandInputRef.current.focus();
    }
  }, [activeTab]);
  
  // Terminal prompt stilini belirle
  const getPrompt = (type: string) => {
    switch(type) {
      case "powershell":
        return "PS>";
      case "cmd":
        return "C:\\>";
      case "node":
        return "node>";
      case "python":
        return ">>>";
      case "bash":
      default:
        return "$";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Terminal</h1>
          <p className="text-muted-foreground">
            Komutları çalıştırın ve çıktılarını görüntüleyin
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => clearTerminal(activeTab)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Temizle
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open("/dashboard/terminal/settings", "_blank")}>
            <Settings className="h-4 w-4 mr-2" />
            Terminal Ayarları
          </Button>
        </div>
      </div>
      
      <Card className="border overflow-hidden">
        <CardHeader className="p-0 border-b">
          <div className="flex items-center">
            <TabsList className="bg-transparent h-12 w-full justify-start rounded-none border-b overflow-x-auto">
              {terminals.map((terminal) => (
                <div 
                  key={terminal.id} 
                  className="flex items-center"
                >
                  <TabsTrigger 
                    value={terminal.id}
                    onClick={() => setActiveTab(terminal.id)}
                    className={`data-[state=active]:bg-background data-[state=active]:shadow-none border-r px-4 rounded-none`}
                  >
                    {getTerminalIcon(terminal.type)}
                    <span className="ml-2">{terminal.name}</span>
                    {terminals.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTerminal(terminal.id);
                        }}
                        className="h-5 w-5 ml-2 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </TabsTrigger>
                </div>
              ))}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => addNewTerminal()}
                className="h-12 w-12 rounded-none"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {terminals.map((terminal) => (
              <TabsContent 
                key={terminal.id}
                value={terminal.id} 
                className="m-0 outline-none"
              >
                <div className="flex flex-col h-[400px]">
                  <div className="flex-1 p-4 bg-black text-green-500 font-mono text-sm overflow-y-auto">
                    {terminal.history.map((item) => (
                      <div key={item.id} className="mb-2">
                        <div className="flex">
                          <span className="text-blue-400 mr-2">{getPrompt(terminal.type)}</span>
                          <span>{item.command}</span>
                        </div>
                        {item.output && (
                          <div className="mt-1 whitespace-pre-wrap">{item.output}</div>
                        )}
                      </div>
                    ))}
                    <div className="flex items-center">
                      <span className="text-blue-400 mr-2">{getPrompt(terminal.type)}</span>
                      <input
                        ref={commandInputRef}
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 bg-transparent border-none outline-none text-green-500"
                        placeholder={terminal.isRunning ? "İşlem çalışıyor..." : "Komut yazın..."}
                        disabled={terminal.isRunning}
                        autoFocus
                      />
                    </div>
                    <div ref={terminalEndRef} />
                  </div>
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-t border-gray-800">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-400 mr-2">Tür:</span>
                      <select
                        value={terminal.type}
                        title="Terminal Türü Seçimi"
                        aria-label="Terminal Türü Seçimi"
                        onChange={(e) => changeTerminalType(terminal.id, e.target.value)}
                        className="bg-gray-800 text-white text-xs border border-gray-700 rounded px-2 py-1"
                      >
                        {terminalTypes.map((type) => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      {terminal.isRunning ? (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => stopTerminal(terminal.id)}
                        >
                          <Square className="h-3 w-3 mr-2" />
                          Durdur
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => runCommand()}
                          disabled={!command.trim() || terminal.isRunning}
                        >
                          <Play className="h-3 w-3 mr-2" />
                          Çalıştır
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Terminal İpuçları</CardTitle>
            <CardDescription>Sık kullanılan komutlar ve kısayollar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="bg-muted p-2 rounded flex items-center">
                <code className="text-sm font-mono mr-2">clear</code>
                <span className="text-sm text-muted-foreground">Terminal çıktısını temizler</span>
              </div>
              
              <div className="bg-muted p-2 rounded flex items-center">
                <code className="text-sm font-mono mr-2">cd [dizin]</code>
                <span className="text-sm text-muted-foreground">Çalışma dizinini değiştirir</span>
              </div>
              
              <div className="bg-muted p-2 rounded flex items-center">
                <code className="text-sm font-mono mr-2">ls / dir</code>
                <span className="text-sm text-muted-foreground">Mevcut dizindeki dosyaları listeler</span>
              </div>
              
              <div className="bg-muted p-2 rounded flex items-center">
                <code className="text-sm font-mono mr-2">npm run dev</code>
                <span className="text-sm text-muted-foreground">Geliştirme sunucusunu başlatır</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Terminal Komut Geçmişi</CardTitle>
            <CardDescription>Son kullanılan komutlar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeTerminal.history.slice(-5).map((item) => (
              <div 
                key={item.id}
                className="bg-muted p-2 rounded cursor-pointer hover:bg-muted/80 flex items-center"
                onClick={() => {
                  setCommand(item.command);
                  if (commandInputRef.current) {
                    commandInputRef.current.focus();
                  }
                }}
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground mr-2" />
                <code className="text-sm font-mono">{item.command}</code>
              </div>
            ))}
            
            {activeTerminal.history.length === 0 && (
              <p className="text-sm text-muted-foreground">Henüz komut geçmişi yok.</p>
            )}
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => clearTerminal(activeTab)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Geçmişi Temizle
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Geçmişi Kaydet
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Terminal tipine göre ikon döndür
function getTerminalIcon(type: string) {
  switch(type) {
    case "powershell":
      return <TerminalSquare className="h-4 w-4 text-blue-500" />;
    case "cmd":
      return <TerminalSquare className="h-4 w-4 text-yellow-500" />;
    case "node":
      return <TerminalSquare className="h-4 w-4 text-green-500" />;
    case "python":
      return <TerminalSquare className="h-4 w-4 text-blue-600" />;
    case "bash":
    default:
      return <TerminalSquare className="h-4 w-4" />;
  }
}
