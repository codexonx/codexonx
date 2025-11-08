import Link from 'next/link';
import type { Metadata } from 'next';

import {
  ArrowUpRight,
  Clock,
  Globe2,
  Headset,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
} from 'lucide-react';

import { ContactForm } from '@/components/forms/contact-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Bizimle İletişime Geçin | Codexonx',
  description:
    'Satış, teknik destek veya iş ortaklığı ihtiyaçlarınız için ekibimize ulaşın. Global ekiplerimize en geç bir iş günü içinde geri dönüş sağlıyoruz.',
};

const officeLocations = [
  {
    city: 'İstanbul, Türkiye',
    address: 'Maslak Mah. Ahi Evran Cad. No: 6, 34398 Sarıyer',
    timezone: 'GMT+03',
  },
  {
    city: 'Berlin, Almanya',
    address: 'Oranienburger Str. 24, 10117 Berlin',
    timezone: 'GMT+01',
  },
  {
    city: 'San Francisco, ABD',
    address: '548 Market St, San Francisco, CA 94104',
    timezone: 'GMT-08',
  },
];

const contactChannels = [
  {
    title: 'Satış Ekibi',
    description: 'Kurumsal planlar, özel entegrasyonlar ve yerinde eğitim talepleri için.',
    email: 'sales@codexonx.com',
    response: 'Ortalama yanıt: 6 saat',
  },
  {
    title: 'Teknik Destek',
    description: 'Platform soruları, API limitleri veya hata bildirimleri için.',
    email: 'support@codexonx.com',
    response: 'Ortalama yanıt: 2 saat',
  },
  {
    title: 'İş Ortaklığı',
    description: 'Ajanslar, entegratörler veya teknoloji partnerlikleri için.',
    email: 'partners@codexonx.com',
    response: 'Ortalama yanıt: 1 iş günü',
  },
];

const trustBadges = [
  {
    icon: ShieldCheck,
    title: 'SOC 2 Type II süreci',
    description: 'Denetim aşamasındayız, güvenlik raporlarını paylaşmaya hazırız.',
  },
  {
    icon: Users,
    title: '1.200+ aktif ekip',
    description: 'Ürünümüz global ekipler tarafından günlük iş akışlarında kullanılıyor.',
  },
  {
    icon: Globe2,
    title: '24 ülkede müşteriler',
    description: 'Farklı saat dilimlerine yayılan destek ekibimizle her zaman çevrimiçiyiz.',
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <section className="border-b bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container grid gap-10 px-4 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,460px)] md:px-6 md:py-24 lg:items-center">
          <div className="space-y-6">
            <Badge className="w-fit bg-primary/10 text-primary">Codexonx ile bağlantı kurun</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Global ekibimizle tanışın, ihtiyaçlarınızı birlikte planlayalım
            </h1>
            <p className="text-lg text-muted-foreground">
              Satış, teknik destek veya ortaklık talebi fark etmeksizin, doğru ekibe yönlendirilecek
              ve en geç bir iş günü içinde geri dönüş alacaksınız. Her iletişim talebi SLA altında
              takip edilir.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="#contact-form">
                  Formu doldur
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Ortalama ilk yanıt: 4 saat</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-border/60 bg-background p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold">Doğrudan kanallar</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Mail className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">support@codexonx.com</p>
                  <p>7/24 teknik destek ve acil durum hattı.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Phone className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">+90 (212) 000 00 00</p>
                  <p>Hafta içi 09:00 – 19:00 (GMT+03)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Headset className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Slack müşteri kanalı</p>
                  <p>Kurumsal müşteriler için özel kanal daveti sağlanır.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1">
        <section
          id="contact-form"
          className="container grid gap-10 px-4 py-16 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:px-6 lg:gap-16"
        >
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight">İletişim formu</h2>
              <p className="text-muted-foreground">
                Bize ihtiyaçlarınızı birkaç cümleyle anlatmanız yeterli. Talebinizi aldıktan sonra
                ilgili ekip bir toplantı planlamak veya yanıt paylaşmak için sizinle iletişime
                geçer.
              </p>
            </div>
            <ContactForm />
            <p className="text-xs text-muted-foreground">
              Bu formu göndererek, bilgilerinizin Gizlilik Politikamız uyarınca işleneceğini kabul
              edersiniz. Talebiniz 12 ay içinde anonimleştirilecektir.
            </p>
          </div>

          <aside className="space-y-8">
            <div className="space-y-6 rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Global ofislerimiz</h3>
              <p className="text-sm text-muted-foreground">
                Farklı saat dilimlerinde yerleşik ekiplerimizle, kritik durumlarda yerel destek
                sağlayabiliyoruz.
              </p>
              <div className="space-y-5">
                {officeLocations.map(location => (
                  <div key={location.city} className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{location.city}</p>
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                    <p className="text-xs text-muted-foreground">
                      Saat dilimi: {location.timezone}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
              <h3 className="text-xl font-semibold">İhtiyacınıza uygun kanal</h3>
              <div className="space-y-4">
                {contactChannels.map(channel => (
                  <Card key={channel.title} className="border-none bg-muted/60">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{channel.title}</CardTitle>
                      <CardDescription>{channel.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{channel.email}</p>
                      <p>{channel.response}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="border-t bg-background">
          <div className="container grid gap-6 px-4 py-16 md:grid-cols-3 md:px-6">
            {trustBadges.map(badge => (
              <Card key={badge.title} className="border border-border/70 bg-muted/40">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <badge.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{badge.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {badge.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
