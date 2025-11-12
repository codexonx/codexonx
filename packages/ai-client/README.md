# Codexonx AI Client

> Stub modülü – gerçek LLM entegrasyonu için temel yapı

## Amaç

- Uygulama katmanının LLM çağrılarını tek bir paket üzerinden yapmasını sağlamak
- Mock/Stub implementasyonu ile geliştirme sırasında deterministik sonuç üretmek

## Klasör Yapısı

```text
ai-client/
  ├── src/
  │   ├── index.ts
  │   ├── providers/
  │   │   ├── emergent.ts (planlanan)
  │   │   └── openai.ts (planlanan)
  │   └── stubs/
  │       ├── architect.ts
  │       └── reviewer.ts
  └── README.md
```

## Yapılacaklar

- [ ] `src/index.ts` dosyasında `LLMClient` arayüzü tanımla
- [ ] `stubs/architect.ts` içinde mock yanıtları dönen fonksiyon oluştur
- [ ] `providers/emergent.ts` dosyasında gerçek integration için iskelet hazırla
- [ ] Paket için Jest/Vitest testleri ekle

## Kullanım (Plan)

```typescript
import { createLLMClient } from '@codexonx/ai-client';

const client = createLLMClient({ provider: 'stub' });
const response = await client.complete({
  prompt: 'Refactor the deployment script to add retry logic.',
});
```
