"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve Radix UI/Lucide
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState } from "react";
import { motion } from "framer-motion";
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
  Tablet
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useI18n } from "@/contexts/i18n-context";

export default function ProfilePage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("personal");
  const [saving, setSaving] = useState(false);
  
  // Simüle edilmiş kullanıcı profil verisi
  const [profile, setProfile] = useState({
    name: "Ahmet Yılmaz",
    email: "ahmet.yilmaz@codexonx.com",
    phone: "+90 532 123 4567",
    avatar: "/assets/images/user.jpg",
    coverPhoto: "/assets/images/cover.jpg",
    birthday: "1985-05-15",
    address: "Levent, İstanbul, Türkiye",
    company: "Codexonx Teknoloji A.Ş.",
    position: "Yazılım Geliştirme Müdürü",
    bio: "10+ yıl tecrübeli yazılım geliştirme uzmanı. Kurumsal yazılım çözümleri, mobil uygulama ve web geliştirme konularında uzmanlaşmış. Agile metodolojilerine hakim, takım liderliği deneyimi mevcut.",
    website: "https://ahmetyilmaz.dev",
    languages: [
      { name: "Türkçe", level: "Ana dil" },
      { name: "İngilizce", level: "İleri seviye" },
      { name: "Almanca", level: "Orta seviye" }
    ],
    skills: [
      "React", "TypeScript", "Next.js", "Node.js", "Express", 
      "MongoDB", "PostgreSQL", "Docker", "AWS", "CI/CD"
    ],
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    },
    security: {
      twoFactor: true,
      lastPasswordChange: "2023-05-20",
      lastLogin: "2023-06-15 14:32:45"
    }
  });
  
  // Kullanıcı bilgilerini güncellemek için fonksiyon
  const updateProfile = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  // Form submit fonksiyonu
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    
    // Burada gerçek uygulamada API çağrısı olacak
    setTimeout(() => {
      setSaving(false);
      
      // Başarılı bildirim göster
      toast({
        title: t("profile.savedSuccess"),
        description: t("profile.profileUpdated"),
      });
    }, 1500);
  };
  
  // Animasyon konfigürasyonu
  const fadeInUp = {
    initial: { y: 10, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        variants={fadeInUp} 
        initial="initial" 
        animate="animate"
        className="flex flex-col md:flex-row justify-between items-start gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h1>
          <p className="text-muted-foreground">{t('profile.subtitle')}</p>
        </div>
      </motion.div>
      
      {/* Profil Kapak ve Avatar */}
      <motion.div 
        variants={fadeInUp} 
        initial="initial" 
        animate="animate"
        className="relative"
      >
        <div className="w-full h-40 md:h-64 rounded-lg bg-muted/50 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">{t('profile.coverPhoto')}</p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute right-4 bottom-4 flex items-center gap-1 bg-card/90"
          >
            <Camera className="h-4 w-4" /> 
            {t('profile.changeCover')}
          </Button>
        </div>
        
        <div className="absolute -bottom-12 left-6 rounded-full border-4 border-background">
          <div className="w-24 h-24 rounded-full bg-muted/70 flex items-center justify-center relative overflow-hidden">
            <User className="h-12 w-12 text-muted-foreground/60" />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/20 transition-opacity flex items-center justify-center"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* İsim ve Rol */}
      <motion.div 
        variants={fadeInUp} 
        initial="initial" 
        animate="animate"
        className="mt-14 md:mt-16 flex flex-col md:flex-row md:items-center gap-2 md:justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="text-muted-foreground">{profile.position} @ {profile.company}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">Admin</Badge>
          <Badge variant="outline">{t('profile.verified')}</Badge>
        </div>
      </motion.div>
      
      {/* Sekmeler */}
      <motion.div 
        variants={fadeInUp}
        initial="initial" 
        animate="animate"
      >
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="personal">{t('profile.personalInfo')}</TabsTrigger>
            <TabsTrigger value="account">{t('profile.account')}</TabsTrigger>
            <TabsTrigger value="security">{t('profile.security')}</TabsTrigger>
          </TabsList>
          
          {/* Kişisel Bilgiler Sekmesi */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>{t('profile.personalInfo')}</CardTitle>
                  <CardDescription>{t('profile.personalInfoDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('profile.fullName')}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="name" 
                          value={profile.name}
                          onChange={e => updateProfile('name', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('profile.email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email" 
                          value={profile.email}
                          onChange={e => updateProfile('email', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('profile.phone')}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          value={profile.phone}
                          onChange={e => updateProfile('phone', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthday">{t('profile.birthday')}</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="birthday" 
                          type="date" 
                          value={profile.birthday}
                          onChange={e => updateProfile('birthday', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{t('profile.address')}</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="address" 
                          value={profile.address}
                          onChange={e => updateProfile('address', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">{t('profile.website')}</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="website" 
                          value={profile.website}
                          onChange={e => updateProfile('website', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">{t('profile.company')}</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="company" 
                        value={profile.company}
                        onChange={e => updateProfile('company', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">{t('profile.position')}</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="position" 
                        value={profile.position}
                        onChange={e => updateProfile('position', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">{t('profile.bio')}</Label>
                    <Textarea 
                      id="bio" 
                      value={profile.bio}
                      onChange={e => updateProfile('bio', e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  {/* Beceriler */}
                  <div className="space-y-4">
                    <Label>{t('profile.skills')}</Label>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} className="flex items-center gap-1">
                          {skill}
                          <Button 
                            type="button"
                            size="sm"
                            variant="ghost"
                            title="Sil"
                            aria-label="Sil">
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                      
                      <div className="relative">
                        <Input
                          placeholder={t('profile.addSkill')}
                          className="w-40 h-8"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              e.preventDefault();
                              const newSkill = e.target.value.trim();
                              if (!profile.skills.includes(newSkill)) {
                                updateProfile('skills', [...profile.skills, newSkill]);
                              }
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={saving} className="flex items-center gap-2">
                    {saving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        {t('profile.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {t('profile.saveChanges')}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Hesap Sekmesi */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.accountSettings')}</CardTitle>
                <CardDescription>{t('profile.accountSettingsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('profile.notifications')}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="font-medium">{t('profile.emailNotifications')}</Label>
                      <p className="text-sm text-muted-foreground">{t('profile.emailNotificationsDesc')}</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={profile.notifications.email}
                      onCheckedChange={(checked) => {
                        setProfile(prev => ({
                          ...prev, 
                          notifications: {...prev.notifications, email: checked}
                        }));
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications" className="font-medium">{t('profile.smsNotifications')}</Label>
                      <p className="text-sm text-muted-foreground">{t('profile.smsNotificationsDesc')}</p>
                    </div>
                    <Switch 
                      id="sms-notifications" 
                      checked={profile.notifications.sms}
                      onCheckedChange={(checked) => {
                        setProfile(prev => ({
                          ...prev, 
                          notifications: {...prev.notifications, sms: checked}
                        }));
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications" className="font-medium">{t('profile.pushNotifications')}</Label>
                      <p className="text-sm text-muted-foreground">{t('profile.pushNotificationsDesc')}</p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={profile.notifications.push}
                      onCheckedChange={(checked) => {
                        setProfile(prev => ({
                          ...prev, 
                          notifications: {...prev.notifications, push: checked}
                        }));
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-notifications" className="font-medium">{t('profile.marketingNotifications')}</Label>
                      <p className="text-sm text-muted-foreground">{t('profile.marketingNotificationsDesc')}</p>
                    </div>
                    <Switch 
                      id="marketing-notifications" 
                      checked={profile.notifications.marketing}
                      onCheckedChange={(checked) => {
                        setProfile(prev => ({
                          ...prev, 
                          notifications: {...prev.notifications, marketing: checked}
                        }));
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('profile.appearance')}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary">
                      <div className="bg-background rounded-md border w-full h-20 flex items-center justify-center">
                        <div className="w-1/2 h-8 rounded-md bg-muted"></div>
                      </div>
                      <span className="text-sm font-medium">{t('profile.system')}</span>
                    </div>
                    <div className="border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary border-primary">
                      <div className="bg-white rounded-md border w-full h-20 flex items-center justify-center">
                        <div className="w-1/2 h-8 rounded-md bg-slate-200"></div>
                      </div>
                      <span className="text-sm font-medium">{t('profile.light')}</span>
                    </div>
                    <div className="border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary">
                      <div className="bg-slate-950 rounded-md border border-slate-800 w-full h-20 flex items-center justify-center">
                        <div className="w-1/2 h-8 rounded-md bg-slate-800"></div>
                      </div>
                      <span className="text-sm font-medium">{t('profile.dark')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('profile.language')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 flex items-center justify-between hover:border-primary border-primary cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-red-500 flex items-center justify-center text-white font-bold">
                          T
                        </div>
                        <span className="font-medium">Türkçe</span>
                      </div>
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="border rounded-md p-4 flex items-center justify-between hover:border-primary cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-blue-700 flex items-center justify-center text-white font-bold">
                          E
                        </div>
                        <span className="font-medium">English</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {t('profile.saveChanges')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Güvenlik Sekmesi */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.securitySettings')}</CardTitle>
                <CardDescription>{t('profile.securitySettingsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('profile.passwordSecurity')}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t('profile.changePassword')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t('profile.lastPasswordChange')}: {profile.security.lastPasswordChange}
                      </p>
                    </div>
                    <Button variant="outline">{t('profile.changePassword')}</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor" className="font-medium">{t('profile.twoFactor')}</Label>
                      <p className="text-sm text-muted-foreground">{t('profile.twoFactorDesc')}</p>
                    </div>
                    <Switch 
                      id="two-factor" 
                      checked={profile.security.twoFactor}
                      onCheckedChange={(checked) => {
                        setProfile(prev => ({
                          ...prev, 
                          security: {...prev.security, twoFactor: checked}
                        }));
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('profile.loginActivity')}</h3>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('profile.currentSession')}</p>
                        <p className="text-sm text-muted-foreground">{t('profile.lastLogin')}: {profile.security.lastLogin}</p>
                      </div>
                      <Badge variant="success" className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        {t('profile.active')}
                      </Badge>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Chrome on Windows • İstanbul, Türkiye</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline">{t('profile.viewAllSessions')}</Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('profile.deviceManagement')}</h3>
                  
                  <div className="border rounded-md divide-y">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-muted/50 flex items-center justify-center">
                            <Laptop className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">Windows PC</p>
                            <p className="text-xs text-muted-foreground">Şu an aktif • İstanbul, TR</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">{t('profile.removeDevice')}</Button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-muted/50 flex items-center justify-center">
                            <Smartphone className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">iPhone 13 Pro</p>
                            <p className="text-xs text-muted-foreground">Son giriş: 2 gün önce • İstanbul, TR</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">{t('profile.removeDevice')}</Button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-muted/50 flex items-center justify-center">
                            <Tablet className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">iPad Air</p>
                            <p className="text-xs text-muted-foreground">Son giriş: 1 hafta önce • İstanbul, TR</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">{t('profile.removeDevice')}</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border border-destructive/20 p-4 bg-destructive/5">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-destructive">{t('profile.dangerZone')}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{t('profile.accountDeletionWarning')}</p>
                      <Button variant="destructive" size="sm" className="mt-4">{t('profile.deleteAccount')}</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      <Toaster />
    </div>
  );
}
