/**
 * Codexonx Analytics Service
 * Kullanıcı aktivitelerini izlemek ve raporlamak için API servisi
 */

// Aktivite türleri
export enum ActivityType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  FORM_SUBMIT = 'form_submit',
  API_CALL = 'api_call',
  ERROR = 'error',
  AUTH = 'auth',
  FEATURE_USAGE = 'feature_usage',
  SEARCH = 'search',
  PURCHASE = 'purchase',
  SESSION_START = 'session_start',
  SESSION_END = 'session_end'
}

// Aktivite kaydı arayüzü
export interface ActivityLog {
  userId?: string;
  sessionId: string;
  timestamp: number;
  type: ActivityType;
  path?: string;
  target?: string;
  data?: Record<string, any>;
  duration?: number;
  success?: boolean;
  errorMessage?: string;
}

// Kullanıcı özellikleri
export interface UserProperties {
  userId?: string;
  sessionId: string;
  locale?: string;
  timezone?: string;
  userAgent?: string;
  platform?: string;
  browser?: string;
  deviceType?: string;
  screenSize?: string;
  referrer?: string;
  firstSeen?: number;
}

class AnalyticsService {
  private baseUrl: string;
  private sessionId: string;
  private userId: string | undefined;
  private userProperties: UserProperties;
  private isEnabled: boolean = true;
  private queue: ActivityLog[] = [];
  private flushInterval: number = 10000; // 10 saniye
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || '/api/analytics';
    this.sessionId = this.generateSessionId();
    this.userProperties = {
      sessionId: this.sessionId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      locale: typeof navigator !== 'undefined' ? navigator.language : undefined,
      timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      firstSeen: Date.now(),
    };

