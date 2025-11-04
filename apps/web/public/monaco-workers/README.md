# Monaco Editor Workers

Bu dizin, Monaco Editor'ün web worker'larını içermektedir. Web worker'lar, editörün performansını artırmak için arka planda çalışan JavaScript dosyalarıdır.

## Kurulum

Monaco Editor kullanmadan önce aşağıdaki komutları çalıştırarak worker dosyalarını oluşturun:

```bash
# Worker dosyalarını oluşturmak için
npx webpack --config webpack.monaco-workers.config.js
```

## Worker Dosyaları

- `editor.worker.js`: Temel editör işlevleri için worker
- `json.worker.js`: JSON düzenlemesi için worker
- `css.worker.js`: CSS, SCSS ve LESS düzenlemesi için worker
- `html.worker.js`: HTML düzenlemesi için worker
- `ts.worker.js`: TypeScript ve JavaScript düzenlemesi için worker

## Yapılandırma

Monaco Editor için web worker'ları `monaco-editor.tsx` dosyasında yapılandırılmıştır. Worker'lar, daha iyi performans için editör işlemlerini ayrı thread'lerde çalıştırır.
