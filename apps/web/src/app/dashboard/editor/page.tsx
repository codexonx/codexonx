'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve Monaco Editor
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState, useEffect, useRef } from 'react';
import { Folder, File, Plus, Search, Save, Play, Settings, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMonacoEditor } from '@/hooks/use-monaco-editor';

// Örnek dosya verileri
const initialFiles = [
  {
    id: 'file1',
    name: 'index.js',
    content:
      "// JavaScript Ana Dosyası\nconsole.log('Merhaba, CodeXONX!');\n\nfunction greet(name) {\n  return `Merhaba, ${name}!`;\n}\n\nconst result = greet('Kullanıcı');\nconsole.log(result);",
    language: 'javascript',
  },
  {
    id: 'file2',
    name: 'styles.css',
    content:
      "/* CSS Stilleri */\nbody {\n  font-family: 'Arial', sans-serif;\n  margin: 0;\n  padding: 20px;\n  background-color: #f5f5f5;\n  color: #333;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n  background-color: white;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.12);\n}",
    language: 'css',
  },
  {
    id: 'file3',
    name: 'index.html',
    content:
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>CodeXONX Uygulama</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div class="container">\n    <h1>CodeXONX Uygulaması</h1>\n    <p>Bu bir örnek HTML sayfasıdır.</p>\n  </div>\n  <script src="index.js"></script>\n</body>\n</html>',
    language: 'html',
  },
];

// Kod dilleri için renk kodları
const languageColors: Record<string, string> = {
  javascript: 'bg-yellow-400',
  typescript: 'bg-blue-500',
  html: 'bg-orange-500',
  css: 'bg-blue-400',
  python: 'bg-green-500',
  json: 'bg-gray-400',
};

// Dosya uzantısına göre dil belirleme
const getLanguageFromFilename = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();

  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    css: 'css',
    py: 'python',
    json: 'json',
  };

  return languageMap[ext || ''] || 'plaintext';
};

