'use client';

import { cn } from '@/lib/utils';

import React, { useState, type ChangeEvent, type HTMLAttributes } from 'react';
import Image from 'next/image';
import {
  User,
  Bell,
  Shield,
  Code,
  Laptop,
  Moon,
  Sun,
  Globe,
  Edit,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  updates: boolean;
  newsletter: boolean;
}

interface ProfileSettings {
  name: string;
  email: string;
  bio: string;
  github: string;
  twitter: string;
  linkedin: string;
}

type WordWrapOption = 'on' | 'off' | 'wordWrapColumn';

interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: WordWrapOption;
  lineNumbers: boolean;
  autoSave: boolean;
  formatOnSave: boolean;
  minimap: boolean;
  suggestions: boolean;
}

// Basit bir Separator bileşeni tanımlıyoruz
const Separator = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('h-px w-full bg-border', className)} {...props} />
);

export default function SettingsPage() {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'vs' | 'hc-black'>('vs-dark');
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: false,
    updates: true,
    newsletter: false,
  });
  const [profile, setProfile] = useState<ProfileSettings>({
    name: 'Kullanıcı Adı',
    email: 'kullanici@mail.com',
    bio: 'Yazılım geliştirici ve teknoloji meraklısı. Web, mobil ve AI projelerinde çalışıyorum.',
    github: 'kullanici',
    twitter: 'kullanici',
    linkedin: 'kullanici',
  });
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on',
    lineNumbers: true,
    autoSave: true,
    formatOnSave: true,
    minimap: false,
    suggestions: true,
  });

  // Tema değiştirme
  const handleThemeChange = (newTheme: 'system' | 'light' | 'dark') => {
    setTheme(newTheme);
    // Burada gerçekte tema değiştirme işlemi yapılacak
  };

  // Profil güncelleme
  const handleProfileChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Editör ayarları güncelleme
  const handleEditorSettingChange = <K extends keyof EditorSettings>(
    setting: K,
    value: EditorSettings[K]
  ) => {
    setEditorSettings(prev => ({ ...prev, [setting]: value }));
  };

  // Bildirim ayarları değiştirme
  const handleNotificationChange = (type: keyof NotificationSettings, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: checked }));
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold">Ayarlar</h1>
        <p className="text-muted-foreground">
          Hesabınızı ve platformdaki deneyiminizi kişiselleştirin.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Laptop className="h-4 w-4" />
            <span>Görünüm</span>
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span>Editör</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Bildirimler</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Güvenlik</span>
          </TabsTrigger>
        </TabsList>

        {/* Profil Ayarları */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profil Bilgileri</CardTitle>
              <CardDescription>
                Kişisel bilgilerinizi ve profil görünümünüzü güncelleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-muted">
                  <Image
                    src="/avatar.png"
                    alt="Avatar"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-muted text-lg font-medium opacity-0">
                    KA
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Profil Fotoğrafı</h3>
                  <p className="text-sm text-muted-foreground">
                    JPEG, PNG veya GIF formatında, maksimum 2MB boyutunda bir görsel yükleyin.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Değiştir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      Kaldır
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">İsim</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Adınız Soyadınız"
                      value={profile.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="mail@ornek.com"
                      value={profile.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Hakkında</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Kendiniz hakkında kısa bir bilgi..."
                    value={profile.bio}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-medium">Sosyal Bağlantılar</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5 text-muted-foreground" />
                    <Input
                      id="github"
                      name="github"
                      placeholder="GitHub kullanıcı adı"
                      value={profile.github}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Twitter className="h-5 w-5 text-muted-foreground" />
                    <Input
                      id="twitter"
                      name="twitter"
                      placeholder="Twitter kullanıcı adı"
                      value={profile.twitter}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 text-muted-foreground" />
                    <Input
                      id="linkedin"
                      name="linkedin"
                      placeholder="LinkedIn kullanıcı adı"
                      value={profile.linkedin}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Görünüm Ayarları */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Görünüm Ayarları</CardTitle>
              <CardDescription>
                Uygulama teması, dil ve görüntüleme tercihlerinizi değiştirin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tema</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <RadioGroup
                      defaultValue={theme}
                      onValueChange={handleThemeChange}
                      className="grid grid-cols-1 gap-4"
                    >
                      <div>
                        <RadioGroupItem
                          value="light"
                          id="theme-light"
                          className="peer sr-only"
                          aria-label="Light"
                        />
                        <Label
                          htmlFor="theme-light"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Sun className="h-6 w-6 mb-3" />
                          <span className="font-medium">Açık</span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem
                          value="dark"
                          id="theme-dark"
                          className="peer sr-only"
                          aria-label="Dark"
                        />
                        <Label
                          htmlFor="theme-dark"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Moon className="h-6 w-6 mb-3" />
                          <span className="font-medium">Koyu</span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem
                          value="system"
                          id="theme-system"
                          className="peer sr-only"
                          aria-label="System"
                        />
                        <Label
                          htmlFor="theme-system"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Laptop className="h-6 w-6 mb-3" />
                          <span className="font-medium">Sistem</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dil</h3>
                <div className="flex items-center gap-3 w-full max-w-sm">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <select
                    title="Dil Seçimi"
                    aria-label="Dil Seçimi"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="tr"
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Editör Ayarları */}
        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kod Editörü Ayarları</CardTitle>
              <CardDescription>Kod düzenleme deneyiminizi kişiselleştirin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Editör Teması</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <RadioGroup
                      defaultValue={editorTheme}
                      onValueChange={value =>
                        setEditorTheme(value as 'vs-dark' | 'vs' | 'hc-black')
                      }
                      className="grid grid-cols-1 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="vs" id="editor-light" className="peer sr-only" />
                        <Label
                          htmlFor="editor-light"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="h-12 w-full rounded bg-white border mb-2 flex items-center justify-center">
                            <code className="text-xs text-black">code</code>
                          </div>
                          <span className="font-medium">Açık</span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="vs-dark" id="editor-dark" className="peer sr-only" />
                        <Label
                          htmlFor="editor-dark"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="h-12 w-full rounded bg-gray-800 border mb-2 flex items-center justify-center">
                            <code className="text-xs text-white">code</code>
                          </div>
                          <span className="font-medium">Koyu</span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem
                          value="hc-black"
                          id="editor-contrast"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="editor-contrast"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="h-12 w-full rounded bg-black border mb-2 flex items-center justify-center">
                            <code className="text-xs text-white">code</code>
                          </div>
                          <span className="font-medium">Yüksek Kontrast</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Boyutu</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="fontSize"
                      type="number"
                      min={8}
                      max={32}
                      value={editorSettings.fontSize}
                      onChange={e =>
                        handleEditorSettingChange('fontSize', parseInt(e.target.value))
                      }
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tabSize">Tab Genişliği</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="tabSize"
                      type="number"
                      min={1}
                      max={8}
                      value={editorSettings.tabSize}
                      onChange={e => handleEditorSettingChange('tabSize', parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">boşluk</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wordWrap">Kelime Kaydırma</Label>
                  <select
                    id="wordWrap"
                    title="Kelime Kaydırma Seçenekleri"
                    aria-label="Kelime Kaydırma Seçenekleri"
                    value={editorSettings.wordWrap}
                    onChange={e =>
                      handleEditorSettingChange('wordWrap', e.target.value as WordWrapOption)
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="off">Kapalı</option>
                    <option value="on">Açık</option>
                    <option value="wordWrapColumn">Sütun</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lineNumbers">Satır Numaraları</Label>
                    <Switch
                      id="lineNumbers"
                      checked={editorSettings.lineNumbers}
                      onCheckedChange={checked => handleEditorSettingChange('lineNumbers', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoSave">Otomatik Kaydetme</Label>
                    <p className="text-[0.8rem] text-muted-foreground">
                      Değişiklikleri otomatik olarak kaydet
                    </p>
                  </div>
                  <Switch
                    id="autoSave"
                    checked={editorSettings.autoSave}
                    onCheckedChange={checked => handleEditorSettingChange('autoSave', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="formatOnSave">Kaydetme Sırasında Biçimlendir</Label>
                    <p className="text-[0.8rem] text-muted-foreground">
                      Kodu kaydederken otomatik olarak biçimlendir
                    </p>
                  </div>
                  <Switch
                    id="formatOnSave"
                    checked={editorSettings.formatOnSave}
                    onCheckedChange={checked => handleEditorSettingChange('formatOnSave', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="minimap">Minimap</Label>
                    <p className="text-[0.8rem] text-muted-foreground">
                      Dosya içeriğinin küçük bir önizlemesini göster
                    </p>
                  </div>
                  <Switch
                    id="minimap"
                    checked={editorSettings.minimap}
                    onCheckedChange={checked => handleEditorSettingChange('minimap', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="suggestions">Kod Önerileri</Label>
                    <p className="text-[0.8rem] text-muted-foreground">
                      Yazarken kod tamamlama önerilerini göster
                    </p>
                  </div>
                  <Switch
                    id="suggestions"
                    checked={editorSettings.suggestions}
                    onCheckedChange={checked => handleEditorSettingChange('suggestions', checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Bildirim Ayarları */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Ayarları</CardTitle>
              <CardDescription>
                Hangi bildirimler ve güncellemeler hakkında bilgilendirilmek istediğinizi
                belirleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Bildirim Tercihleri</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">E-posta Bildirimleri</Label>
                      <p className="text-sm text-muted-foreground">
                        Önemli güncellemeler ve etkinlikler hakkında e-posta alın
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={checked => handleNotificationChange('email', checked)}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Bildirimleri</Label>
                      <p className="text-sm text-muted-foreground">Tarayıcı bildirimlerini al</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={checked => handleNotificationChange('push', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">İletişim Tercihleri</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label htmlFor="product-updates">Ürün Güncellemeleri</Label>
                      <p className="text-sm text-muted-foreground">
                        Yeni özellikler ve iyileştirmeler hakkında bilgi alın
                      </p>
                    </div>
                    <Switch
                      id="product-updates"
                      checked={notifications.updates}
                      onCheckedChange={checked => handleNotificationChange('updates', checked)}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label htmlFor="newsletter">Bülten</Label>
                      <p className="text-sm text-muted-foreground">
                        Düzenli bülten ve içerik güncellemeleri alın
                      </p>
                    </div>
                    <Switch
                      id="newsletter"
                      checked={notifications.newsletter}
                      onCheckedChange={checked => handleNotificationChange('newsletter', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Güvenlik Ayarları */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Güvenlik Ayarları</CardTitle>
              <CardDescription>Hesabınızın güvenliğini yönetin ve izleyin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Parola Değiştirme</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mevcut Parola</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Yeni Parola</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Yeni Parolayı Doğrula</Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <Button>Parolayı Değiştir</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">İki Faktörlü Kimlik Doğrulama (2FA)</h3>
                <p className="text-sm text-muted-foreground">
                  Hesabınızı bir kimlik doğrulayıcı uygulama veya SMS ile güvence altına alın.
                </p>
                <Button variant="outline">İki Faktörlü Kimlik Doğrulamayı Etkinleştir</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Hesap İşlemleri</h3>
                <div className="space-y-4">
                  <div>
                    <Button variant="outline">Verilerimi İndir</Button>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Hesabınızla ilgili tüm verileri JSON formatında indirin.
                    </p>
                  </div>

                  <div>
                    <Button variant="destructive">Hesabımı Sil</Button>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Tüm verilerinizle birlikte hesabınızı kalıcı olarak silin.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
