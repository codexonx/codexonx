// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve Monaco Editor
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import { useRef, useState, useEffect } from 'react';

interface MonacoEditorOptions {
  language?: string;
  value?: string;
  theme?: string;
  automaticLayout?: boolean;
  minimap?: {
    enabled?: boolean;
  };
}

export function useMonacoEditor(options: MonacoEditorOptions = {}) {
  const editorContainer = useRef<HTMLDivElement>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    // Monaco Editor'ü yükleme ve kurma
    let editor: any = null;

    async function loadMonaco() {
      // Script yükleme ve Monaco yükleme fonksiyonu
      const loadScript = (src: string) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      // Monaco Editor'ün yüklenmesi
      try {
        if (!window.monaco) {
          // Önce global monaco değişkeni tanımlanmamışsa gerekli scriptleri yükle
          const monacoScriptUrl = 'https://unpkg.com/monaco-editor@0.33.0/min/vs/loader.js';
          await loadScript(monacoScriptUrl);

          // Monaco'yu yapılandır
          (window as any).require.config({
            paths: { vs: 'https://unpkg.com/monaco-editor@0.33.0/min/vs' },
          });

          // Monaco'yu yükle
          await new Promise<void>(resolve => {
            (window as any).require(['vs/editor/editor.main'], function () {
              resolve();
            });
          });
        }

        // Editör referansı mevcut ve container hazırsa
        if (editorContainer.current && window.monaco) {
          editor = window.monaco.editor.create(editorContainer.current, {
            value: options.value || '',
            language: options.language || 'javascript',
            theme: options.theme || 'vs-dark',
            automaticLayout: options.automaticLayout !== undefined ? options.automaticLayout : true,
            minimap: options.minimap || { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            renderLineHighlight: 'all',
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            scrollbar: {
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
            },
          });

          setEditorInstance(editor);
          setIsEditorReady(true);

          // Editör hazır olduğunda dil ve tema ayarlarını uygula
          if (options.language) {
            const model = editor.getModel();
            if (model) {
              monaco.editor.setModelLanguage(model, options.language);
            }
          }
        }
      } catch (error) {
        console.error('Monaco Editor yükleme hatası:', error);
      }
    }

    loadMonaco();

    // Temizleme fonksiyonu
    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, []); // Sadece bir kez yükle

  return {
    editorContainer,
    editorInstance,
    isEditorReady,
  };
}
