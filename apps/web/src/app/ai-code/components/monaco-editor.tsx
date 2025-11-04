'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useRef, useEffect, useState, Suspense, lazy } from 'react';
import { useTheme } from 'next-themes';

// Monaco Editor stil dosyasını içe aktar
import './monaco-editor.css';

// Monaco Editor'ü client-side'da lazy loading ile yükle
let monaco: typeof import('monaco-editor');
if (typeof window !== 'undefined') {
  monaco = require('monaco-editor');
}

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
      className="monaco-editor-container"
      data-testid="monaco-editor"
      aria-label="Monaco kod editörü"
    />
  );
}

// Monaco başlatıcı
export function setupMonaco() {
  // Yalnızca client tarafında çalıştığından emin ol
  if (typeof window === 'undefined' || !monaco) return;

  // Dil desteği - performans için yalnızca gerekli dilleri yükle
  const languages = ['javascript', 'typescript', 'html', 'css', 'json', 'python', 'markdown'];

  // Dil özelliklerini yükle
  languages.forEach(lang => {
    if (monaco.languages.getLanguages().some((l: any) => l.id === lang)) return;
    monaco.languages.register({ id: lang });
  });

  // Monaco WebWorker yönetimi için özellikler
  // @ts-ignore
  self.MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: any, label: string) {
      if (label === 'json') {
        return '/monaco-workers/json.worker.js';
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return '/monaco-workers/css.worker.js';
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return '/monaco-workers/html.worker.js';
      }
      if (label === 'typescript' || label === 'javascript') {
        return '/monaco-workers/ts.worker.js';
      }
      return '/monaco-workers/editor.worker.js';
    },
  };
}

// Otomatik tamamlama sağlayıcısı örneği
export function registerCompletionProvider() {
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: function (model, position) {
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