    if (typeof window !== 'undefined') {
      // Tarayıcı ortamında çalışıyoruz
      this.detectBrowserInfo();
      this.startSession();
      this.setupListeners();
      this.startFlushTimer();
      this.isInitialized = true;
    }
  }

  /**
   * Kullanıcı kimliğini ayarlar (giriş yapıldığında çağrılmalıdır)
   */
  public setUserId(userId: string): void {
    this.userId = userId;
    this.userProperties.userId = userId;
    this.trackEvent(ActivityType.AUTH, {
      action: 'identify',
      userId,
    });
  }

  /**
   * Kullanıcı kimliğini temizler (çıkış yapıldığında çağrılmalıdır)
   */
  public clearUserId(): void {
    this.trackEvent(ActivityType.AUTH, {
      action: 'logout',
      userId: this.userId,
    });
    this.userId = undefined;
    this.userProperties.userId = undefined;
  }

  /**
   * Sayfa görüntüleme olayını kaydeder
   */
  public trackPageView(path: string, title?: string): void {
    this.trackEvent(ActivityType.PAGE_VIEW, {
      path,
      title: title || document.title,
    });
  }

  /**
   * Tıklama olayını kaydeder
   */
  public trackClick(target: string, properties?: Record<string, any>): void {
    this.trackEvent(ActivityType.CLICK, {
      target,
      ...properties,
    });
  }

  /**
   * Form gönderim olayını kaydeder
   */
  public trackFormSubmit(formId: string, formData?: Record<string, any>): void {
    this.trackEvent(ActivityType.FORM_SUBMIT, {
      formId,
      formData,
    });
  }

  /**
   * API çağrısını kaydeder
   */
  public trackApiCall(endpoint: string, method: string, status: number, duration: number): void {
    this.trackEvent(ActivityType.API_CALL, {
      endpoint,
      method,
      status,
      duration,
      success: status >= 200 && status < 300,
    });
  }

  /**
   * Hata olayını kaydeder
   */
  public trackError(error: Error, context?: Record<string, any>): void {
    this.trackEvent(ActivityType.ERROR, {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  /**
   * Özel bir özellik kullanımını kaydeder
   */
  public trackFeatureUsage(featureName: string, properties?: Record<string, any>): void {
    this.trackEvent(ActivityType.FEATURE_USAGE, {
      feature: featureName,
      ...properties,
    });
  }

  /**
   * Arama olayını kaydeder
   */
  public trackSearch(query: string, resultsCount: number, category?: string): void {
    this.trackEvent(ActivityType.SEARCH, {
      query,
      resultsCount,
      category,
    });
  }

  /**
   * Satın alma olayını kaydeder
   */
  public trackPurchase(
    transactionId: string,
    total: number,
    currency: string = 'TRY',
    items?: Array<Record<string, any>>
  ): void {
    this.trackEvent(ActivityType.PURCHASE, {
      transactionId,
      total,
      currency,
      items,
    });
  }

  /**
   * Genel amaçlı olay izleme
   */
  public trackEvent(type: ActivityType, data?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const activity: ActivityLog = {
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      type,
      path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      data,
    };

    this.queue.push(activity);

    // Kritik olayları hemen gönder
    if (
      type === ActivityType.ERROR ||
      type === ActivityType.PURCHASE ||
      type === ActivityType.AUTH
    ) {
      this.flush();
    }
  }

  /**
   * Kuyruktaki tüm olayları sunucuya gönderir
   */
  public async flush(): Promise<boolean> {
    if (this.queue.length === 0 || !this.isEnabled) return true;

    const events = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProperties: this.userProperties,
          events,
        }),
        // Sayfa kapanırken bile veriyi göndermeye çalış
        keepalive: true,
      });

      return response.ok;
    } catch (error) {
      // Başarısız olursa olayları kuyruğa geri ekle
      this.queue = [...this.queue, ...events];
      console.error('Analytics data could not be sent:', error);
      return false;
    }
  }

  /**
   * Analytics hizmetini etkinleştirir veya devre dışı bırakır
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (enabled && !this.flushTimer) {
      this.startFlushTimer();
    } else if (!enabled && this.flushTimer) {
      this.stopFlushTimer();
    }
  }

  /**
   * Oturum başlatma
   */
  private startSession(): void {
    this.trackEvent(ActivityType.SESSION_START, {
      referrer: this.userProperties.referrer,
      userAgent: this.userProperties.userAgent,
    });

    // Sayfa kapanırken oturumu sonlandır
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.trackEvent(ActivityType.SESSION_END, {
          duration: Date.now() - (this.userProperties.firstSeen || Date.now()),
        });
        this.flush();
      });
    }
  }

  /**
   * Tarayıcı bilgilerini algıla
   */
  private detectBrowserInfo(): void {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') return;

    const ua = navigator.userAgent;
    
    // Platform algılama
    let platform = 'unknown';
    if (/Android/i.test(ua)) platform = 'android';
    else if (/iPhone|iPad|iPod/i.test(ua)) platform = 'ios';
    else if (/Windows/i.test(ua)) platform = 'windows';
    else if (/Mac/i.test(ua)) platform = 'mac';
    else if (/Linux/i.test(ua)) platform = 'linux';

    // Tarayıcı algılama
    let browser = 'unknown';
    if (/Chrome/i.test(ua) && !/Chromium|Edge|OPR|Brave/i.test(ua)) browser = 'chrome';
    else if (/Firefox/i.test(ua)) browser = 'firefox';
    else if (/Safari/i.test(ua) && !/Chrome|Chromium|Edge|OPR|Brave/i.test(ua)) browser = 'safari';
    else if (/Edge/i.test(ua)) browser = 'edge';
    else if (/Opera|OPR/i.test(ua)) browser = 'opera';
    else if (/Brave/i.test(ua)) browser = 'brave';

    // Cihaz türü
    let deviceType = 'desktop';
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) deviceType = 'mobile';
    if (/iPad|Tablet/i.test(ua)) deviceType = 'tablet';

    // Ekran boyutu
    const screenSize = `${window.screen.width}x${window.screen.height}`;

    this.userProperties.platform = platform;
    this.userProperties.browser = browser;
    this.userProperties.deviceType = deviceType;
    this.userProperties.screenSize = screenSize;
  }

  /**
   * Global olay dinleyicileri ekle
   */
  private setupListeners(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Tıklama olaylarını izle
    document.addEventListener('click', (e) => {
      // Sadece belirli elementleri izle
      const target = e.target as HTMLElement;
      if (target && (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.hasAttribute('data-analytics')
      )) {
        let element = target;
        if (!target.hasAttribute('data-analytics')) {
          element = target.closest('[data-analytics]') || target;
        }

        const analyticsId = element.getAttribute('data-analytics') || element.id || element.tagName.toLowerCase();
        const href = element.tagName === 'A' ? (element as HTMLAnchorElement).href : undefined;
        
        this.trackClick(analyticsId, { href });
      }
    });

    // Form gönderimlerini izle
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      const formId = form.id || form.getAttribute('name') || 'unknown-form';
      
      // Hassas verileri içermeyecek şekilde basit form bilgilerini topla
      const formData: Record<string, any> = {};
      if (form.elements) {
        Array.from(form.elements).forEach((element: any) => {
          if (element.name && element.type !== 'password' && !element.name.toLowerCase().includes('password')) {
            formData[element.name] = element.type === 'checkbox' ? element.checked : element.value;
          }
        });
      }
      
      this.trackFormSubmit(formId, formData);
    });
  }

  /**
   * Periyodik veri gönderimi için zamanlayıcı başlat
   */
  private startFlushTimer(): void {
    if (typeof window === 'undefined') return;
    
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Zamanlayıcıyı durdur
   */
  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Benzersiz oturum kimliği oluştur
   */
  private generateSessionId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const timestamp = new Date().getTime().toString(36);
    
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return `${timestamp}-${result}`;
  }
}

// Singleton örneği oluştur
export const analytics = new AnalyticsService();

// React bileşenlerinde kullanım için hook
export function useAnalytics() {
  return analytics;
}
