'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  
  const plans = [
    {
      name: 'Ücretsiz',
      description: 'Temel özellikler',
      price: { monthly: 0, annual: 0 },
      features: ['5 Proje Limiti', 'Temel Editor', 'Topluluk Desteği'],
      action: 'Başla',
      actionFn: () => window.location.href = '/dashboard'
    },
    {
      name: 'Premium',
      description: 'Profesyoneller için',
      price: { monthly: 9.99, annual: 99.99 },
      features: ['Sınırsız Proje', 'AI Asistanı', 'Gelişmiş Terminal', 'Öncelikli Destek'],
      action: 'Abone Ol',
      actionFn: () => window.location.href = '/auth/login?plan=premium'
    }
  ];
  
  return (
    <div className="container py-10">
      <div className="mx-auto text-center max-w-3xl mb-10">
        <h1 className="text-3xl font-bold mb-4">Basit Fiyatlandırma</h1>
        <p className="text-muted-foreground mb-8">Bütçenize uygun plan seçin</p>
        
        <div className="flex items-center justify-center mb-8 bg-muted p-1 rounded-lg w-fit mx-auto">
          <Button
            variant={annual ? "ghost" : "default"}
            onClick={() => setAnnual(false)}
            className="rounded-r-none"
          >
            Aylık
          </Button>
          <Button
            variant={annual ? "default" : "ghost"}
            onClick={() => setAnnual(true)}
            className="rounded-l-none"
          >
            Yıllık %15 İndirim
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.name === 'Premium' ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {plan.price[annual ? 'annual' : 'monthly'] === 0 
                    ? 'Ücretsiz' 
                    : `${plan.price[annual ? 'annual' : 'monthly']}₺`}
                </span>
                {plan.price[annual ? 'annual' : 'monthly'] > 0 && (
                  <span className="text-muted-foreground ml-2">
                    / {annual ? 'yıl' : 'ay'}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.name === 'Premium' ? "default" : "outline"}
                onClick={plan.actionFn}
              >
                {plan.action}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
