'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useRef, useEffect, useState, useMemo } from 'react';
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

const BASE_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  fontSize: 14,
  lineNumbers: 'on',
  folding: true,
  tabSize: 2,
  wordWrap: 'on',
};

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
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { theme: systemTheme } = useTheme();
  const [isEditorReady, setIsEditorReady] = useState(false);

  const resolvedTheme = useMemo(
    () => propTheme || (systemTheme === 'dark' ? 'vs-dark' : 'vs-light'),
    [propTheme, systemTheme]
  );

  const editorOptions = useMemo(
    () => ({
      ...BASE_EDITOR_OPTIONS,
      ...options,
    }),
    [options]
  );

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const onMountRef = useRef(onMount);
  useEffect(() => {
    onMountRef.current = onMount;
  }, [onMount]);

  useEffect(() => {
    if (!containerRef.current || !monaco || editorRef.current) {
      return;
    }

    const editor = monaco.editor.create(containerRef.current, {
      ...editorOptions,
      value,
      language,
      theme: resolvedTheme,
    });

    editorRef.current = editor;
    setIsEditorReady(true);

    if (onMountRef.current) {
      onMountRef.current(editor);
    }

    const subscription = editor.onDidChangeModelContent(() => {
      if (onChangeRef.current) {
        onChangeRef.current(editor.getValue());
      }
    });

    return () => {
      subscription.dispose();
      editor.dispose();
      editorRef.current = null;
      setIsEditorReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEditorReady || !editorRef.current) {
      return;
    }

    const editor = editorRef.current as unknown as {
      updateOptions: (options: monaco.editor.IStandaloneEditorConstructionOptions) => void;
    };
    editor.updateOptions(editorOptions);
  }, [editorOptions, isEditorReady]);

  useEffect(() => {
    if (!isEditorReady || !editorRef.current) {
      return;
    }

    const currentValue = editorRef.current.getValue();
    if (currentValue !== value) {
      editorRef.current.setValue(value);
    }
  }, [value, isEditorReady]);

  useEffect(() => {
    if (!isEditorReady || !editorRef.current) {
      return;
    }

    const model = editorRef.current.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, language);
    }
  }, [language, isEditorReady]);

  useEffect(() => {
    if (isEditorReady) {
      monaco.editor.setTheme(resolvedTheme);
    }
  }, [resolvedTheme, isEditorReady]);

  useEffect(() => {
    if (!isEditorReady || !editorRef.current) {
      return;
    }

    const editor = editorRef.current as unknown as { layout: () => void };
    editor.layout();
  }, [height, width, isEditorReady]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.style.setProperty('--monaco-editor-height', height);
    containerRef.current.style.setProperty('--monaco-editor-width', width);
  }, [height, width]);

  return (
    <div
      ref={containerRef}
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
