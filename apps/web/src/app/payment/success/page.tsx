'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [planId, setPlanId] = useState<string | null>(null);
  const [planName, setPlanName] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('planId');
    setPlanId(id);

    // Plan adını belirle
    if (id === 'free') {
      setPlanName('Ücretsiz');
    } else if (id === 'starter') {
      setPlanName('Başlangıç');
    } else if (id === 'pro') {
      setPlanName('Profesyonel');
    } else if (id === 'enterprise') {
      setPlanName('Kurumsal');
    } else {
      setPlanName('Seçilen');
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="bg-green-100 dark:bg-green-900 p-6 rounded-full mb-6">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-300" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Ödeme Başarılı!</h1>

        <p className="text-xl text-muted-foreground mb-2">
          {planName} planı için aboneliğiniz başarıyla oluşturuldu.
        </p>

        <div className="bg-muted p-4 rounded-md my-6">
          <p className="text-sm">Sipariş onayı ve detaylar email adresinize gönderildi.</p>
        </div>
      </div>

      <div className="space-y-6 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold">Sonraki Adımlar</h2>

        <div className="space-y-4">
          <div className="flex items-center p-4 bg-card rounded-md border">
            <div className="bg-primary/10 p-2 rounded-full mr-4">
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Hesabınızı özelleştirin</h3>
              <p className="text-sm text-muted-foreground">
                Profil bilgilerinizi güncelleyin ve ayarlarınızı yapılandırın.
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-card rounded-md border">
            <div className="bg-primary/10 p-2 rounded-full mr-4">
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">İlk projenizi oluşturun</h3>
              <p className="text-sm text-muted-foreground">
                Hemen yeni bir proje oluşturun ve geliştirmeye başlayın.
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-card rounded-md border">
            <div className="bg-primary/10 p-2 rounded-full mr-4">
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Dokümantasyonu inceleyin</h3>
              <p className="text-sm text-muted-foreground">
                API'lerimizi ve özelliklerimizi öğrenmek için dokümantasyonu okuyun.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button className="w-full" asChild>
            <Link href="/admin/dashboard">Dashboard'a Git</Link>
          </Button>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/admin/projects/new">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Proje Oluştur
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
