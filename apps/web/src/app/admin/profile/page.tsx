'use client';

import React, { useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  Briefcase,
  Globe,
  Languages,
  Settings,
  Shield,
  FileText,
  Camera,
  Check,
  X,
  Save,
  AlertCircle,
  Laptop,
  Smartphone,
  Tablet,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useI18n } from '@/contexts/i18n-context';
import { cn } from '@/lib/utils';

type TabKey = 'personal' | 'account' | 'security';

interface Language {
  name: string;
  level: string;
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  lastPasswordChange: string;
  lastLogin: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  coverPhoto: string;
  birthday: string;
  address: string;
  company: string;
  position: string;
  bio: string;
  website: string;
  languages: Language[];
  skills: string[];
  notifications: NotificationPreferences;
  security: SecuritySettings;
}

const panelShellClass =
  'relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_45px_90px_rgba(4,6,16,0.55)] backdrop-blur-xl';
const subtleOverlayClass =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.2),transparent_72%),radial-gradient(circle_at_bottom_right,rgba(77,120,255,0.22),transparent_75%)]';
const heroShellClass =
  'relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 shadow-[0_45px_120px_rgba(8,12,32,0.65)] backdrop-blur-2xl';
const heroOverlayClass =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.45),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(77,120,255,0.35),transparent_60%)] opacity-80';
const badgeGlowClass =
  'inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.36em] text-white/60';
const sectionTitleClass = 'text-3xl font-semibold tracking-tight text-white md:text-4xl';
const primaryActionButtonClass =
  'inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/80 px-6 py-2 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,107,44,0.45)] transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50';
const ghostPillButtonClass =
  'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-white/70 transition hover:border-white/35 hover:text-white';
const inputClassname =
  'h-11 rounded-2xl border border-white/12 bg-black/40 text-sm text-white placeholder:text-white/45 focus-visible:border-primary/50 focus-visible:ring-primary/40';
const textareaClassname =
  'rounded-2xl border border-white/12 bg-black/40 text-sm text-white placeholder:text-white/45 focus-visible:border-primary/50 focus-visible:ring-primary/40';
const pillBadgeClass =
  'inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-xs text-white/70';
const tabListClass =
  'relative flex flex-wrap gap-2 rounded-full border border-white/10 bg-black/50 p-2 backdrop-blur-xl shadow-[0_18px_60px_rgba(8,12,32,0.55)]';
const tabTriggerClass =
  'data-[state=active]:text-black data-[state=active]:bg-primary data-[state=active]:shadow-[0_0_30px_rgba(255,107,44,0.45)] rounded-full px-5 py-2 text-sm font-medium text-white/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 hover:text-white';
const iconSwatchClass =
  'flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/70';
const iconOffsetClass = 'absolute left-3 top-1/2 -translate-y-1/2';
const preferenceRowClass =
  'flex items-center justify-between rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-4 text-white/80 shadow-[0_15px_55px_rgba(8,12,32,0.45)] backdrop-blur-xl';
const selectionCardClass =
  'flex flex-col items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.05] p-4 text-white/75 transition hover:border-primary/50 hover:shadow-[0_0_28px_rgba(255,107,44,0.35)]';
const languageCardClass =
  'flex items-center justify-between rounded-2xl border border-white/12 bg-white/[0.05] p-4 text-white/75 transition hover:border-primary/50';
const sectionHeadingClass = 'text-lg font-semibold text-white';
const sectionDescriptionClass = 'text-sm text-white/60';
const sectionTaglineClass = 'text-sm uppercase tracking-[0.4em] text-white/50';
const infoBadgeClass =
  'inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-xs text-emerald-100';
const dangerZoneClass =
  'rounded-3xl border border-rose-500/40 bg-rose-500/10 p-6 text-rose-100 shadow-[0_30px_80px_rgba(244,63,94,0.35)] backdrop-blur-xl';
const listCardClass =
  'rounded-3xl border border-white/12 bg-white/[0.05] p-6 text-white/75 shadow-[0_25px_85px_rgba(8,12,32,0.5)] backdrop-blur-xl';
const deviceCardClass =
  'flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white/75 transition hover:border-primary/40';

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
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut', staggerChildren: 0.05 },
  },
} as const;

const gridVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut', staggerChildren: 0.06 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
} as const;

