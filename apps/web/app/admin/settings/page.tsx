'use client';

import { useState } from 'react';
import { Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18n-context';

export default function SettingsPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form değerleri
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Codexonx Platform',
    siteDescription: 'Kodlama projeleriniz için güçlü bir platform',
    companyName: 'Codexonx Ltd. Şti.',
    companyEmail: 'info@codexonx.com',
    companyPhone: '+90 212 123 4567',
    companyAddress: 'İstanbul, Türkiye',
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireMFA: false,
    sessionTimeout: '30',
    passwordPolicy: 'strong',
    loginAttempts: '5',
    ipRestriction: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    slackIntegration: false,
    slackWebhook: '',
    telegramBot: false,
    telegramToken: '',
    discordWebhook: false,
    discordWebhookUrl: '',
  });

  const [apiSettings, setApiSettings] = useState({
    rateLimitEnabled: true,
    rateLimit: '100',
    rateLimitPeriod: 'minute',
    corsEnabled: true,
    allowedOrigins: '*',
    apiKeyExpiration: 'never',
  });

  // Form kaydedildiğinde
  const handleSave = async () => {
    setSaving(true);

    try {
      // Gerçek uygulamada burada bir API isteği yapılacaktır
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Ayarlar kaydedilemedi:', error);
    } finally {
      setSaving(false);
    }
  };

  // Genel ayarlar formu
  const generalSettingsForm = (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Site Adı
          </label>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={generalSettings.siteName}
            onChange={e => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
            title="Site Adı"
            placeholder="Site adını girin"
            aria-label="Site Adı"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Site Açıklaması
          </label>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={generalSettings.siteDescription}
            onChange={e =>
              setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })
            }
            title="Site Açıklaması"
            placeholder="Site açıklamasını girin"
            aria-label="Site Açıklaması"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Şirket Adı
          </label>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={generalSettings.companyName}
            onChange={e => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
            title="Şirket Adı"
            placeholder="Şirket adını girin"
            aria-label="Şirket Adı"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Şirket E-posta
          </label>
          <input
            type="email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={generalSettings.companyEmail}
            onChange={e => setGeneralSettings({ ...generalSettings, companyEmail: e.target.value })}
            title="Şirket E-posta"
            placeholder="Şirket e-posta adresini girin"
            aria-label="Şirket E-posta"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Şirket Telefonu
          </label>
          <input
            type="tel"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={generalSettings.companyPhone}
            onChange={e => setGeneralSettings({ ...generalSettings, companyPhone: e.target.value })}
            title="Şirket Telefonu"
            placeholder="Şirket telefon numarasını girin"
            aria-label="Şirket Telefonu"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Şirket Adresi
          </label>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={generalSettings.companyAddress}
            onChange={e =>
              setGeneralSettings({ ...generalSettings, companyAddress: e.target.value })
            }
            title="Şirket Adresi"
            placeholder="Şirket adresini girin"
            aria-label="Şirket Adresi"
          />
        </div>
      </div>
    </div>
  );

  // Güvenlik ayarları formu
  const securitySettingsForm = (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={securitySettings.requireMFA}
              onChange={e =>
                setSecuritySettings({ ...securitySettings, requireMFA: e.target.checked })
              }
              title="İki Faktörlü Kimlik Doğrulamayı Zorunlu Tut"
              aria-label="İki Faktörlü Kimlik Doğrulamayı Zorunlu Tut"
            />
            <span className="text-sm font-medium leading-none">
              İki Faktörlü Kimlik Doğrulamayı Zorunlu Tut
            </span>
          </label>
          <p className="text-xs text-muted-foreground">
            Tüm kullanıcılar için MFA'yı zorunlu kılar.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Oturum Zaman Aşımı (dakika)
          </label>
          <input
            type="number"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={securitySettings.sessionTimeout}
            onChange={e =>
              setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })
            }
            title="Oturum Zaman Aşımı"
            placeholder="Oturum zaman aşımı süresini girin"
            aria-label="Oturum Zaman Aşımı (dakika)"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Şifre Politikası
          </label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={securitySettings.passwordPolicy}
            onChange={e =>
              setSecuritySettings({ ...securitySettings, passwordPolicy: e.target.value })
            }
            title="Şifre Politikası"
            aria-label="Şifre Politikası"
          >
            <option value="weak">Zayıf (min. 6 karakter)</option>
            <option value="medium">Orta (min. 8 karakter, harf ve rakam)</option>
            <option value="strong">
              Güçlü (min. 10 karakter, büyük/küçük harf, rakam, özel karakter)
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Maksimum Giriş Denemesi
          </label>
          <input
            type="number"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={securitySettings.loginAttempts}
            onChange={e =>
              setSecuritySettings({ ...securitySettings, loginAttempts: e.target.value })
            }
            title="Maksimum Giriş Denemesi"
            placeholder="Maksimum giriş denemesi sayısını girin"
            aria-label="Maksimum Giriş Denemesi"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={securitySettings.ipRestriction}
              onChange={e =>
                setSecuritySettings({ ...securitySettings, ipRestriction: e.target.checked })
              }
              title="IP Kısıtlamasını Etkinleştir"
              aria-label="IP Kısıtlamasını Etkinleştir"
            />
            <span className="text-sm font-medium leading-none">IP Kısıtlamasını Etkinleştir</span>
          </label>
          <p className="text-xs text-muted-foreground">
            Kullanıcıların yalnızca belirli IP adreslerinden erişim sağlamasına izin verir.
          </p>
        </div>
      </div>
    </div>
  );

  // Bildirim ayarları formu
  const notificationSettingsForm = (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={notificationSettings.emailNotifications}
              onChange={e =>
                setNotificationSettings({
                  ...notificationSettings,
                  emailNotifications: e.target.checked,
                })
              }
              title="E-posta Bildirimleri"
              aria-label="E-posta Bildirimleri"
            />
            <span className="text-sm font-medium leading-none">E-posta Bildirimleri</span>
          </label>
          <p className="text-xs text-muted-foreground">
            Sistem bildirimleri için e-posta gönderimini etkinleştirir.
          </p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={notificationSettings.slackIntegration}
              onChange={e =>
                setNotificationSettings({
                  ...notificationSettings,
                  slackIntegration: e.target.checked,
                })
              }
              title="Slack Entegrasyonu"
              aria-label="Slack Entegrasyonu"
            />
            <span className="text-sm font-medium leading-none">Slack Entegrasyonu</span>
          </label>
          <p className="text-xs text-muted-foreground">
            Önemli bildirimleri Slack kanalına gönderir.
          </p>
        </div>

        {notificationSettings.slackIntegration && (
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Slack Webhook URL
            </label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={notificationSettings.slackWebhook}
              onChange={e =>
                setNotificationSettings({
                  ...notificationSettings,
                  slackWebhook: e.target.value,
                })
              }
              placeholder="https://hooks.slack.com/services/..."
              title="Slack Webhook URL"
              aria-label="Slack Webhook URL"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={notificationSettings.telegramBot}
              onChange={e =>
                setNotificationSettings({
                  ...notificationSettings,
                  telegramBot: e.target.checked,
                })
              }
              title="Telegram Bot"
              aria-label="Telegram Bot"
            />
            <span className="text-sm font-medium leading-none">Telegram Bot</span>
          </label>
          <p className="text-xs text-muted-foreground">
            Bildirimler için Telegram bot entegrasyonu.
          </p>
        </div>

        {notificationSettings.telegramBot && (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Telegram Bot Token
            </label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={notificationSettings.telegramToken}
              onChange={e =>
                setNotificationSettings({
                  ...notificationSettings,
                  telegramToken: e.target.value,
                })
              }
              placeholder="123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
              title="Telegram Bot Token"
              aria-label="Telegram Bot Token"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={notificationSettings.discordWebhook}
              onChange={e =>
                setNotificationSettings({
                  ...notificationSettings,
                  discordWebhook: e.target.checked,
                })
              }
              title="Discord Webhook"
              aria-label="Discord Webhook"
            />
            <span className="text-sm font-medium leading-none">Discord Webhook</span>
          </label>
          <p className="text-xs text-muted-foreground">Discord kanalına bildirimler gönderir.</p>
        </div>

        {notificationSettings.discordWebhook && (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Discord Webhook URL
            </label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={notificationSettings.discordWebhookUrl}
              onChange={e =>
                setNotificationSettings({
                  ...notificationSettings,
                  discordWebhookUrl: e.target.value,
                })
              }
              placeholder="https://discord.com/api/webhooks/..."
              title="Discord Webhook URL"
              aria-label="Discord Webhook URL"
            />
          </div>
        )}
      </div>
    </div>
  );

  // API ayarları formu
  const apiSettingsForm = (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={apiSettings.rateLimitEnabled}
              onChange={e => setApiSettings({ ...apiSettings, rateLimitEnabled: e.target.checked })}
              title="Rate Limiting"
              aria-label="Rate Limiting"
            />
            <span className="text-sm font-medium leading-none">Rate Limiting</span>
          </label>
          <p className="text-xs text-muted-foreground">
            API çağrıları için hız sınırlamasını etkinleştirir.
          </p>
        </div>

        {apiSettings.rateLimitEnabled && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Rate Limit Değeri
              </label>
              <input
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={apiSettings.rateLimit}
                onChange={e => setApiSettings({ ...apiSettings, rateLimit: e.target.value })}
                title="Rate Limit Değeri"
                placeholder="API çağrı limiti sayısını girin"
                aria-label="Rate Limit Değeri"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Rate Limit Periyodu
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={apiSettings.rateLimitPeriod}
                onChange={e => setApiSettings({ ...apiSettings, rateLimitPeriod: e.target.value })}
                title="Rate Limit Periyodu"
                aria-label="Rate Limit Periyodu"
              >
                <option value="second">Saniye</option>
                <option value="minute">Dakika</option>
                <option value="hour">Saat</option>
                <option value="day">Gün</option>
              </select>
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={apiSettings.corsEnabled}
              onChange={e => setApiSettings({ ...apiSettings, corsEnabled: e.target.checked })}
              title="CORS"
              aria-label="Cross-Origin Resource Sharing"
            />
            <span className="text-sm font-medium leading-none">CORS</span>
          </label>
          <p className="text-xs text-muted-foreground">
            Cross-Origin Resource Sharing'i etkinleştirir.
          </p>
        </div>

        {apiSettings.corsEnabled && (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              İzin Verilen Kaynaklar
            </label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={apiSettings.allowedOrigins}
              onChange={e => setApiSettings({ ...apiSettings, allowedOrigins: e.target.value })}
              placeholder="*"
              title="İzin Verilen Kaynaklar"
              aria-label="İzin Verilen Kaynaklar"
            />
            <p className="text-xs text-muted-foreground">
              Birden çok kaynak için virgülle ayırın veya tümü için * kullanın.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            API Anahtarı Süresi
          </label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={apiSettings.apiKeyExpiration}
            onChange={e => setApiSettings({ ...apiSettings, apiKeyExpiration: e.target.value })}
            title="API Anahtarı Süresi"
            aria-label="API Anahtarı Süresi"
          >
            <option value="never">Asla sona erme</option>
            <option value="30days">30 gün</option>
            <option value="90days">90 gün</option>
            <option value="1year">1 yıl</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.settings')}</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : saved ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saved ? 'Kaydedildi' : 'Kaydet'}
        </Button>
      </div>

      {/* Ayarlar Sekmeleri */}
      <div className="border-b">
        <div className="flex space-x-4">
          <button
            className={`pb-2 pt-2 text-sm font-medium ${
              activeTab === 'general'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('general')}
          >
            {t('admin.generalSettings')}
          </button>
          <button
            className={`pb-2 pt-2 text-sm font-medium ${
              activeTab === 'security'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('security')}
          >
            {t('admin.securitySettings')}
          </button>
          <button
            className={`pb-2 pt-2 text-sm font-medium ${
              activeTab === 'notifications'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            {t('admin.emailSettings')}
          </button>
          <button
            className={`pb-2 pt-2 text-sm font-medium ${
              activeTab === 'api'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('api')}
          >
            {t('admin.apiSettings')}
          </button>
        </div>
      </div>

      {/* Aktif Sekme İçeriği */}
      <div className="py-4">
        {activeTab === 'general' && generalSettingsForm}
        {activeTab === 'security' && securitySettingsForm}
        {activeTab === 'notifications' && notificationSettingsForm}
        {activeTab === 'api' && apiSettingsForm}
      </div>
    </div>
  );
}
