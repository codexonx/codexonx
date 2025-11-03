# CodeXONX Web Uygulaması Teknik Dokümantasyonu

Bu dokümantasyon, CodeXONX platformunun web uygulamasına yönelik teknik detayları içerir. Uygulama mimarisi, bileşen yapısı, sayfa organizasyonu ve önemli teknik konuları kapsar.

## İçindekiler

- [Mimari Genel Bakış](#mimari-genel-bakış)
- [Dizin Yapısı](#dizin-yapısı)
- [Temel Bileşenler](#temel-bileşenler)
- [Sayfalar](#sayfalar)
- [Veri Yönetimi](#veri-yönetimi)
- [Kimlik Doğrulama](#kimlik-doğrulama)
- [Tema ve Stil](#tema-ve-stil)
- [API Entegrasyonu](#api-entegrasyonu)
- [Monaco Editor Entegrasyonu](#monaco-editor-entegrasyonu)
- [Erişilebilirlik](#erişilebilirlik)
- [İ18N (Uluslararasılaştırma)](#i18n)
- [Performans Optimizasyonları](#performans-optimizasyonları)
- [Bilinen Sorunlar ve Çözümler](#bilinen-sorunlar-ve-çözümler)

## Mimari Genel Bakış

CodeXONX web uygulaması Next.js 14 App Router tabanlı olarak geliştirilmiştir. Uygulamanın genel mimarisi şunları içerir:

- **App Router**: Next.js 14'ün App Router özelliği ile her bir sayfa bir React Server Component olarak tanımlanmıştır.
- **Client Components**: Etkileşimli UI bileşenleri "use client" direktifi ile client component olarak tanımlanmıştır.
- **UI Kütüphanesi**: Radix UI primitives üzerine kurulu shadcn/ui bileşenleri kullanılmıştır.
- **Stil Sistemi**: Tailwind CSS kullanılarak tutarlı ve özelleştirilebilir bir stil sistemi oluşturulmuştur.
- **State Management**: Yerel durum için React Hooks, global durum için Context API kullanılmıştır.
- **API İntegrasyon**: Axios tabanlı istemci ile backend API'lere bağlantı sağlanmıştır.
- **Tip Güvenliği**: TypeScript ile tüm kodun tip güvenliği sağlanmıştır.

## Dizin Yapısı

```
/apps/web/
  ├── public/           # Statik dosyalar
  ├── src/              # Kaynak kodları
  │   ├── app/          # Next.js App Router sayfaları
  │   │   ├── api/      # API route'ları (edge fonksiyonları)
  │   │   ├── admin/    # Admin paneli
  │   │   ├── auth/     # Kimlik doğrulama sayfaları
  │   │   ├── dashboard/# Ana dashboard sayfaları
  │   │   └── (...)     # Diğer sayfalar
  │   ├── components/   # Paylaşılan UI bileşenleri
  │   │   ├── ui/       # Temel UI bileşenleri
  │   │   ├── dashboard/# Dashboard-spesifik bileşenler
  │   │   └── (...)     # Diğer bileşenler
  │   ├── lib/          # Yardımcı işlevler ve hook'lar
  │   │   ├── api/      # API istemcisi
  │   │   ├── utils.ts  # Genel yardımcı işlevler
  │   │   └── (...)     # Diğer yardımcılar
  │   ├── hooks/        # Custom React hooks
  │   ├── contexts/     # React Context sağlayıcıları
  │   ├── types/        # TypeScript tipleri ve arayüzleri
  │   └── styles/       # Global stil tanımları
  ├── tailwind.config.js # Tailwind yapılandırması
  ├── tsconfig.json     # TypeScript yapılandırması
  └── next.config.js    # Next.js yapılandırması
```

## Temel Bileşenler

### UI Bileşenleri

Web uygulaması, `src/components/ui/` altında bulunan temel UI bileşenlerini kullanır. Bu bileşenler Radix UI primitives üzerine inşa edilmiştir:

- **Button**: Çeşitli stil varyantları ile düğmeler
- **Card**: Kart layout bileşenleri
- **Dialog**: Modal dialoglar
- **Tabs**: Sekme grupları
- **Input**: Form giriş alanları
- **Select**: Dropdown seçim alanları
- **Checkbox**: Onay kutuları
- **RadioGroup**: Radyo düğme grupları
- **Separator**: Ayırıcı çizgiler
- **Avatar**: Kullanıcı avatar bileşeni
- **Badge**: Rozet ve etiketler

### Layout Bileşenleri

- **DashboardLayout**: Dashboard düzenini ve gezinme menüsünü yönetir.
- **MainNav**: Ana navigasyon bileşeni.
- **SideNav**: Yan gezinme menüsü.
- **TopNav**: Üst gezinme çubuğu.
- **Footer**: Sayfa altlığı.

## Sayfalar

Web uygulaması şu ana sayfaları içerir:

### Kimlik Doğrulama Sayfaları

- `/auth/login`: Kullanıcı giriş sayfası
- `/auth/register`: Kullanıcı kayıt sayfası
- `/auth/forgot-password`: Şifre sıfırlama sayfası

### Dashboard Sayfaları

- `/dashboard`: Ana dashboard sayfası
- `/dashboard/editor`: Kod editörü sayfası
- `/dashboard/projects`: Proje yönetim sayfası
- `/dashboard/templates`: Şablonlar sayfası
- `/dashboard/community`: Topluluk sayfası
- `/dashboard/settings`: Kullanıcı ayarları sayfası
- `/dashboard/terminal`: Terminal sayfası
- `/dashboard/profile`: Kullanıcı profil sayfası
- `/dashboard/docs`: Dokümantasyon sayfası
- `/dashboard/api-docs`: API belgeleri sayfası

### Admin Sayfaları

- `/admin/dashboard`: Admin paneli ana sayfası
- `/admin/users`: Kullanıcı yönetimi
- `/admin/products`: Ürün yönetimi

## Veri Yönetimi

### API İstemcisi

`src/lib/api/client.ts` dosyasında tanımlanan API istemcisi, backend API'leri ile iletişimi yönetir. Axios tabanlı bu istemci şunları içerir:

- Token yönetimi
- Hata yakalama ve işleme
- Otomatik yeniden deneme
- İstek ve yanıt interceptor'ları

### Durum Yönetimi

- **Local State**: React useState ve useReducer hook'ları
- **Context State**: React Context API, özel context'ler
- **Persistent State**: localStorage/sessionStorage ile yerel depolama

## Kimlik Doğrulama

Kimlik doğrulama sistemi şunları içerir:

- JWT tabanlı oturum yönetimi
- Kullanıcı oturum durumu için özel Context
- Korumalı rotalar için middleware
- Rol tabanlı erişim kontrolü

```typescript
// authContext.tsx örneği (basitleştirilmiş)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Token kontrolü ve kullanıcı verisi alma
    const checkAuth = async () => {
      try {
        const data = await authService.checkSession();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Auth işlevleri...
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Tema ve Stil

### Tailwind CSS Yapılandırması

Tailwind CSS, proje içerisinde tutarlı bir stil sistemi oluşturmak için kullanılmıştır. Özelleştirmeler `tailwind.config.js` dosyasında yapılmıştır:

- Özel renkler
- Tipografi ölçekleri
- Animasyon ve geçişler
- Duyarlı tasarım kesme noktaları

### Karanlık Mod

Uygulama hem açık hem karanlık modda çalışacak şekilde tasarlanmıştır:

- `next-themes` kütüphanesi ile tema yönetimi
- Tailwind ile karanlık mod sınıfları (`dark:` öneki)
- Kullanıcı tercihi depolama

## API Entegrasyonu

### API Servisleri

`src/lib/api/client.ts` dosyasında tanımlanmış API servisleri şunları içerir:

- `authService`: Kimlik doğrulama işlemleri
- `userService`: Kullanıcı işlemleri
- `projectService`: Proje yönetimi
- `aiService`: AI işlemleri ve entegrasyonları

## Monaco Editor Entegrasyonu

Monaco Editor entegrasyonu için özel bir hook geliştirilmiştir:

```typescript
// useMonacoEditor.ts
export function useMonacoEditor(options = {}) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Monaco Editor'u yükle ve başlat
    import('monaco-editor').then(monaco => {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: options.initialValue || '',
        language: options.language || 'javascript',
        theme: options.theme || 'vs-dark',
        automaticLayout: true,
        ...options
      });
      
      // Temizleme işlevi
      return () => {
        editorRef.current?.dispose();
      };
    });
  }, [options.language, options.theme]);
  
  return { containerRef, editorRef };
}
```

## Erişilebilirlik

Web uygulaması, WCAG 2.1 AA seviyesine uyum sağlamak için şu özellikleri içerir:

- Semantik HTML yapısı
- ARIA etiketleri ve rolleri
- Klavye navigasyonu desteği
- Yüksek kontrast modu
- Ekran okuyucu uyumluluğu

## i18n

Uluslararasılaştırma için, özel bir i18n context geliştirilmiştir:

```typescript
// i18nContext.tsx
export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('tr');
  const [translations, setTranslations] = useState({});
  
  useEffect(() => {
    // Dil dosyasını yükle
    const loadTranslations = async () => {
      const translations = await import(`../locales/${locale}.json`);
      setTranslations(translations.default);
    };
    
    loadTranslations();
  }, [locale]);
  
  const t = useCallback((key) => {
    return key.split('.').reduce((o, i) => o?.[i], translations) || key;
  }, [translations]);
  
  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
```

## Performans Optimizasyonları

- **Code Splitting**: Next.js'in otomatik kod bölünmesi
- **Image Optimization**: next/image ile görsel optimizasyonu
- **Component Memoization**: React.memo ve useMemo ile bileşen optimizasyonu
- **Bundle Size Optimization**: Küçük paket boyutu için import optimizasyonları
- **SSR ve SSG**: Sunucu taraflı işleme ve statik site oluşturma

## Bilinen Sorunlar ve Çözümler

### TypeScript Hataları

Proje içerisinde bazı TypeScript hatalarıyla karşılaşabilirsiniz. Bunların çoğu üçüncü taraf kütüphaneler ve React/Next.js arasındaki tip uyumsuzluklarından kaynaklanmaktadır. Bu tür durumlarda aşağıdaki çözümleri uygulayabilirsiniz:

1. `@ts-nocheck` direktifi ile tip kontrolleri geçici olarak devre dışı bırakılabilir.
2. `global.d.ts` dosyasına eksik tip tanımlamaları eklenebilir.

### Framer Motion Ref Hataları

Framer Motion bileşenleriyle ilgili ref hataları için global.d.ts dosyasında şu tip tanımlamaları eklenmiştir:

```typescript
// global.d.ts içerisindeki tanımlamalar
declare module 'framer-motion' {
  import { ReactNode, Component, ComponentClass, ForwardRefExoticComponent, RefAttributes } from 'react';

  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    variants?: any;
    transition?: any;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
    [key: string]: any;
  }
  
  // Framer Motion bileşenlerinin refs özelliğini tanımla
  class MotionComponent<P, S> extends Component<P, S> {
    refs: {
      [key: string]: Element;
    };
  }

  export const motion: {
    div: ForwardRefExoticComponent<MotionProps & React.HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>>;
    // Diğer elementler...
  };
}
```

### Lucide İkon Hataları

Lucide ikonları için eksik tip tanımlamaları global.d.ts dosyasında şu şekilde tanımlanmıştır:

```typescript
// global.d.ts içerisindeki tanımlamalar
declare module 'lucide-react' {
  import { ComponentType, ReactNode } from 'react';
  export interface IconProps {
    color?: string;
    size?: number | string;
    strokeWidth?: number;
    className?: string;
    onClick?: () => void;
    children?: ReactNode;
    [key: string]: any;
  }
  
  export type IconComponent = ComponentType<IconProps>;
  
  // İkonlar
  export const Activity: IconComponent;
  export const AlertCircle: IconComponent;
  // ... diğer ikonlar
}
```

### CSS Çakışmaları

Tailwind CSS'de bazı sınıf çakışmaları olabilir. Bunların çözümü için `cn()` yardımcı fonksiyonu kullanılmaktadır:

```typescript
// utils.ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

Bu dokümantasyon, CodeXONX web uygulaması geliştirme sürecinde bir rehber olarak kullanılmalıdır. Proje büyüdükçe ve yeni özellikler eklendikçe bu doküman güncellenmelidir.
