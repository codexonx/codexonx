'use client';

import { useState } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Check, CreditCard, Zap, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Fiyatlandırma planı tipi
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  buttonText: string;
}

// Örnek planlar
const pricingPlans: Plan[] = [
  {
    id: 'free',
    name: 'Ücretsiz',
    description: 'Temel kullanım için ideal',
    price: 0,
    interval: 'month',
    buttonText: 'Ücretsiz Başla',
    features: [
      '5 proje limiti',
      'Her proje için 500 MB depolama',
      'Günde 100 API isteği',
      'Temel analitikler',
      'Topluluk desteği',
    ],
  },
  {
    id: 'starter',
    name: 'Başlangıç',
    description: 'Küçük ekipler için',
    price: 99,
    interval: 'month',
    buttonText: 'Başlangıç Planı Satın Al',
    features: [
      '10 proje limiti',
      'Her proje için 2 GB depolama',
      'Günde 5.000 API isteği',
      'Gelişmiş analitikler',
      'Email desteği',
      'API anahtarı yönetimi',
    ],
  },
  {
    id: 'pro',
    name: 'Profesyonel',
    description: 'Profesyonel kullanım için ideal',
    price: 249,
    interval: 'month',
    isPopular: true,
    buttonText: 'Pro Planı Satın Al',
    features: [
      '30 proje limiti',
      'Her proje için 10 GB depolama',
      'Günde 50.000 API isteği',
      'Gerçek zamanlı analitikler',
      'Öncelikli destek',
      'API anahtarı yönetimi',
      'Webhook entegrasyonları',
      'Özel domain desteği',
      'SLA garantisi',
    ],
  },
  {
    id: 'enterprise',
    name: 'Kurumsal',
    description: 'Büyük ekipler ve kurumlar için',
    price: 999,
    interval: 'month',
    buttonText: 'İletişime Geç',
    features: [
      'Sınırsız proje',
      'Sınırsız depolama',
      'Sınırsız API isteği',
      'Premium analitikler ve raporlama',
      '7/24 özel destek',
      'Özel eğitim ve kurulum',
      'Gelişmiş güvenlik özellikleri',
      'Özel entegrasyon desteği',
      'Öncelikli SLA garantisi',
      'Özel özellikler ve özelleştirmeler',
    ],
  },
];

export default function PlansPage() {
  const { t } = useI18n();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  // Aylık veya yıllık olarak fiyatı göster
  const getPriceDisplay = (price: number, interval: 'month' | 'year') => {
    if (price === 0) return 'Ücretsiz';

    const monthlyPrice = price;
    const yearlyPrice = price * 10; // Yıllık fiyat için %17 indirim
    const displayPrice = interval === 'month' ? monthlyPrice : yearlyPrice;

    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(displayPrice);
  };

  // Plan satın alma işlemi
  const handlePurchase = (plan: Plan) => {
    if (plan.id === 'enterprise') {
      // Kurumsal plan için iletişim formuna yönlendir
      console.log('Kurumsal plan iletişim formu');
    } else if (plan.id === 'free') {
      // Ücretsiz plan için direkt kayıt
      console.log('Ücretsiz plan kaydı');
    } else {
      // Ödeme işlemi başlat
      console.log(`${plan.name} planı satın alınıyor`);
      // Normalde burada bir ödeme sayfasına yönlendirme olur
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto text-center max-w-3xl mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">İhtiyaçlarınıza Uygun Esnek Planlar</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Her boyuttaki ekip ve proje için planlarımızdan birini seçin. Herhangi bir zamanda
          yükseltebilir veya düşürebilirsiniz.
        </p>

        {/* Fatura döngüsü seçici */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Button
            variant={billingInterval === 'month' ? 'default' : 'outline'}
            onClick={() => setBillingInterval('month')}
          >
            Aylık
          </Button>
          <Button
            variant={billingInterval === 'year' ? 'default' : 'outline'}
            onClick={() => setBillingInterval('year')}
          >
            Yıllık
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
              %17 İndirim
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pricingPlans.map(plan => (
          <Card
            key={plan.id}
            className={`flex flex-col ${
              plan.isPopular
                ? 'border-primary shadow-lg relative before:absolute before:inset-0 before:-z-10 before:rounded-lg before:shadow-[0_0_0_2px_theme(colors.primary.DEFAULT)]'
                : ''
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium flex items-center">
                <Star className="w-3 h-3 mr-1 fill-current" />
                En Popüler
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {getPriceDisplay(plan.price, billingInterval)}
                </span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground ml-2">
                    / {billingInterval === 'month' ? 'ay' : 'yıl'}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.isPopular ? 'default' : 'outline'}
                onClick={() => handlePurchase(plan)}
              >
                {plan.id === 'free' && <Zap className="mr-2 h-4 w-4" />}
                {plan.id === 'enterprise' && <Shield className="mr-2 h-4 w-4" />}
                {(plan.id === 'starter' || plan.id === 'pro') && (
                  <CreditCard className="mr-2 h-4 w-4" />
                )}
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-xl font-semibold mb-2">Özel ihtiyaçlarınız mı var?</h2>
        <p className="text-muted-foreground mb-6">
          Özel fiyatlandırma ve gereksinimleri görüşmek için satış ekibimizle iletişime geçin.
        </p>
        <Button variant="outline" size="lg">
          Satış Ekibiyle Görüşün
        </Button>
      </div>
    </div>
  );
}
