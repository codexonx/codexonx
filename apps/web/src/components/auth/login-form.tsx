'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApi } from '@/hooks/use-api';
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
import { Eye, EyeOff, Loader, AlertCircle } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useApi();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form değişikliklerini takip et
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form doğrulama
    if (!formData.email) {
      setFormError('Email adresi gereklidir.');
      return;
    }

    if (!formData.password) {
      setFormError('Şifre gereklidir.');
      return;
    }

    // Login işlemi
    const result = await login(
      formData.email,
      formData.password,
      data => {
        // Token'ı localStorage'a kaydet
        localStorage.setItem('auth_token', data.token);

        // Kullanıcıyı dashboard'a yönlendir
        router.push('/admin');
      },
      error => {
        setFormError(error);
      }
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Giriş Yap</CardTitle>
        <CardDescription>Hesabınıza giriş yaparak platformu kullanmaya başlayın</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Hata mesajı */}
          {(formError || error) && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-start text-sm">
              <AlertCircle className="w-4 h-4 mr-2 mt-0.5" />
              <span>{formError || error}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="mail@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* Şifre */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Şifre</Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                Şifremi Unuttum
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Giriş yapılıyor
              </>
            ) : (
              'Giriş Yap'
            )}
          </Button>
          <div className="text-center text-sm">
            Henüz hesabınız yok mu?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Kayıt Ol
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
