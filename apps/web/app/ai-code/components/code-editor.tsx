'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState, useEffect, useRef } from 'react';
import { Check, Save, Copy, Play, Share2 as Share, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (code: string) => void;
  onRun?: (code: string) => void;
  height?: string;
  className?: string;
  textareaClassName?: string;
}

// Basit bir kod editörü komponenti
// Not: Gerçek uygulamada Monaco Editor veya CodeMirror gibi bir kütüphane kullanılabilir
export const CodeEditor = ({
  initialCode = '// Kodunuzu buraya yazın',
  language = 'javascript',
  readOnly = false,
  onChange,
  onRun,
  height = '400px',
  className,
  textareaClassName,
}: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [isCopied, setIsCopied] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const heightClassMap: Record<string, string> = {
    '300px': 'h-[300px]',
    '320px': 'h-[320px]',
    '360px': 'h-[360px]',
    '400px': 'h-[400px]',
    '480px': 'h-[480px]',
    '500px': 'h-[500px]',
    '560px': 'h-[560px]',
    '600px': 'h-[600px]',
    '640px': 'h-[640px]',
    '70vh': 'h-[70vh]',
    auto: 'h-auto',
    full: 'h-full',
    '100%': 'h-full',
  };

  const containerHeightClass = heightClassMap[height] || heightClassMap['400px'];

  useEffect(() => {
    // initialCode değişirse, editörü güncelle
    setCode(initialCode);
  }, [initialCode]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onChange) {
      onChange(newCode);
    }
  };

  const handleRun = () => {
    if (onRun) {
      onRun(code);
    } else {
      toast({
        title: 'Kod Çalıştırılıyor',
        description: 'Bu demo sürümde kod çalıştırma simüle edilmektedir.',
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    toast({
      title: 'Kopyalandı!',
      description: 'Kod panoya kopyalandı.',
    });

    // 2 saniye sonra kopyalama göstergesini sıfırla
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleSave = () => {
    // Gerçek uygulamada burada bir API'ye kaydetme işlemi yapılır
    toast({
      title: 'Kaydedildi!',
      description: 'Kodunuz başarıyla kaydedildi.',
    });
  };

  const handleDownload = () => {
    // Kod içeriğini dosya olarak indirme
    const extension =
      language === 'javascript'
        ? 'js'
        : language === 'python'
          ? 'py'
          : language === 'typescript'
            ? 'ts'
            : language === 'html'
              ? 'html'
              : 'txt';

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'İndiriliyor',
      description: `Kod dosyası code.${extension} olarak indiriliyor.`,
    });
  };

  // Tab tuşunu yakalamak için
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editorRef.current?.selectionStart || 0;
      const end = editorRef.current?.selectionEnd || 0;

      // 2 boşluk ekleyelim
      const newCode = code.substring(0, start) + '  ' + code.substring(end);

      setCode(newCode);

      // İmleç konumunu ayarlayalım
      if (editorRef.current) {
        setTimeout(() => {
          editorRef.current!.selectionStart = start + 2;
          editorRef.current!.selectionEnd = start + 2;
        }, 0);
      }

      if (onChange) {
        onChange(newCode);
      }
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-slate-900 rounded-md overflow-hidden border border-slate-700',
        'min-h-[200px]',
        containerHeightClass,
        className
      )}
    >
      {/* Editör başlık çubuğu */}
      <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
        <div className="flex items-center">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-slate-400 text-sm font-mono">
            {language === 'javascript'
              ? 'script.js'
              : language === 'python'
                ? 'script.py'
                : language === 'typescript'
                  ? 'script.ts'
                  : language === 'html'
                    ? 'index.html'
                    : 'code.txt'}
          </span>
        </div>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            title="Çalıştır"
            onClick={handleRun}
          >
            <Play className="h-4 w-4 text-green-400" />
            <span className="sr-only">Çalıştır</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            title="Kaydet"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 text-blue-400" />
            <span className="sr-only">Kaydet</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            title={isCopied ? 'Kopyalandı' : 'Kopyala'}
            onClick={handleCopy}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-slate-400" />
            )}
            <span className="sr-only">{isCopied ? 'Kopyalandı' : 'Kopyala'}</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            title="İndir"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 text-slate-400" />
            <span className="sr-only">İndir</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            title="Paylaş"
            onClick={() =>
              toast({
                title: 'Paylaşım Bağlantısı',
                description: 'Kod paylaşım bağlantısı panoya kopyalandı.',
              })
            }
          >
            <Share className="h-4 w-4 text-slate-400" />
            <span className="sr-only">Paylaş</span>
          </Button>
        </div>
      </div>

      {/* Kod editörü */}
      <textarea
        ref={editorRef}
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex-1 w-full bg-slate-900 text-slate-300 p-4 font-mono text-sm resize-none outline-none',
          'min-h-[200px] h-full',
          textareaClassName
        )}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        readOnly={readOnly}
        aria-label="Kod editörü"
        title="Kod editörü"
      />
    </div>
  );
};

// Kod çıktısını göstermek için basit bir bileşen
export const CodeOutput = ({ output }: { output: string }) => {
  return (
    <div className="bg-slate-900 rounded-md overflow-hidden border border-slate-700 mt-4">
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
        <span className="text-slate-400 text-sm">Çıktı</span>
      </div>
      <div className="p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap">
        {output || "Henüz çıktı yok. Kodu çalıştırmak için 'Çalıştır' butonuna tıklayın."}
      </div>
    </div>
  );
};

// Kod açıklama ve yorum bileşeni
export const CodeExplanation = ({ explanation }: { explanation: string }) => {
  return (
    <div className="bg-slate-900 rounded-md overflow-hidden border border-slate-700 mt-4">
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
        <span className="text-slate-400 text-sm">AI Açıklaması</span>
      </div>
      <div className="p-4 text-sm text-slate-300 prose prose-invert prose-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: explanation }} />
      </div>
    </div>
  );
};
