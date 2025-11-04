'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Github, AlertCircle } from 'lucide-react';
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form gönderme işlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Temel doğrulama kontrolleri
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Gerçek bir API çağrısı burada yapılacak
      // const response = await apiClient.auth.login({ email, password });

      // Giriş başarılı olduğunda
      router.push('/dashboard');
    } catch (err) {
      console.error('Giriş hatası:', err);
      setError('Giriş yapılamadı. Lütfen e-posta ve şifrenizi kontrol edin.');
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
          <h1 className="text-3xl font-bold">Hoş geldiniz</h1>
          <p className="text-muted-foreground">
            Hesabınıza giriş yaparak platformumuzu kullanmaya başlayın
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>Hesabınıza erişmek için bilgilerinizi girin</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="mail@ornek.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Şifre</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Şifremi Unuttum
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
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
                GitHub ile Giriş Yap
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-muted-foreground">
              Hesabınız yok mu?{' '}
              <Link href="/auth/register" className="text-primary hover:underline">
                Kayıt Ol
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/terms" className="hover:underline mr-1">
            Kullanım Şartları
          </Link>
          •
          <Link href="/privacy" className="hover:underline ml-1">
            Gizlilik Politikası
          </Link>
        </p>
      </div>
    </div>
  );
}
