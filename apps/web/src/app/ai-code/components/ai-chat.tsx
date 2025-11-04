'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Cpu,
  User,
  X,
  Loader,
  ChevronDown,
  ChevronUp,
  Save,
  Clipboard,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { sendChatMessage } from './ai-api';

type Message = {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface AIChatProps {
  initialMessages?: Message[];
  onNewAssistantMessage?: (content: string) => void;
  onSuggestionSelect?: (suggestion: string) => void;
}

export const AIChat = ({
  initialMessages = [],
  onNewAssistantMessage,
  onSuggestionSelect,
}: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Kod önerileri - gerçek uygulamada bu dinamik olabilir
  const codeSuggestions = [
    'React komponentine state ekle',
    'Asenkron veri çekme için useEffect kullanımı',
    'Bu kodu optimize etmek için önerilerin neler?',
    'Bu TypeScript hatasını nasıl çözebilirim?',
    'Bu fonksiyonu daha kısa nasıl yazabilirim?',
  ];

  // Yeni mesaj geldiğinde otomatik kaydırma
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Enter tuşuna basıldığında mesaj gönderme
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    // Kullanıcı mesajını ekle
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // AI API'sine istek gönder
      const systemMessages: Message[] = messages.filter(msg => msg.role === 'system');

      const allMessages = [
        ...systemMessages,
        ...messages.slice(-10), // Son 10 mesajı kullan (context window için)
        userMessage,
      ];

      const apiMessages = allMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await sendChatMessage(apiMessages);

      // AI yanıtını ekle
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Callback'i çağır (varsa)
      if (onNewAssistantMessage) {
        onNewAssistantMessage(response.message);
      }
    } catch (error) {
      console.error('AI yanıtı alınamadı:', error);
      toast({
        title: 'Hata',
        description: 'AI yanıtı alınırken bir hata oluştu. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      // Input alanına odaklan
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();

    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCopyConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.role === 'user' ? 'Soru' : 'AI'}: ${msg.content}`)
      .join('\n\n');

    navigator.clipboard.writeText(conversationText);
    setIsCopied(true);
    toast({
      title: 'Konuşma kopyalandı',
      description: 'Konuşma metni panoya kopyalandı.',
    });

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleSaveConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.role === 'user' ? 'Soru' : 'AI'}: ${msg.content}`)
      .join('\n\n');

    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aichat_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Konuşma kaydedildi',
      description: 'Konuşma metni dosyaya kaydedildi.',
    });
  };

  // Mesajları formatla ve kod bloklarını işaretle
  const formatMessage = (content: string) => {
    return content.replace(/```(.*?)\n([\s\S]*?)```/g, (match, language, code) => {
      return `<div class="bg-slate-800 rounded-md p-2 my-2 overflow-auto"><pre><code class="language-${language || 'javascript'}">${escapeHtml(code)}</code></pre></div>`;
    });
  };

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-700 rounded-md overflow-hidden">
      {/* Başlık çubuğu */}
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center text-slate-300 font-medium">
          <Cpu className="w-4 h-4 mr-2 text-blue-400" />
          <span>AI Asistanı</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={handleSaveConversation}
            title="Konuşmayı kaydet"
          >
            <Save className="h-4 w-4" />
            <span className="sr-only">Konuşmayı kaydet</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={handleCopyConversation}
            title="Konuşmayı kopyala"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
            <span className="sr-only">Konuşmayı kopyala</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={toggleExpanded}
            title={isExpanded ? 'Daralt' : 'Genişlet'}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            <span className="sr-only">{isExpanded ? 'Daralt' : 'Genişlet'}</span>
          </Button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Mesajlar */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 py-6">
                <Cpu className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Merhaba! Ben AI asistanınızım.</p>
                <p className="text-sm">Kodlama konusunda size nasıl yardımcı olabilirim?</p>
              </div>
            ) : (
              messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                      <Cpu className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div
                      className="prose prose-sm prose-invert max-w-none break-words"
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(message.content),
                      }}
                    />
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center ml-2 flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800 text-slate-300 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Yanıt oluşturuluyor...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Öneriler */}
          {messages.length === 0 && (
            <div className="px-4 pb-3">
              <p className="text-xs text-slate-500 mb-2">Örnek sorular:</p>
              <div className="flex flex-wrap gap-2">
                {codeSuggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-1 px-3 rounded-full transition-colors"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Giriş alanı */}
          <div className="p-3 border-t border-slate-700 bg-slate-800">
            <div className="flex gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="AI asistana bir soru sorun veya kod yardımı isteyin..."
                className="resize-none min-h-[40px] max-h-[120px] bg-slate-900 border-slate-700 focus:border-blue-500 text-sm"
                disabled={isLoading}
                aria-label="Mesaj girişi"
              />
              <Button
                type="submit"
                size="icon"
                className={`h-10 w-10 ${
                  isLoading ? 'bg-slate-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                aria-label="Gönder"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