export default function ProfilePage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TabKey>('personal');
  const [saving, setSaving] = useState(false);

  // Simüle edilmiş kullanıcı profil verisi
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@codexonx.com',
    phone: '+90 532 123 4567',
    avatar: '/assets/images/user.jpg',
    coverPhoto: '/assets/images/cover.jpg',
    birthday: '1985-05-15',
    address: 'Levent, İstanbul, Türkiye',
    company: 'Codexonx Teknoloji A.Ş.',
    position: 'Yazılım Geliştirme Müdürü',
    bio: '10+ yıl tecrübeli yazılım geliştirme uzmanı. Kurumsal yazılım çözümleri, mobil uygulama ve web geliştirme konularında uzmanlaşmış. Agile metodolojilerine hakim, takım liderliği deneyimi mevcut.',
    website: 'https://ahmetyilmaz.dev',
    languages: [
      { name: 'Türkçe', level: 'Ana dil' },
      { name: 'İngilizce', level: 'İleri seviye' },
      { name: 'Almanca', level: 'Orta seviye' },
    ],
    skills: [
      'React',
      'TypeScript',
      'Next.js',
      'Node.js',
      'Express',
      'MongoDB',
      'PostgreSQL',
      'Docker',
      'AWS',
      'CI/CD',
    ],
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false,
    },
    security: {
      twoFactor: true,
      lastPasswordChange: '2023-05-20',
      lastLogin: '2023-06-15 14:32:45',
    },
  });

  const devices = [
    {
      icon: Laptop,
      name: 'Windows PC',
      details: 'Şu an aktif • İstanbul, TR',
    },
    {
      icon: Smartphone,
      name: 'iPhone 13 Pro',
      details: 'Son giriş: 2 gün önce • İstanbul, TR',
    },
    {
      icon: Tablet,
      name: 'iPad Air',
      details: 'Son giriş: 1 hafta önce • İstanbul, TR',
    },
  ] as const;

  // Kullanıcı bilgilerini güncellemek için fonksiyon
  const updateProfile = <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange =
    (field: keyof ProfileData) => (event: ChangeEvent<HTMLInputElement>) => {
      updateProfile(field, event.currentTarget.value);
    };

  const handleTextareaChange =
    (field: keyof ProfileData) => (event: ChangeEvent<HTMLTextAreaElement>) => {
      updateProfile(field, event.currentTarget.value);
    };

  const handleSkillKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    const newSkill = event.currentTarget.value.trim();
    if (!newSkill) {
      return;
    }

    event.preventDefault();
    setProfile(prev => {
      if (prev.skills.includes(newSkill)) {
        return prev;
      }

      return { ...prev, skills: [...prev.skills, newSkill] };
    });
    event.currentTarget.value = '';
  };

  // Form submit fonksiyonu
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    // Burada gerçek uygulamada API çağrısı olacak
    setTimeout(() => {
      setSaving(false);

      // Başarılı bildirim göster
      toast({
        title: t('profile.savedSuccess'),
        description: t('profile.profileUpdated'),
      });
    }, 1500);
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={sectionVariants} className={heroShellClass}>
        <div className={heroOverlayClass} />
        <div className="relative flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between">
          <motion.div variants={itemVariants} className="space-y-4">
            <span className={badgeGlowClass}>Codexonx</span>
            <h1 className={sectionTitleClass}>{t('profile.title')}</h1>
            <p className="max-w-2xl text-sm text-white/65">{t('profile.subtitle')}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex gap-3">
            <button type="button" className={ghostPillButtonClass}>
              <Camera className="h-4 w-4" />
              {t('profile.changeCover')}
            </button>
            <Button
              onClick={() => undefined}
              disabled={saving}
              className={primaryActionButtonClass}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/60 border-t-transparent" />
                  {t('profile.saving')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {t('profile.saveChanges')}
                </span>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Profil Kapak ve Avatar */}
      <motion.div variants={sectionVariants} className="relative">
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-[0_30px_90px_rgba(8,12,32,0.55)]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,107,44,0.25),rgba(40,40,74,0.8))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_65%)]" />
          <div className="relative flex h-full items-center justify-center">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">
              {t('profile.coverPhoto')}
            </p>
          </div>
        </div>

        <div className="absolute -bottom-12 left-10">
          <div className="relative">
            <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white/20 bg-black/70 shadow-[0_20px_60px_rgba(8,12,32,0.6)] backdrop-blur-xl">
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-14 w-14 text-white/50" />
              </div>
            </div>
            <button
              type="button"
              aria-label={t('profile.changeAvatar') ?? 'Avatarı değiştir'}
              className="absolute -bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full border border-primary/60 bg-primary/90 text-black shadow-[0_0_25px_rgba(255,107,44,0.45)] transition hover:-translate-y-0.5"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* İsim ve Rol */}
      <motion.div
        variants={sectionVariants}
        className="mt-16 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-white">{profile.name}</h2>
          <p className="text-sm text-white/60">
            {profile.position} @ {profile.company}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={cn(pillBadgeClass, 'uppercase tracking-[0.3em] text-white/70')}>
            Admin
          </Badge>
          <Badge
            className={cn(
              pillBadgeClass,
              'border-primary/60 bg-primary/20 text-primary-foreground'
            )}
          >
            {t('profile.verified')}
          </Badge>
        </div>
      </motion.div>

      {/* Sekmeler */}
      <motion.div variants={sectionVariants}>
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value: string) => setActiveTab(value as TabKey)}
          className="w-full space-y-6"
        >
          <TabsList className={tabListClass}>
            <TabsTrigger className={tabTriggerClass} value="personal">
              {t('profile.personalInfo')}
            </TabsTrigger>
            <TabsTrigger className={tabTriggerClass} value="account">
              {t('profile.account')}
            </TabsTrigger>
            <TabsTrigger className={tabTriggerClass} value="security">
              {t('profile.security')}
            </TabsTrigger>
          </TabsList>

          {/* Kişisel Bilgiler Sekmesi */}
          <TabsContent value="personal" className="space-y-6">
            <motion.form
              onSubmit={handleSubmit}
              variants={formVariants}
              className={cn(panelShellClass, 'p-8')}
            >
              <div className={subtleOverlayClass} />
              <div className="relative space-y-8">
                <motion.div variants={itemVariants} className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">{t('profile.personalInfo')}</h3>
                  <p className="text-sm text-white/60">{t('profile.personalInfoDesc')}</p>
                </motion.div>

                <motion.div
                  variants={gridVariants}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="name" className="text-white/80">
                      {t('profile.fullName')}
                    </Label>
                    <div className="relative">
                      <span className={cn(iconSwatchClass, iconOffsetClass)}>
                        <User className="h-4 w-4" />
                      </span>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={handleInputChange('name')}
                        className={cn(inputClassname, 'pl-12')}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="email" className="text-white/80">
                      {t('profile.email')}
                    </Label>
                    <div className="relative">
                      <span className={cn(iconSwatchClass, iconOffsetClass)}>
                        <Mail className="h-4 w-4" />
                      </span>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={handleInputChange('email')}
                        className={cn(inputClassname, 'pl-12')}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="phone" className="text-white/80">
                      {t('profile.phone')}
                    </Label>
                    <div className="relative">
                      <span className={cn(iconSwatchClass, iconOffsetClass)}>
                        <Phone className="h-4 w-4" />
                      </span>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={handleInputChange('phone')}
                        className={cn(inputClassname, 'pl-12')}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="birthday" className="text-white/80">
                      {t('profile.birthday')}
                    </Label>
                    <div className="relative">
                      <span className={cn(iconSwatchClass, iconOffsetClass)}>
                        <Calendar className="h-4 w-4" />
                      </span>
                      <Input
                        id="birthday"
                        type="date"
                        value={profile.birthday}
                        onChange={handleInputChange('birthday')}
                        className={cn(inputClassname, 'pl-12')}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="address" className="text-white/80">
                      {t('profile.address')}
                    </Label>
                    <div className="relative">
                      <span className={cn(iconSwatchClass, iconOffsetClass)}>
                        <MapPin className="h-4 w-4" />
                      </span>
                      <Input
                        id="address"
                        value={profile.address}
                        onChange={handleInputChange('address')}
                        className={cn(inputClassname, 'pl-12')}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="website" className="text-white/80">
                      {t('profile.website')}
                    </Label>
                    <div className="relative">
                      <span className={cn(iconSwatchClass, iconOffsetClass)}>
                        <Globe className="h-4 w-4" />
                      </span>
                      <Input
                        id="website"
                        value={profile.website}
                        onChange={handleInputChange('website')}
                        className={cn(inputClassname, 'pl-12')}
                      />
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={gridVariants}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="company" className="text-white/80">
                      {t('profile.company')}
                    </Label>
                    <div className="relative">
                      <span className={cn(iconSwatchClass, iconOffsetClass)}>
                        <Building className="h-4 w-4" />
                      </span>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={handleInputChange('company')}
                        className={cn(inputClassname, 'pl-12')}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="position" className="text-white/80">
                      {t('profile.position')}
                    </Label>
                    <div className="relative">
                      <span className={cn(iconSwatchClass, iconOffsetClass)}>
                        <Briefcase className="h-4 w-4" />
                      </span>
                      <Input
                        id="position"
                        value={profile.position}
                        onChange={handleInputChange('position')}
                        className={cn(inputClassname, 'pl-12')}
                      />
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="bio" className="text-white/80">
                    {t('profile.bio')}
                  </Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={handleTextareaChange('bio')}
                    className={cn(textareaClassname, 'min-h-[160px]')}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <Label className="text-white/80">{t('profile.skills')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                      <span
                        key={skill}
                        className={cn(pillBadgeClass, 'bg-white/[0.12] text-white')}
                      >
                        {skill}
                        <button
                          type="button"
                          title={t('profile.removeSkill') ?? 'Sil'}
                          aria-label={t('profile.removeSkill') ?? 'Sil'}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <Input
                      placeholder={t('profile.addSkill')}
                      className={cn(inputClassname, 'h-10 w-48')}
                      onKeyDown={handleSkillKeyDown}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-end">
                  <Button type="submit" disabled={saving} className={primaryActionButtonClass}>
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/60 border-t-transparent" />
                        {t('profile.saving')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {t('profile.saveChanges')}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.form>
          </TabsContent>

          {/* Hesap Sekmesi */}
          <TabsContent value="account" className="space-y-6">
            <motion.div variants={formVariants} className={cn(panelShellClass, 'p-8')}>
              <div className={subtleOverlayClass} />
              <div className="relative space-y-8">
                <motion.div variants={itemVariants} className="space-y-2">
                  <h3 className={sectionHeadingClass}>{t('profile.accountSettings')}</h3>
                  <p className={sectionDescriptionClass}>{t('profile.accountSettingsDesc')}</p>
                </motion.div>

                <motion.div variants={gridVariants} className="space-y-4">
                  <span className="text-sm uppercase tracking-[0.4em] text-white/50">
                    {t('profile.notifications')}
                  </span>

                  {[
                    {
                      id: 'email-notifications',
                      label: t('profile.emailNotifications'),
                      description: t('profile.emailNotificationsDesc'),
                      checked: profile.notifications.email,
                      onToggle: (checked: boolean) =>
                        setProfile(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: checked },
                        })),
                    },
                    {
                      id: 'sms-notifications',
                      label: t('profile.smsNotifications'),
                      description: t('profile.smsNotificationsDesc'),
                      checked: profile.notifications.sms,
                      onToggle: (checked: boolean) =>
                        setProfile(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, sms: checked },
                        })),
                    },
                    {
                      id: 'push-notifications',
                      label: t('profile.pushNotifications'),
                      description: t('profile.pushNotificationsDesc'),
                      checked: profile.notifications.push,
                      onToggle: (checked: boolean) =>
                        setProfile(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, push: checked },
                        })),
                    },
                    {
                      id: 'marketing-notifications',
                      label: t('profile.marketingNotifications'),
                      description: t('profile.marketingNotificationsDesc'),
                      checked: profile.notifications.marketing,
                      onToggle: (checked: boolean) =>
                        setProfile(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, marketing: checked },
                        })),
                    },
                  ].map(preference => (
                    <motion.div
                      key={preference.id}
                      variants={itemVariants}
                      className={preferenceRowClass}
                    >
                      <div className="max-w-lg space-y-1">
                        <Label htmlFor={preference.id} className="text-sm font-semibold text-white">
                          {preference.label}
                        </Label>
                        <p className="text-xs text-white/55">{preference.description}</p>
                      </div>
                      <Switch
                        id={preference.id}
                        checked={preference.checked}
                        onCheckedChange={preference.onToggle}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <span className={sectionTaglineClass}>{t('profile.appearance')}</span>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {[t('profile.system'), t('profile.light'), t('profile.dark')].map(
                      (mode, index) => (
                        <button
                          key={mode}
                          type="button"
                          className={cn(
                            selectionCardClass,
                            index === 1 && 'border-primary/60 bg-primary/15 text-white'
                          )}
                        >
                          <div className="flex h-20 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                            <div className="h-8 w-1/2 rounded-xl bg-white/20" />
                          </div>
                          <span className="text-sm font-medium">{mode}</span>
                        </button>
                      )
                    )}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <span className={sectionTaglineClass}>{t('profile.language')}</span>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {[
                      { code: 'T', label: 'Türkçe', active: true },
                      { code: 'E', label: 'English', active: false },
                    ].map(language => (
                      <button
                        key={language.label}
                        type="button"
                        className={cn(
                          languageCardClass,
                          language.active && 'border-primary/60 bg-primary/15 text-white'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/15 text-xs font-semibold">
                            {language.code}
                          </div>
                          <span className="text-sm font-medium">{language.label}</span>
                        </div>
                        {language.active && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-end">
                  <Button className={primaryActionButtonClass}>
                    <Save className="h-4 w-4" />
                    {t('profile.saveChanges')}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Güvenlik Sekmesi */}
          <TabsContent value="security" className="space-y-6">
            <motion.div variants={formVariants} className={cn(panelShellClass, 'p-8 space-y-8')}>
              <div className={subtleOverlayClass} />
              <div className="relative space-y-8">
                <motion.div variants={itemVariants} className="space-y-2">
                  <h3 className={sectionHeadingClass}>{t('profile.securitySettings')}</h3>
                  <p className={sectionDescriptionClass}>{t('profile.securitySettingsDesc')}</p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <span className={sectionTaglineClass}>{t('profile.passwordSecurity')}</span>
                  <div className={preferenceRowClass}>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white">
                        {t('profile.changePassword')}
                      </h4>
                      <p className="text-xs text-white/55">
                        {t('profile.lastPasswordChange')}: {profile.security.lastPasswordChange}
                      </p>
                    </div>
                    <Button variant="outline" className={cn(ghostPillButtonClass, 'text-white')}>
                      {t('profile.changePassword')}
                    </Button>
                  </div>

                  <div className={preferenceRowClass}>
                    <div className="space-y-1">
                      <Label htmlFor="two-factor" className="text-sm font-semibold text-white">
                        {t('profile.twoFactor')}
                      </Label>
                      <p className="text-xs text-white/55">{t('profile.twoFactorDesc')}</p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={profile.security.twoFactor}
                      onCheckedChange={checked => {
                        setProfile(prev => ({
                          ...prev,
                          security: { ...prev.security, twoFactor: checked },
                        }));
                      }}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <span className={sectionTaglineClass}>{t('profile.loginActivity')}</span>
                  <div className={listCardClass}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">
                          {t('profile.currentSession')}
                        </p>
                        <p className="text-xs text-white/55">
                          {t('profile.lastLogin')}: {profile.security.lastLogin}
                        </p>
                      </div>
                      <span className={infoBadgeClass}>
                        <Check className="h-3 w-3" />
                        {t('profile.active')}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                      <Globe className="h-4 w-4 text-white/40" />
                      <span>Chrome on Windows • İstanbul, Türkiye</span>
                    </div>
                  </div>
                  <Button variant="outline" className={ghostPillButtonClass}>
                    {t('profile.viewAllSessions')}
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <span className={sectionTaglineClass}>{t('profile.deviceManagement')}</span>
                  <div className="space-y-3">
                    {devices.map(device => (
                      <div key={device.name} className={deviceCardClass}>
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.07]">
                            <device.icon className="h-5 w-5 text-white/60" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-white">{device.name}</p>
                            <p className="text-xs text-white/55">{device.details}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className={ghostPillButtonClass}>
                          {t('profile.removeDevice')}
                        </Button>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className={dangerZoneClass}>
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-5 w-5 text-rose-200" />
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">{t('profile.dangerZone')}</h3>
                      <p className="text-xs text-rose-100/80">
                        {t('profile.accountDeletionWarning')}
                      </p>
                      <Button variant="destructive" size="sm">
                        {t('profile.deleteAccount')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <Toaster />
    </motion.div>
  );
}
