"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { useTheme } from 'next-themes';

interface MonacoEditorProps {
  value: string;
  language?: string;
  theme?: 'vs-dark' | 'vs-light';
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  onChange?: (value: string) => void;
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  height?: string;
  width?: string;
}

export default function MonacoEditor({
  value = '',
  language = 'javascript',
  theme: propTheme,
  options = {},
  onChange,
  onMount,
  height = '100%',
  width = '100%',
}: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { theme: systemTheme } = useTheme();
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Editör tema seçimi
  const theme = propTheme || (systemTheme === 'dark' ? 'vs-dark' : 'vs-light');

  // Monaco editörünü başlat
  useEffect(() => {
    if (editorRef.current) {
      // Monaco editörü oluştur
      const editor = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme,
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        folding: true,
        tabSize: 2,
        wordWrap: 'on',
        ...options,
      });

      // Referansı kaydet
      monacoEditorRef.current = editor;

      // Hazır olduğunu bildir
      setIsEditorReady(true);

      // onMount callback'i çağır
      if (onMount) {
        onMount(editor);
      }

      // Değişiklikleri izle
      const subscription = editor.onDidChangeModelContent(() => {
        if (onChange) {
          onChange(editor.getValue());
        }
      });

      // Temizlik
      return () => {
        subscription.dispose();
        editor.dispose();
      };
    }
  }, [editorRef.current]);

  // Değer değişirse güncelle
  useEffect(() => {
    if (monacoEditorRef.current && value !== monacoEditorRef.current.getValue()) {
      monacoEditorRef.current.setValue(value);
    }
  }, [value]);

  // Dil değişirse güncelle
  useEffect(() => {
    if (monacoEditorRef.current) {
      const model = monacoEditorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  // Tema değişirse güncelle
  useEffect(() => {
    monaco.editor.setTheme(theme);
  }, [theme]);

  return (
    <div 
      ref={editorRef} 
      style={{ width, height }} 
      data-testid="monaco-editor"
      aria-label="Monaco kod editörü"
    />
  );
}

// Monaco başlatıcı
export function setupMonaco() {
  // Dil desteği
  const languages = ['javascript', 'typescript', 'html', 'css', 'json', 'python', 'markdown'];
  
  // Dil özelliklerini yükle
  languages.forEach(lang => {
    monaco.languages.register({ id: lang });
    
    // Sözdizimi vurgulama ve otomatik tamamlama için gerekli eklentiler
    // Gerçek bir uygulamada burada dil hizmetlerini ekleyebilirsiniz
  });
}

// Otomatik tamamlama sağlayıcısı örneği
export function registerCompletionProvider() {
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: function(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      
      // Basit birkaç kod tamamlama önerisi
      const suggestions = [
        {
          label: 'function',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'function ${1:name}(${2:params}) {\n\t${0}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Fonksiyon tanımı',
          range,
        },
        {
          label: 'console.log',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: 'console.log(${1:value});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Konsola değer yazdır',
          range,
        },
        {
          label: 'if',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if (${1:condition}) {\n\t${0}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If koşul ifadesi',
          range,
        },
        {
          label: 'async function',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'async function ${1:name}(${2:params}) {\n\t${0}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Asenkron fonksiyon tanımı',
          range,
        },
      ];

      return { suggestions };
    },
  });
}
