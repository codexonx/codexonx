"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Code, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Basit doğrulama
      if (!name) {
        throw new Error("Ad alanı gerekli");
      }
      if (!email) {
        throw new Error("E-posta adresi gerekli");
      }
      if (!password) {
        throw new Error("Şifre gerekli");
      }
      if (password.length < 8) {
        throw new Error("Şifre en az 8 karakter olmalıdır");
      }
      
      // TODO: Backend API entegrasyonu gelecek
      console.log("Kayıt yapılıyor:", { name, email, password });
      
      // Simüle edilmiş başarılı kayıt
      setTimeout(() => {
        setIsSuccess(true);
        setIsLoading(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Kayıt yapılırken bir hata oluştu");
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">Kayıt İşlemi Başarılı</h2>
          <p className="text-center text-muted-foreground mb-6">
            E-posta adresinize bir doğrulama linki gönderdik. 
            Lütfen hesabınızı aktifleştirmek için e-postanızı kontrol edin.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Giriş Sayfasına Git</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center space-x-2 mb-8">
            <Code className="h-8 w-8" />
            <span className="text-2xl font-bold">Codexonx</span>
          </div>
          <div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight">
              Yeni hesap oluşturun
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Zaten hesabınız var mı?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Giriş yapın
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium">
                    Ad Soyad
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    E-posta adresi
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium">
                    Şifre
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Şifreniz en az 8 karakter uzunluğunda olmalıdır.
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
                    <span>
                      <Link href="/terms" className="text-primary hover:underline">Kullanım Şartları</Link>
                      {' '}ve{' '}
                      <Link href="/privacy" className="text-primary hover:underline">Gizlilik Politikası</Link>'nı
                      kabul ediyorum
                    </span>
                  </label>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Kayıt yapılıyor..." : "Kayıt ol"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 object-cover" />
      </div>
    </div>
  );
}
