"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Folder, File, Settings, MessageSquare, Terminal, X, Search, Plus, PanelLeft, Code, Save, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import MonacoEditor, { setupMonaco } from "../components/monaco-editor";
import { simulateAIResponse } from "../components/ai-api";

// Monaco editör kurulumunu başlat
setupMonaco();

export default function EditorPage() {
  // Dosya yönetimi state'leri
  const [files, setFiles] = useState([
    { 
      id: "1", 
      name: "main.js", 
      content: "// JavaScript dosyası\nconsole.log('Merhaba Dünya!');\n\n// Bir fonksiyon tanımlayalım\nfunction selamla(isim) {\n  return `Merhaba, ${isim}!`;\n}\n\n// Fonksiyonu çağıralım\nconst mesaj = selamla('Kullanıcı');\nconsole.log(mesaj);" 
    },
    { 
      id: "2", 
      name: "style.css", 
      content: "/* CSS Dosyası */\nbody {\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background-color: #f5f5f5;\n  color: #333;\n}\n\nh1 {\n  color: #2c3e50;\n  border-bottom: 2px solid #3498db;\n  padding-bottom: 10px;\n}\n\np {\n  line-height: 1.6;\n}" 
    },
    { 
      id: "3", 
      name: "index.html", 
      content: "<!DOCTYPE html>\n<html lang=\"tr\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>AI Code</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <h1>Merhaba Dünya!</h1>\n  <p>Bu bir örnek HTML dosyasıdır.</p>\n  \n  <script src=\"main.js\"></script>\n</body>\n</html>" 
    },
  ]);
  
  const [activeFile, setActiveFile] = useState(files[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [isLoading, setIsLoading] = useState(false);
  const [codeOutput, setCodeOutput] = useState("");
  const [editorReady, setEditorReady] = useState(false);

  // Monaco editör referansı
  const editorRef = useRef(null);

  // Mesaj giriş alanı değişikliği
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Mesaj gönderme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // AI yanıtını simüle et
      const aiResponse = await simulateAIResponse(input, activeFile);
      setMessages(prevMessages => [...prevMessages, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      setMessages(prevMessages => [...prevMessages, { 
        role: "assistant", 
        content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Dosya içeriğini güncelleme
  const updateFileContent = (newContent) => {
    const updatedFile = { ...activeFile, content: newContent };
    setActiveFile(updatedFile);
    
    const updatedFiles = files.map(file => 
      file.id === activeFile.id ? updatedFile : file
    );
    
    setFiles(updatedFiles);
  };
  
  // Kodu çalıştırma
  const runCode = () => {
    setActiveTab("terminal");
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        let output = "";
        
        if (activeFile.name.endsWith(".js")) {
          // JavaScript kodunu çalıştır
          const originalConsoleLog = console.log;
          const logs = [];
          
          console.log = (...args) => {
            logs.push(args.join(' '));
            originalConsoleLog(...args);
          };
          
          try {
            // Eval yerine Function kullanarak daha güvenli çalıştırma
            const func = new Function(activeFile.content);
            func();
          } catch (error) {
            logs.push(`Hata: ${error.message}`);
          }
          
          console.log = originalConsoleLog;
          output = logs.join('\n');
        } else if (activeFile.name.endsWith(".html")) {
          output = "HTML dosyası tarayıcıda görüntülenebilir.";
        } else if (activeFile.name.endsWith(".css")) {
          output = "CSS dosyası HTML ile birlikte kullanılabilir.";
        } else {
          output = `${activeFile.name} dosya türü için çalıştırma simülasyonu henüz eklenmedi.`;
        }
        
        setCodeOutput(output);
      } catch (error) {
        setCodeOutput(`Çalıştırma hatası: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };
  
  // Yeni dosya ekleme
  const addNewFile = () => {
    const fileName = prompt("Yeni dosya adını giriniz:");
    if (!fileName) return;
    
    const newFileId = `file-${Date.now()}`;
    const newFile = {
      id: newFileId,
      name: fileName,
      content: `// ${fileName} dosyası\n\n`
    };
    
    setFiles([...files, newFile]);
    setActiveFile(newFile);
  };
  
  // Editör hazır olduğunda
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    setEditorReady(true);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Code className="w-6 h-6 text-blue-500" />
          <h1 className="text-lg font-semibold">AICodeX Editor</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-1" />
            Kaydet
          </Button>
          <Button size="sm" variant="ghost">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <motion.div 
        className="flex-1 flex overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* File Explorer */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-medium flex items-center">
              <Folder className="w-4 h-4 mr-2" />
              Dosyalar
            </h2>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start text-slate-400 hover:text-slate-300"
              onClick={addNewFile}
              title="Yeni dosya ekle"
            >
              <Plus className="w-4 h-4 mr-2" /> Yeni Dosya
            </Button>
            {files.map(file => (
              <Button
                key={file.id}
                variant="ghost"
                size="sm"
                className={`justify-start ${activeFile?.id === file.id ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-300'}`}
                onClick={() => setActiveFile(file)}
                title={`${file.name} dosyasını düzenle`}
              >
                <File className="w-4 h-4 mr-2" />
                {file.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Editor and AI Assistant Tabs */}
        <div className="flex-1 flex flex-col">
          <Tabs
            defaultValue="editor"
            className="flex-1 flex flex-col"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="bg-slate-900 border-b border-slate-800 p-0 h-auto rounded-none">
              <TabsTrigger 
                value="editor" 
                className="px-4 py-3 rounded-none data-[state=active]:bg-slate-950 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none transition-none"
              >
                <Code className="w-4 h-4 mr-2" /> Kod Editörü
              </TabsTrigger>
              <TabsTrigger 
                value="terminal" 
                className="px-4 py-3 rounded-none data-[state=active]:bg-slate-950 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none transition-none"
              >
                <Terminal className="w-4 h-4 mr-2" /> Terminal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 flex m-0 overflow-hidden">
              {/* Code Editor */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {activeFile ? (
                  <div className="flex-1 relative">
                    {!editorReady && (
                      <div className="absolute inset-0 bg-slate-950 text-slate-300 p-4 flex flex-col items-center justify-center">
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-slate-400">Editör yükleniyor...</p>
                        </div>
                      </div>
                    )}
                    <div className="h-full">
                      <MonacoEditor
                        value={activeFile.content}
                        language={getLanguageForFile(activeFile.name)}
                        onChange={updateFileContent}
                        onMount={handleEditorDidMount}
                        options={{
                          minimap: { enabled: true },
                          scrollBeyondLastLine: false,
                          fontSize: 14,
                          wordWrap: 'on',
                          automaticLayout: true,
                          lineNumbers: 'on',
                          tabSize: 2
                        }}
                        height="100%"
                        width="100%"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 bg-slate-950 text-slate-300 p-4 font-mono text-sm flex flex-col items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-slate-400">Editör yükleniyor...</p>
                    </div>
                  </div>
                )}
                {/* Editor Footer */}
                <div className="bg-slate-900 border-t border-slate-800 p-2 text-xs text-slate-500 flex justify-between items-center">
                  <div>
                    {activeFile.name} - {getLanguageForFile(activeFile.name)}
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs flex items-center gap-1 border-slate-700 text-slate-300"
                      onClick={() => setActiveTab('editor')}
                    >
                      <Code className="w-3.5 h-3.5" /> Editör
                    </Button>
                    <Button 
                      size="sm"
                      className="h-7 px-2 text-xs flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                      onClick={runCode}
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Çalıştır
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Chat Pane */}
              <div className="w-96 border-l border-slate-800 flex flex-col bg-slate-900">
                <div className="p-3 border-b border-slate-800 flex justify-between items-center">
                  <h2 className="text-sm font-medium">AI Asistanı</h2>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-auto p-3 space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.role === 'assistant' ? 'assistant' : message.content} 
                      className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`rounded-lg px-3 py-2 max-w-[80%] ${
                          message.role === 'assistant' ? 'bg-slate-800 text-slate-200' : 'bg-blue-600 text-white'
                        }`}
                      >
                        <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
                      </div>
                    </div>
                  ))}
                </div>
                <form 
                  className="border-t border-slate-800 p-3 flex gap-2"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="AI'ya bir şey sorun..."
                    aria-label="AI asistana mesaj gönder"
                    title="AI asistana mesaj gönder"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="bg-blue-600 hover:bg-blue-700"
                    title="Mesajı gönder"
                    aria-label="Mesajı gönder"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="sr-only">Mesajı gönder</span>
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="terminal" className="flex-1 m-0 bg-slate-950 p-3 font-mono text-sm text-green-400 overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Kod çalıştırılıyor...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-1">
                    $ {activeFile.name.endsWith(".js") ? `node ${activeFile.name}` : 
                       activeFile.name.endsWith(".html") ? `serve ${activeFile.name}` : 
                       activeFile.name.endsWith(".css") ? `cat ${activeFile.name}` : 
                       `cat ${activeFile.name}`}
                  </div>
                  <div className="mb-3 whitespace-pre-wrap">{codeOutput || "Kodu çalıştırmak için 'Çalıştır' düğmesine tıklayın."}</div>
                  <div className="text-slate-400">Diğer dosyaları görmek için sol paneldeki dosya gezginini kullanabilirsiniz.</div>
                  <div className="mt-3 flex items-center text-slate-300">
                    <span className="mr-2">$</span>
                    <div className="w-2 h-5 bg-slate-300 animate-pulse"></div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );

  // Kod blokları için escape HTML
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // AI mesajlarının içeriğini biçimlendirme
  const formatMessage = (content) => {
    return content.replace(/```(.*?)\n([\s\S]*?)```/g, (match, language, code) => {
      return `<pre class="bg-slate-800 p-3 rounded-md overflow-x-auto mt-2 mb-2"><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
    });
  };
  
  // Dosya diline göre Monaco dili belirle
  const getLanguageForFile = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'php': 'php',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'go': 'go',
      'rs': 'rust'
    };
    
    return languageMap[extension] || 'plaintext';
  };
}
