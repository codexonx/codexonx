'use client';

import React, { useState, useRef, useEffect } from 'react';
import MonacoEditor, { setupMonaco } from '@/app/ai-code/components/monaco-editor';
import { AIService } from '@/services/ai-service';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Terminal,
  Code,
  Save,
  PlayCircle,
  MessageSquare,
  FileText,
  Check,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Monaco editörü hazırlığı
if (typeof window !== 'undefined') {
  setupMonaco();
}

interface AICodeEditorProps {
  initialCode?: string;
  language?: string;
  theme?: 'vs-dark' | 'vs-light';
  fileName?: string;
  onSave?: (code: string) => void;
  onRun?: (code: string) => void;
  readOnly?: boolean;
  height?: string;
}

const aiService = new AIService();

export function AICodeEditor({
  initialCode = '',
  language = 'javascript',
  theme = 'vs-dark',
  fileName = 'untitled.js',
  onSave,
  onRun,
  readOnly = false,
  height = '70vh',
}: AICodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Editör referansı
  const editorRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Editör hazır olduğunda
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    setEditorReady(true);

    // Kod inceleme ve öneriler
    setTimeout(() => {
      requestCodeSuggestions();
    }, 1000);
  };

  // Kod değişikliği
  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  // Kodu çalıştırma
  const runCode = async () => {
    setIsRunning(true);
    setActiveTab('output');
    setOutput('Kod çalıştırılıyor...');

    try {
      // Basit JavaScript runtime simülasyonu
      // Gerçek uygulamada sunucu tarafında güvenli bir ortamda çalıştırılmalı
      if (language === 'javascript') {
        const logs: string[] = [];
        const originalConsoleLog = console.log;

        console.log = (...args) => {
          logs.push(args.join(' '));
          originalConsoleLog(...args);
        };

        try {
          // NOT: Eval güvenli değil, gerçek uygulamada sunucu tarafında izole bir ortamda çalıştırın
          const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
          await new AsyncFunction(code)();
        } catch (error) {
          logs.push(`Hata: ${error.message}`);
        }

        console.log = originalConsoleLog;
        setOutput(logs.join('\n'));
      } else {
        setOutput(`${language} kodu için çalıştırma simülasyonu henüz eklenmedi.`);
      }
    } catch (error) {
      setOutput(`Çalıştırma hatası: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Kodu kaydetme
  const saveCode = () => {
    if (onSave) {
      onSave(code);
    }
  };

  // AI yardımı isteme
  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // AI yanıtını al
      const response = await aiService.sendChatMessage([...messages, userMessage], {
        context: {
          code,
          language,
          fileName,
        },
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Kod önerileri
  const requestCodeSuggestions = async () => {
    try {
      const response = await aiService.improveCode(code, language);

      const suggestions = [
        'Değişken isimlerini daha açıklayıcı hale getirin.',
        'Tekrar eden kodları fonksiyonlara çıkarın.',
        'Koşullu ifadeleri basitleştirin.',
        'Performans için döngüleri optimize edin.',
        'Hata yönetimi ekleyin.',
      ];

      setSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Kod önerileri alınamadı:', error);
    }
  };

  // Mesajlar güncellendiğinde otomatik scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden bg-background">
      {/* Editör başlığı */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/40">
        <div className="flex items-center space-x-2">
          <Code className="h-4 w-4 text-foreground/70" />
          <span className="text-sm font-medium">{fileName}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button size="sm" variant="outline" onClick={saveCode} title="Kaydet">
            <Save className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Kaydet</span>
          </Button>
          <Button size="sm" onClick={runCode} title="Çalıştır">
            <PlayCircle className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Çalıştır</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setActiveTab(activeTab === 'chat' ? 'editor' : 'chat')}
            title="AI Asistanı"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Ana içerik */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editör ve Terminal Sekmeleri */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="px-4 h-10 bg-muted/40 border-b">
            <TabsTrigger value="editor" className="data-[state=active]:bg-background">
              <Code className="h-4 w-4 mr-1" />
              <span>Editör</span>
            </TabsTrigger>
            <TabsTrigger value="output" className="data-[state=active]:bg-background">
              <Terminal className="h-4 w-4 mr-1" />
              <span>Çıktı</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 p-0 overflow-hidden">
            <div className="h-full relative">
              {!editorReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
              <MonacoEditor
                value={code}
                language={language}
                theme={theme}
                onChange={handleCodeChange}
                onMount={handleEditorDidMount}
                height="100%"
                width="100%"
                options={{
                  readOnly,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                }}
              />

              {/* Kod önerileri */}
              {showSuggestions && (
                <div className="absolute bottom-4 right-4 max-w-xs bg-background border shadow-lg rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium flex items-center">
                      <FileText className="h-3.5 w-3.5 mr-1 text-primary" />
                      Kod İyileştirme Önerileri
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setShowSuggestions(false)}
                    >
                      &times;
                    </Button>
                  </div>
                  <ul className="space-y-1.5">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-green-500 flex-shrink-0" />
                        <span className="text-xs">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    variant="link"
                    className="text-xs mt-2 p-0"
                    onClick={requestCodeSuggestions}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Yeni öneriler al
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="output" className="flex-1 p-0 overflow-hidden">
            <div className="h-full p-3 font-mono text-sm bg-black text-green-400 overflow-auto">
              {isRunning ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Çalıştırılıyor...</span>
                </div>
              ) : (
                output || 'Kodu çalıştırmak için "Çalıştır" düğmesine tıklayın.'
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 p-0 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-3">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">AI asistanına bir soru sorun veya yardım isteyin.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        'relative px-3 py-2 rounded-lg max-w-[80%]',
                        msg.role === 'user'
                          ? 'ml-auto bg-primary text-primary-foreground'
                          : 'mr-auto bg-muted'
                      )}
                    >
                      <div
                        className="prose prose-sm dark:prose-invert"
                        dangerouslySetInnerHTML={{
                          __html: formatMessageContent(msg.content),
                        }}
                      />
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="AI asistana bir soru sorun..."
                  className="flex-1 bg-background border rounded-md px-3 py-2 text-sm"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading} size="sm">
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Markdown içeriğini HTML olarak işle
function formatMessageContent(content: string): string {
  // Kod bloklarını sözdizimi vurgulamasıyla işle
  let formatted = content.replace(/```(.*?)\n([\s\S]*?)```/g, (_, language, code) => {
    return `<pre class="bg-muted p-2 rounded my-2 overflow-x-auto"><code class="language-${language || 'text'}">${escapeHtml(code)}</code></pre>`;
  });

  // Satır sonlarını <br> etiketlerine dönüştür
  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
}

// HTML karakterlerini escape et
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
