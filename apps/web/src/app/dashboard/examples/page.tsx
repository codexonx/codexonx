import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCode, Coffee, Terminal, LayoutGrid as LayoutIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ExamplesPage() {
  const examples = [
    {
      title: 'React Todo App',
      description: 'Basit bir yapılacaklar listesi uygulaması',
      icon: <FileCode className="h-10 w-10 text-blue-500" />,
      tags: ['react', 'typescript', 'tailwind'],
      href: '/dashboard/editor?example=todo-app',
    },
    {
      title: 'Express API',
      description: 'RESTful API başlangıç şablonu',
      icon: <Terminal className="h-10 w-10 text-green-500" />,
      tags: ['nodejs', 'express', 'api'],
      href: '/dashboard/editor?example=express-api',
    },
    {
      title: 'Landing Page',
      description: 'Modern açılış sayfası tasarımı',
      icon: <LayoutIcon className="h-10 w-10 text-purple-500" />,
      tags: ['html', 'css', 'responsive'],
      href: '/dashboard/editor?example=landing-page',
    },
    {
      title: 'Blog Template',
      description: 'Next.js ile blog başlangıç şablonu',
      icon: <Coffee className="h-10 w-10 text-orange-500" />,
      tags: ['nextjs', 'mdx', 'blog'],
      href: '/dashboard/editor?example=blog-template',
    },
    {
      title: 'E-Commerce API',
      description: 'E-ticaret için backend API',
      icon: <Terminal className="h-10 w-10 text-red-500" />,
      tags: ['nodejs', 'express', 'mongodb'],
      href: '/dashboard/editor?example=ecommerce-api',
    },
    {
      title: 'Admin Dashboard',
      description: 'Basit admin paneli başlangıç',
      icon: <LayoutIcon className="h-10 w-10 text-indigo-500" />,
      tags: ['react', 'dashboard', 'charts'],
      href: '/dashboard/editor?example=admin-dashboard',
    },
  ];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Örnek Projeler</h1>
          <p className="text-muted-foreground">Başlangıç için hazır örnek projeler</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/templates">
            Tüm Şablonlar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map(example => (
          <Card key={example.title} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="mb-2">{example.icon}</div>
              <CardTitle>{example.title}</CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {example.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button asChild className="w-full">
                <Link href={example.href}>Görüntüle</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
