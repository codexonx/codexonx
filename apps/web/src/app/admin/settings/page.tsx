'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18n-context';
import { cn } from '@/lib/utils';

const cardShellClass =
  'relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_45px_90px_rgba(4,6,16,0.55)] backdrop-blur-xl';
const subtleOverlayClass =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.2),transparent_72%),radial-gradient(circle_at_bottom_right,rgba(84,120,255,0.2),transparent_75%)]';
const sectionBadgeClass =
  'inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.4em] text-white/50';
const tabButtonBaseClass =
  'relative flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-white/70 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white';
const tabButtonActiveClass =
  'border-primary/60 bg-primary/25 text-white shadow-[0_0_28px_rgba(255,107,44,0.35)]';
const inputClass =
  'h-11 w-full rounded-2xl border border-white/12 bg-black/40 px-4 text-sm text-white placeholder:text-white/50 transition focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/35';
const textareaClass =
  'min-h-[120px] w-full rounded-2xl border border-white/12 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/50 transition focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/35';
const checkboxClass =
  'h-4 w-4 rounded border-white/20 bg-black/50 text-primary focus:ring-primary/50 focus:ring-offset-0';
const selectClass =
  'h-11 w-full rounded-2xl border border-white/12 bg-black/40 px-4 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/35';
const hintClass = 'text-xs text-white/45';
const labelClass = 'text-sm font-medium text-white/80';
const primaryActionButtonClass =
  'relative inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/80 px-5 py-2 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,107,44,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.08, delayChildren: 0.08 },
  },
} as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
} as const;

const formVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
} as const;

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
    <motion.div
      className={cn(cardShellClass, 'p-8 shadow-[0_35px_120px_rgba(8,12,32,0.65)]')}
      variants={sectionVariants}
    >
      <div className={subtleOverlayClass} />
      <motion.div className="relative space-y-6" variants={formVariants}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClass}>Site Adı</label>
            <input
              type="text"
              className={inputClass}
              value={generalSettings.siteName}
              onChange={e =>
                setGeneralSettings({
                  ...generalSettings,
                  siteName: e.target.value,
                })
              }
              title="Site Adı"
              placeholder="Site adını girin"
              aria-label="Site Adı"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Site Açıklaması</label>
            <textarea
              className={textareaClass}
              rows={4}
              value={generalSettings.siteDescription}
              onChange={e =>
                setGeneralSettings({
                  ...generalSettings,
                  siteDescription: e.target.value,
                })
              }
              title="Site Açıklaması"
              placeholder="Site açıklamasını girin"
              aria-label="Site Açıklaması"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Şirket Adı</label>
            <input
              type="text"
              className={inputClass}
              value={generalSettings.companyName}
              onChange={e =>
                setGeneralSettings({
                  ...generalSettings,
                  companyName: e.target.value,
                })
              }
              title="Şirket Adı"
              placeholder="Şirket adını girin"
              aria-label="Şirket Adı"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Şirket E-posta</label>
            <input
              type="email"
              className={inputClass}
              value={generalSettings.companyEmail}
              onChange={e =>
                setGeneralSettings({
                  ...generalSettings,
                  companyEmail: e.target.value,
                })
              }
              title="Şirket E-posta"
              placeholder="Şirket e-posta adresini girin"
              aria-label="Şirket E-posta"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Şirket Telefonu</label>
            <input
              type="tel"
              className={inputClass}
              value={generalSettings.companyPhone}
              onChange={e =>
                setGeneralSettings({
                  ...generalSettings,
                  companyPhone: e.target.value,
                })
              }
              title="Şirket Telefonu"
              placeholder="Şirket telefon numarasını girin"
              aria-label="Şirket Telefonu"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Şirket Adresi</label>
            <input
              type="text"
              className={inputClass}
              value={generalSettings.companyAddress}
              onChange={e =>
                setGeneralSettings({
                  ...generalSettings,
                  companyAddress: e.target.value,
                })
              }
              title="Şirket Adresi"
              placeholder="Şirket adresini girin"
              aria-label="Şirket Adresi"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Güvenlik ayarları formu
  const securitySettingsForm = (
    <motion.div
      className={cn(cardShellClass, 'p-8 shadow-[0_35px_120px_rgba(8,12,32,0.65)]')}
      variants={sectionVariants}
    >
      <div className={subtleOverlayClass} />
      <motion.div className="relative space-y-6" variants={formVariants}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className={checkboxClass}
                checked={securitySettings.requireMFA}
                onChange={e =>
                  setSecuritySettings({ ...securitySettings, requireMFA: e.target.checked })
                }
                title="İki Faktörlü Kimlik Doğrulamayı Zorunlu Tut"
                aria-label="İki Faktörlü Kimlik Doğrulamayı Zorunlu Tut"
              />
              <span className={labelClass}>İki Faktörlü Kimlik Doğrulamayı Zorunlu Tut</span>
            </label>
            <p className={hintClass}>Tüm kullanıcılar için MFA'yı zorunlu kılar.</p>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Oturum Zaman Aşımı (dakika)</label>
            <input
              type="number"
              className={inputClass}
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
            <label className={labelClass}>Şifre Politikası</label>
            <select
              className={selectClass}
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
            <label className={labelClass}>Maksimum Giriş Denemesi</label>
            <input
              type="number"
              className={inputClass}
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
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className={checkboxClass}
                checked={securitySettings.ipRestriction}
                onChange={e =>
                  setSecuritySettings({
                    ...securitySettings,
                    ipRestriction: e.target.checked,
                  })
                }
                title="IP Kısıtlamasını Etkinleştir"
                aria-label="IP Kısıtlamasını Etkinleştir"
              />
              <span className={labelClass}>IP Kısıtlamasını Etkinleştir</span>
            </label>
            <p className={hintClass}>
              Kullanıcıların yalnızca belirli IP adreslerinden erişim sağlamasına izin verir.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Bildirim ayarları formu
  const notificationSettingsForm = (
    <motion.div
      className={cn(cardShellClass, 'p-8 shadow-[0_35px_120px_rgba(8,12,32,0.65)]')}
      variants={sectionVariants}
    >
      <div className={subtleOverlayClass} />
      <motion.div className="relative space-y-6" variants={formVariants}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className={checkboxClass}
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
              <span className={labelClass}>E-posta Bildirimleri</span>
            </label>
            <p className={hintClass}>Sistem bildirimleri için e-posta gönderimini etkinleştirir.</p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className={checkboxClass}
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
              <span className={labelClass}>Slack Entegrasyonu</span>
            </label>
            <p className={hintClass}>Önemli bildirimleri Slack kanalına gönderir.</p>
          </div>

          {notificationSettings.slackIntegration && (
            <div className="col-span-2 space-y-2">
              <label className={labelClass}>Slack Webhook URL</label>
              <input
                type="text"
                className={inputClass}
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
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className={checkboxClass}
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
              <span className={labelClass}>Telegram Bot</span>
            </label>
            <p className={hintClass}>Bildirimler için Telegram bot entegrasyonu.</p>
          </div>

          {notificationSettings.telegramBot && (
            <div className="space-y-2">
              <label className={labelClass}>Telegram Bot Token</label>
              <input
                type="text"
                className={inputClass}
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
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className={checkboxClass}
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
              <span className={labelClass}>Discord Webhook</span>
            </label>
            <p className={hintClass}>Discord kanalına bildirimler gönderir.</p>
          </div>

          {notificationSettings.discordWebhook && (
            <div className="space-y-2">
              <label className={labelClass}>Discord Webhook URL</label>
              <input
                type="text"
                className={inputClass}
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
      </motion.div>
    </motion.div>
  );

  // API ayarları formu
  const apiSettingsForm = (
    <motion.div
      className={cn(cardShellClass, 'p-8 shadow-[0_35px_120px_rgba(8,12,32,0.65)]')}
      variants={sectionVariants}
    >
      <div className={subtleOverlayClass} />
      <motion.div className="relative space-y-6" variants={formVariants}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className={checkboxClass}
                checked={apiSettings.rateLimitEnabled}
                onChange={e =>
                  setApiSettings({ ...apiSettings, rateLimitEnabled: e.target.checked })
                }
                title="Rate Limiting"
                aria-label="Rate Limiting"
              />
              <span className={labelClass}>Rate Limiting</span>
            </label>
            <p className={hintClass}>API çağrıları için hız sınırlamasını etkinleştirir.</p>
          </div>

          {apiSettings.rateLimitEnabled && (
            <>
              <div className="space-y-2">
                <label className={labelClass}>Rate Limit Değeri</label>
                <input
                  type="number"
                  className={inputClass}
                  value={apiSettings.rateLimit}
                  onChange={e => setApiSettings({ ...apiSettings, rateLimit: e.target.value })}
                  title="Rate Limit Değeri"
                  placeholder="API çağrı limiti sayısını girin"
                  aria-label="Rate Limit Değeri"
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Rate Limit Periyodu</label>
                <select
                  className={selectClass}
                  value={apiSettings.rateLimitPeriod}
                  onChange={e =>
                    setApiSettings({ ...apiSettings, rateLimitPeriod: e.target.value })
                  }
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
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className={checkboxClass}
                checked={apiSettings.corsEnabled}
                onChange={e => setApiSettings({ ...apiSettings, corsEnabled: e.target.checked })}
                title="CORS"
                aria-label="Cross-Origin Resource Sharing"
              />
              <span className={labelClass}>CORS</span>
            </label>
            <p className={hintClass}>Cross-Origin Resource Sharing'i etkinleştirir.</p>
          </div>

          {apiSettings.corsEnabled && (
            <div className="space-y-2">
              <label className={labelClass}>İzin Verilen Kaynaklar</label>
              <input
                type="text"
                className={inputClass}
                value={apiSettings.allowedOrigins}
                onChange={e => setApiSettings({ ...apiSettings, allowedOrigins: e.target.value })}
                placeholder="*"
                title="İzin Verilen Kaynaklar"
                aria-label="İzin Verilen Kaynaklar"
              />
              <p className={hintClass}>
                Birden çok kaynak için virgülle ayırın veya tümü için * kullanın.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className={labelClass}>API Anahtarı Süresi</label>
            <select
              className={selectClass}
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
      </motion.div>
    </motion.div>
  );

  const tabs = [
    { id: 'general', label: t('admin.generalSettings') },
    { id: 'security', label: t('admin.securitySettings') },
    { id: 'notifications', label: t('admin.emailSettings') },
    { id: 'api', label: t('admin.apiSettings') },
  ] as const;

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants} className="space-y-8">
      <motion.div
        variants={sectionVariants}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 px-6 py-8 shadow-[0_35px_120px_rgba(8,12,32,0.7)] backdrop-blur-2xl"
      >
        <div className={subtleOverlayClass} />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <span className={sectionBadgeClass}>Codexonx</span>
            <motion.h1
              className="text-3xl font-semibold tracking-tight text-white md:text-4xl"
              variants={formVariants}
            >
              {t('admin.settings')}
            </motion.h1>
            <motion.p className="max-w-2xl text-sm text-white/60" variants={formVariants}>
              Platform yönetimi için genel, güvenlik, bildirim ve API yapılandırmalarını tek
              noktadan özelleştirin. Yaptığınız değişiklikler canlı ortamı etkileyebilir.
            </motion.p>
          </div>
          <motion.div variants={formVariants}>
            <Button onClick={handleSave} disabled={saving} className={primaryActionButtonClass}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/70 border-t-transparent" />
                  Kaydediliyor...
                </span>
              ) : saved ? (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Kaydedildi
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Değişiklikleri Kaydet
                </span>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        variants={sectionVariants}
        className="flex flex-wrap gap-3 rounded-3xl border border-white/10 bg-black/30 p-4 shadow-[0_20px_70px_rgba(8,12,32,0.6)] backdrop-blur-2xl"
      >
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(tabButtonBaseClass, activeTab === tab.id && tabButtonActiveClass)}
            variants={formVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              {String(tab.id).slice(0, 3)}
            </span>
            <span className="text-sm font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.div className="space-y-6" variants={sectionVariants}>
        {activeTab === 'general' && generalSettingsForm}
        {activeTab === 'security' && securitySettingsForm}
        {activeTab === 'notifications' && notificationSettingsForm}
        {activeTab === 'api' && apiSettingsForm}
      </motion.div>
    </motion.div>
  );
}
