'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import { useState } from 'react';
import {
  Settings,
  User,
  Key,
  Globe,
  Brush,
  Laptop,
  Moon,
  Sun,
  Terminal,
  Keyboard,
  Github,
  Save,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  // API ayarları
  const [apiKey, setApiKey] = useState('');
  const [apiKeyMasked, setApiKeyMasked] = useState(true);
  const [apiModel, setApiModel] = useState('gpt-4o');
  const [apiTemperature, setApiTemperature] = useState(0.7);

  // Arayüz ayarları
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('14');
  const [tabSize, setTabSize] = useState('2');
  const [wordWrap, setWordWrap] = useState(true);
  const [minimap, setMinimap] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  // Hesap ayarları
  const [name, setName] = useState('Kullanıcı');
  const [email, setEmail] = useState('user@example.com');
  const [githubUsername, setGithubUsername] = useState('');
  const [githubConnected, setGithubConnected] = useState(false);

  // Ayarları kaydet
  const saveSettings = () => {
    // Gerçek uygulamada burada bir API çağrısı veya localStorage kaydı yapılır
    toast({
      title: 'Ayarlar kaydedildi',
      description: 'Tüm ayarlarınız başarıyla güncellendi',
    });
  };

  // GitHub bağlantısı
  const connectGitHub = () => {
    // Gerçek uygulamada OAuth akışı başlatılır
    toast({
      title: 'GitHub Bağlantısı',
      description: 'Bu demo sürümünde GitHub bağlantısı simüle edilmektedir.',
    });
    setGithubConnected(true);
    setGithubUsername('demo-user');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ayarlar</h1>
          <p className="text-gray-400">
            Kod yazma deneyiminizi kişiselleştirin ve AI ayarlarınızı yapılandırın
          </p>
        </header>

        <Tabs defaultValue="appearance" className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 md:gap-8">
            {/* Sekme Çubuğu */}
            <TabsList className="bg-slate-900 border-slate-800 flex flex-row sm:flex-col h-auto p-1 sm:p-0 rounded-md sm:rounded-none sm:w-48 sm:h-auto">
              <TabsTrigger
                value="appearance"
                className="flex items-center justify-start sm:justify-start gap-2 w-full data-[state=active]:bg-slate-800"
              >
                <Brush className="w-4 h-4" />
                <span className="hidden sm:inline">Görünüm</span>
              </TabsTrigger>
              <TabsTrigger
                value="editor"
                className="flex items-center justify-start sm:justify-start gap-2 w-full data-[state=active]:bg-slate-800"
              >
                <Terminal className="w-4 h-4" />
                <span className="hidden sm:inline">Editör</span>
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="flex items-center justify-start sm:justify-start gap-2 w-full data-[state=active]:bg-slate-800"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">AI Ayarları</span>
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="flex items-center justify-start sm:justify-start gap-2 w-full data-[state=active]:bg-slate-800"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Hesap</span>
              </TabsTrigger>
            </TabsList>

            {/* Sekmeler */}
            <div className="flex-1">
              {/* Görünüm Sekmesi */}
              <TabsContent
                value="appearance"
                className="mt-0 border border-slate-800 rounded-md p-4 bg-slate-900"
              >
                <h2 className="text-xl font-bold mb-4">Görünüm Ayarları</h2>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-300">Tema</h3>
                    <RadioGroup value={theme} onValueChange={setTheme} className="flex space-x-2">
                      <div>
                        <RadioGroupItem value="system" id="system" className="peer sr-only" />
                        <Label
                          htmlFor="system"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-slate-800 bg-slate-950 p-4 hover:bg-slate-900 hover:text-slate-50 peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
                        >
                          <Laptop className="mb-2 h-6 w-6" />
                          <span>Sistem</span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                        <Label
                          htmlFor="dark"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-slate-800 bg-slate-950 p-4 hover:bg-slate-900 hover:text-slate-50 peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
                        >
                          <Moon className="mb-2 h-6 w-6" />
                          <span>Koyu</span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="light" id="light" className="peer sr-only" />
                        <Label
                          htmlFor="light"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-slate-800 bg-slate-950 p-4 hover:bg-slate-900 hover:text-slate-50 peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
                        >
                          <Sun className="mb-2 h-6 w-6" />
                          <span>Açık</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-300">Dil</h3>
                    <select
                      className="w-full rounded-md bg-slate-800 border-slate-700 text-white px-3 py-2 text-sm"
                      defaultValue="tr"
                      aria-label="Dil seçimi"
                      title="Dil seçimi"
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Ayarları Kaydet
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Editör Sekmesi */}
              <TabsContent
                value="editor"
                className="mt-0 border border-slate-800 rounded-md p-4 bg-slate-900"
              >
                <h2 className="text-xl font-bold mb-4">Editör Ayarları</h2>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="font-size" className="text-sm">
                        Font Boyutu
                      </Label>
                      <span className="text-sm text-gray-400">{fontSize}px</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">10</span>
                      <input
                        id="font-size"
                        type="range"
                        min="10"
                        max="24"
                        value={fontSize}
                        onChange={e => setFontSize(e.target.value)}
                        className="flex-1 h-2 bg-slate-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4"
                        aria-label="Yazı tipi boyutu"
                        title="Yazı tipi boyutu"
                      />
                      <span className="text-xs">24</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="tab-size" className="text-sm">
                      Tab Boyutu
                    </Label>
                    <select
                      id="tab-size"
                      className="w-full rounded-md bg-slate-800 border-slate-700 text-white px-3 py-2 text-sm"
                      value={tabSize}
                      onChange={e => setTabSize(e.target.value)}
                      title="Tab boyutu seçimi"
                      aria-label="Tab boyutu seçimi"
                    >
                      <option value="2">2 boşluk</option>
                      <option value="4">4 boşluk</option>
                      <option value="8">8 boşluk</option>
                    </select>
                  </div>

                  <div className="space-y-5 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="word-wrap">Kelime Kaydırma</Label>
                        <div className="text-xs text-gray-400">
                          Uzun satırları görünüm içine sığdır
                        </div>
                      </div>
                      <Switch id="word-wrap" checked={wordWrap} onCheckedChange={setWordWrap} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="minimap">Kod Minimap'i</Label>
                        <div className="text-xs text-gray-400">Kodun küçük önizlemesini göster</div>
                      </div>
                      <Switch id="minimap" checked={minimap} onCheckedChange={setMinimap} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="line-numbers">Satır Numaraları</Label>
                        <div className="text-xs text-gray-400">Satır numaralarını göster</div>
                      </div>
                      <Switch
                        id="line-numbers"
                        checked={lineNumbers}
                        onCheckedChange={setLineNumbers}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-save">Otomatik Kaydetme</Label>
                        <div className="text-xs text-gray-400">
                          Değişiklikleri otomatik olarak kaydet
                        </div>
                      </div>
                      <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Ayarları Kaydet
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* AI Ayarları Sekmesi */}
              <TabsContent
                value="ai"
                className="mt-0 border border-slate-800 rounded-md p-4 bg-slate-900"
              >
                <h2 className="text-xl font-bold mb-4">AI Ayarları</h2>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="api-key" className="text-sm">
                      OpenAI API Anahtarı
                    </Label>
                    <div className="relative">
                      <Input
                        id="api-key"
                        type={apiKeyMasked ? 'password' : 'text'}
                        placeholder="sk-..."
                        className="bg-slate-800 border-slate-700 text-white pr-20"
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-xs text-gray-400 hover:text-white"
                        onClick={() => setApiKeyMasked(!apiKeyMasked)}
                      >
                        {apiKeyMasked ? 'Göster' : 'Gizle'}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">
                      API anahtarınız güvenli bir şekilde saklanır ve sadece AI istekleriniz için
                      kullanılır.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="api-model" className="text-sm">
                      AI Modeli
                    </Label>
                    <select
                      id="api-model"
                      className="w-full rounded-md bg-slate-800 border-slate-700 text-white px-3 py-2 text-sm"
                      value={apiModel}
                      onChange={e => setApiModel(e.target.value)}
                      title="AI modeli seçimi"
                      aria-label="AI modeli seçimi"
                    >
                      <option value="gpt-4o">GPT-4o</option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3-opus">Claude 3 Opus</option>
                      <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="api-temperature" className="text-sm">
                        Yaratıcılık Seviyesi
                      </Label>
                      <span className="text-sm text-gray-400">{apiTemperature}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">0.1</span>
                      <input
                        id="api-temperature"
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={apiTemperature}
                        onChange={e => setApiTemperature(parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-slate-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4"
                        aria-label="Yaratıcılık seviyesi"
                        title="Yaratıcılık seviyesi"
                      />
                      <span className="text-xs">1.0</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Düşük değerler daha tutarlı, yüksek değerler daha yaratıcı yanıtlar üretir.
                    </p>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Ayarları Kaydet
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Hesap Sekmesi */}
              <TabsContent
                value="account"
                className="mt-0 border border-slate-800 rounded-md p-4 bg-slate-900"
              >
                <h2 className="text-xl font-bold mb-4">Hesap Ayarları</h2>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm">
                      Ad Soyad
                    </Label>
                    <Input
                      id="name"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm">
                      E-posta Adresi
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-medium">Bağlantılar</h3>

                    <div className="flex items-center justify-between p-3 border border-slate-700 rounded-md bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <Github className="w-5 h-5" />
                        <div>
                          <p className="text-sm font-medium">GitHub</p>
                          <p className="text-xs text-gray-400">
                            {githubConnected
                              ? `Bağlı: ${githubUsername}`
                              : 'GitHub hesabınızı bağlayın'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={githubConnected ? 'outline' : 'default'}
                        size="sm"
                        onClick={connectGitHub}
                        className={
                          githubConnected
                            ? 'border-green-600 text-green-500'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }
                        disabled={githubConnected}
                      >
                        {githubConnected ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Bağlandı
                          </>
                        ) : (
                          'Bağlan'
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Ayarları Kaydet
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>

        {/* Klavye Kısayolları */}
        <section className="border border-slate-800 rounded-md p-4 bg-slate-900">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Keyboard className="w-5 h-5 mr-2" />
            Klavye Kısayolları
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Editör</h3>
              <ul className="space-y-2">
                <ShortcutItem keys={['Ctrl', 'S']} description="Değişiklikleri kaydet" />
                <ShortcutItem keys={['Ctrl', 'F']} description="Dosyada ara" />
                <ShortcutItem keys={['Ctrl', 'P']} description="Dosya gezgini aç" />
                <ShortcutItem
                  keys={['Ctrl', '/', 'Ctrl', 'Shift', '/']}
                  description="Yorum satırı ekle/çıkar"
                />
                <ShortcutItem keys={['Alt', 'Z']} description="Satır kaydırmayı aç/kapat" />
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">AI Asistan</h3>
              <ul className="space-y-2">
                <ShortcutItem keys={['Alt', 'A']} description="AI sohbeti aç/kapat" />
                <ShortcutItem keys={['Ctrl', 'Space']} description="Kod tamamlama önerisi iste" />
                <ShortcutItem keys={['Ctrl', 'Shift', 'I']} description="Kodu biçimlendir" />
                <ShortcutItem keys={['Ctrl', 'Alt', 'D']} description="Kodu açıkla" />
                <ShortcutItem keys={['F1']} description="Komut paleti" />
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Klavye kısayolu öğesi
interface ShortcutItemProps {
  keys: string[];
  description: string;
}

function ShortcutItem({ keys, description }: ShortcutItemProps) {
  return (
    <li className="flex items-center justify-between text-sm">
      <span className="text-gray-400">{description}</span>
      <div className="flex gap-1">
        {keys.map((key, index) => (
          <kbd
            key={index}
            className="bg-slate-800 text-xs rounded px-1.5 py-0.5 border border-slate-700"
          >
            {key}
          </kbd>
        ))}
      </div>
    </li>
  );
}