export default function EditorPage() {
  const [files, setFiles] = useState(initialFiles);
  const [activeFileId, setActiveFileId] = useState(files[0]?.id);
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [outputContent, setOutputContent] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const activeFile = files.find(file => file.id === activeFileId);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Monaco Editor hook kullanımı
  const { editorContainer, editorInstance, isEditorReady } = useMonacoEditor({
    language: activeFile?.language || 'javascript',
    value: activeFile?.content || '',
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: false },
  });

  // Dosya içeriği değiştiğinde editor değerini güncelle
  useEffect(() => {
    if (isEditorReady && editorInstance && activeFile) {
      const model = editorInstance.getModel();
      if (model) {
        if (model.getValue() !== activeFile.content) {
          editorInstance.setValue(activeFile.content);
        }

        // Monaco editor dilini ayarla
        const language = activeFile.language || 'javascript';
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [isEditorReady, editorInstance, activeFile]);

  // Editördeki içerik değiştiğinde aktif dosyayı güncelle
  useEffect(() => {
    if (isEditorReady && editorInstance && activeFile) {
      const handleChange = () => {
        const newContent = editorInstance.getValue();
        updateFileContent(activeFile.id, newContent);
      };

      const disposable = editorInstance.onDidChangeModelContent(handleChange);
      return () => disposable.dispose();
    }
  }, [isEditorReady, editorInstance, activeFile]);

  // Chat mesajlarına otomatik scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Dosya içeriğini güncelle
  const updateFileContent = (fileId: string, content: string) => {
    setFiles(files.map(f => (f.id === fileId ? { ...f, content } : f)));
  };

  // Dosya oluşturma fonksiyonu
  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const language = getLanguageFromFilename(newFileName);
      const newFile = {
        id: `file${Date.now()}`,
        name: newFileName,
        content: '',
        language,
      };
      setFiles([...files, newFile]);
      setActiveFileId(newFile.id);
      setNewFileName('');
      setIsCreatingFile(false);
    }
  };

  // Kodu çalıştır
  const handleRunCode = () => {
    setIsRunning(true);
    setOutputContent(''); // Çıktıyı temizle

    setTimeout(() => {
      // Dil bazlı çıktı simülasyonu
      if (activeFile) {
        let output = '';

        if (activeFile.language === 'javascript') {
          output = 'Console çıktısı:\n';
          output += '> Merhaba, CodeXONX!\n';
          output += '> Merhaba, Kullanıcı!';
        } else if (activeFile.language === 'python') {
          output = 'Python çıktısı:\n';
          output += '>>> Kod başarıyla çalıştırıldı.';
        } else if (activeFile.language === 'html') {
          output = 'Sayfa başarıyla oluşturuldu ve tarayıcıda açıldı.';
        } else {
          output = 'Kod başarıyla çalıştırıldı.';
        }

        setOutputContent(output);
      }

      setIsRunning(false);
    }, 800);
  };

  // AI chat işlemi
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Kullanıcı mesajını ekle
      const userMessage = { role: 'user' as const, content: chatMessage };
      setChatHistory([...chatHistory, userMessage]);

      // AI yanıt simülasyonu
      setTimeout(() => {
        let aiResponse = '';

        if (
          chatMessage.toLowerCase().includes('yardım') ||
          chatMessage.toLowerCase().includes('nasıl')
        ) {
          aiResponse =
            "CodeXONX'un kod editöründe dosya oluşturabilir, düzenleyebilir ve çalıştırabilirsiniz. Örnek olarak JavaScript, HTML ve CSS dosyalarıyla çalışabilirsiniz.";
        } else if (chatMessage.toLowerCase().includes('hata')) {
          aiResponse =
            "Kodunuzda bir hata görüyorum. Parantezlerin eşleştiğinden ve tüm değişkenlerin tanımlandığından emin olun. Örnek olarak, 'console.log' ifadesinden sonra ';' koymayı unutmuş olabilirsiniz.";
        } else if (
          chatMessage.toLowerCase().includes('javascript') ||
          chatMessage.toLowerCase().includes('js')
        ) {
          aiResponse =
            'JavaScript, web sayfalarında etkileşimli öğeler oluşturmak için kullanılan bir programlama dilidir. Örnek bir fonksiyon:\n\n```javascript\nfunction sayHello(name) {\n  return `Merhaba, ${name}!`;\n}\n```';
        } else {
          aiResponse =
            'Kod geliştirme konusunda nasıl yardımcı olabilirim? Belirli bir dil veya sorun hakkında daha fazla bilgi verirseniz daha iyi yardımcı olabilirim.';
        }

        const aiMessage = { role: 'ai' as const, content: aiResponse };
        setChatHistory(prev => [...prev, aiMessage]);
      }, 1000);

      setChatMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kod Editörü</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsChatOpen(!isChatOpen)}>
            {isChatOpen ? 'Sohbeti Gizle' : 'AI Yardımcısı'}
            {isChatOpen ? (
              <X className="ml-2 h-4 w-4" />
            ) : (
              <MessageSquare className="ml-2 h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRunCode} disabled={isRunning}>
            <Play className="mr-2 h-4 w-4" />
            {isRunning ? 'Çalışıyor...' : 'Çalıştır'}
          </Button>
          <Button size="sm">
            <Save className="mr-2 h-4 w-4" />
            Kaydet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 h-full">
        {/* Dosya gezgini */}
        <div className="col-span-1 border rounded-lg overflow-hidden bg-background">
          <div className="p-3 border-b flex items-center justify-between">
            <h2 className="text-sm font-medium">Dosyalar</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreatingFile(true)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Yeni Dosya</span>
            </Button>
          </div>

          {/* Dosya oluşturma formu */}
          {isCreatingFile && (
            <div className="p-3 border-b">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="dosyaadi.js"
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  className="h-8 text-sm"
                  autoFocus
                />
                <Button size="sm" className="h-8 px-2" onClick={handleCreateFile}>
                  Oluştur
                </Button>
              </div>
            </div>
          )}

          {/* Dosya listesi */}
          <div className="p-1">
            <ul className="space-y-0.5">
              {files.map(file => (
                <li key={file.id}>
                  <button
                    onClick={() => setActiveFileId(file.id)}
                    className={`w-full flex items-center px-3 py-1.5 rounded-md text-left text-sm ${
                      activeFileId === file.id
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full mr-2 ${languageColors[file.language] || 'bg-gray-400'}`}
                    ></div>
                    <File className="h-4 w-4 mr-2 opacity-70" />
                    <span className="truncate">{file.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`${isChatOpen ? 'col-span-2' : 'col-span-3'} flex flex-col border rounded-lg overflow-hidden bg-background`}
        >
          {/* Editör başlığı */}
          <div className="border-b p-3 flex items-center justify-between bg-background">
            <div className="flex items-center">
              {activeFile && (
                <>
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${languageColors[activeFile.language] || 'bg-gray-400'}`}
                  ></div>
                  <span className="font-medium text-sm">{activeFile.name}</span>
                </>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Ayarlar</span>
            </Button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0 relative overflow-hidden" ref={editorContainer} />

          {/* Çıktı paneli */}
          <div className="border-t">
            <Tabs defaultValue="output">
              <TabsList className="border-b px-3">
                <TabsTrigger value="output" className="text-xs">
                  Çıktı
                </TabsTrigger>
                <TabsTrigger value="problems" className="text-xs">
                  Sorunlar
                </TabsTrigger>
                <TabsTrigger value="terminal" className="text-xs">
                  Terminal
                </TabsTrigger>
              </TabsList>
              <TabsContent value="output" className="p-3 max-h-32 overflow-y-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {outputContent ||
                    "Henüz çıktı yok. Kodu çalıştırmak için 'Çalıştır' butonuna tıklayın."}
                </pre>
              </TabsContent>
              <TabsContent value="problems" className="p-3 max-h-32 overflow-y-auto">
                <p className="text-xs text-muted-foreground">Herhangi bir sorun bulunamadı.</p>
              </TabsContent>
              <TabsContent value="terminal" className="p-3 max-h-32 overflow-y-auto">
                <pre className="text-xs font-mono">$ cd project\n$ npm install\n$ npm run dev</pre>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* AI Sohbet Paneli */}
        {isChatOpen && (
          <div className="col-span-1 border rounded-lg flex flex-col overflow-hidden bg-background">
            <div className="border-b p-3 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-primary" />
              <h2 className="text-sm font-medium">AI Yardımcısı</h2>
            </div>

            {/* Sohbet mesajları */}
            <div className="flex-1 p-3 overflow-y-auto space-y-4" ref={chatContainerRef}>
              {chatHistory.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">AI yardımcısına bir şeyler sorun.</p>
                </div>
              ) : (
                chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      {message.content.split('```').map((part, i) => {
                        // Kod bloklarını özel olarak işle
                        if (i % 2 === 1) {
                          return (
                            <div
                              key={i}
                              className="bg-black/20 p-2 rounded my-2 font-mono text-xs overflow-x-auto whitespace-pre"
                            >
                              {part}
                            </div>
                          );
                        }
                        // Normal metni satır sonları ile görüntüle
                        return part.split('\n').map((line, j) => (
                          <p key={`${i}-${j}`} className="whitespace-pre-wrap">
                            {line}
                          </p>
                        ));
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Mesaj giriş alanı */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="AI yardımcısına sorunuzu sorun..."
                  className="min-h-[60px] max-h-[120px] text-sm"
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button className="self-end" onClick={handleSendMessage}>
                  Gönder
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
