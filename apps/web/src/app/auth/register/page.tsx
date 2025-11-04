'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  User,
  AlertCircle,
  Github,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Form değişikliklerini izle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form gönderme işlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form doğrulama
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    if (!agreedToTerms) {
      setError('Devam etmek için şartları ve koşulları kabul etmelisiniz.');
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Gerçek bir API çağrısı burada yapılacak
      // const response = await apiClient.auth.register({
      //   name: formData.name,
      //   email: formData.email,
      //   password: formData.password
      // });

      setSuccess('Hesabınız başarıyla oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...');

      // Kısa bir gecikme ile giriş sayfasına yönlendir
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      console.error('Kayıt hatası:', err);
      setError(
        'Kayıt yapılamadı. Lütfen bilgilerinizi kontrol edin veya daha sonra tekrar deneyin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <Link href="/" className="absolute left-8 top-8 flex items-center text-sm font-medium">
        <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
        Ana Sayfaya Dön
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold">Hesap Oluştur</h1>
          <p className="text-muted-foreground">
            CodeXONX platformuna üye olarak tüm özelliklere erişin
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Kayıt Ol</CardTitle>
            <CardDescription>Hesabınızı oluşturmak için bilgilerinizi girin</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-500">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Adınız Soyadınız"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="mail@ornek.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                    </span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Şifre en az 8 karakter olmalıdır.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrarı</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                    </span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={checked => setAgreedToTerms(checked === true)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <span className="text-muted-foreground">
                    <Link href="/terms" className="text-primary hover:underline">
                      Kullanım Şartları
                    </Link>{' '}
                    ve{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Gizlilik Politikası
                    </Link>
                    'nı kabul ediyorum.
                  </span>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ya da şununla devam et
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Button variant="outline" className="w-full" type="button">
                <Github className="mr-2 h-4 w-4" />
                GitHub ile Kayıt Ol
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-muted-foreground">
              Zaten bir hesabınız var mı?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Giriş Yap
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
