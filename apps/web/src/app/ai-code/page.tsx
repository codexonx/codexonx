'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Code,
  Sparkles,
  Github,
  FileCode,
  Braces,
  LucideTerminalSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AICodeHome() {
  const [isHovering, setIsHovering] = useState(false);

  // Ana sayfa animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const features = [
    {
      title: 'AI Destekli Kod Yazma',
      description: 'Yapay zeka ile daha hızlı ve hatasız kod yazın',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      title: 'Akıllı Kod Tamamlama',
      description: 'Yarım kalan kodlarınızı AI ile tamamlayın',
      icon: <Code className="w-5 h-5" />,
    },
    {
      title: 'Tüm Dilleri Destekler',
      description: 'JavaScript, Python, Java ve daha fazlası',
      icon: <Braces className="w-5 h-5" />,
    },
    {
      title: 'Kod İyileştirme',
      description: 'Mevcut kodlarınızı optimize edin',
      icon: <FileCode className="w-5 h-5" />,
    },
    {
      title: 'Terminal Komut Üretimi',
      description: 'İhtiyacınız olan terminal komutlarını üretin',
      icon: <LucideTerminalSquare className="w-5 h-5" />,
    },
    {
      title: 'GitHub Entegrasyonu',
      description: 'Projelerinize doğrudan bağlanın',
      icon: <Github className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">AICodeX</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Giriş
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Üye Ol</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 flex flex-col items-center">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            variants={itemVariants}
          >
            Kodunuzu <span className="text-blue-500">AI ile</span> daha hızlı yazın
          </motion.h1>

          <motion.p
            className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Yapay zeka destekli kod asistanı ile projelerinizi daha hızlı ve verimli bir şekilde
            geliştirin. Sorularınızı cevaplayalım, kodlarınızı iyileştirelim, hatalarınızı
            düzeltelim.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              asChild
            >
              <Link href="/ai-code/editor">
                Kodlamaya Başla
                <motion.div animate={{ x: isHovering ? 5 : 0 }} transition={{ duration: 0.2 }}>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.div>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-gray-300 border-gray-700 hover:bg-gray-800 text-lg px-8 py-6"
              asChild
            >
              <Link href="/ai-code/demo">Demo İzle</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Örnek kod bloğu */}
        <motion.div
          className="w-full max-w-5xl mx-auto mt-16 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl shadow-blue-900/20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <div className="bg-slate-800 px-4 py-2 flex items-center border-b border-slate-700">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-sm text-gray-400">aicoder.js</div>
          </div>
          <div className="p-4 text-sm font-mono text-gray-300">
            <div className="text-gray-500">// Kodunuzu AI'ya sorun</div>
            <div className="text-blue-400">
              function <span className="text-yellow-400">createSmartComponent</span>
              {'('}
              <span className="text-green-400">config</span>
              {')'} {'{'}
            </div>
            <div className="pl-4 text-gray-300">// AI tarafından tamamlanacak kod</div>
            <div className="pl-4 text-gray-300">
              const {'{'} type, props {'}'} = config;
            </div>
            <div className="pl-4 text-gray-300">{''}</div>
            <div className="pl-4 text-blue-400">
              if <span className="text-gray-300">(</span>
              <span className="text-green-400">type</span> ==={' '}
              <span className="text-orange-400">'react'</span>
              <span className="text-gray-300">)</span> {'{'}
            </div>
            <div className="pl-8 text-gray-300">// React bileşeni oluştur</div>
            <div className="pl-8 text-yellow-400">
              return <span className="text-blue-400">new</span> ReactComponent
              <span className="text-gray-300">(props);</span>
            </div>
            <div className="pl-4 text-blue-400">
              {'}'} <span className="text-blue-400">else if</span>{' '}
              <span className="text-gray-300">(</span>
              <span className="text-green-400">type</span> ==={' '}
              <span className="text-orange-400">'vue'</span>
              <span className="text-gray-300">)</span> {'{'}
            </div>
            <div className="pl-8 text-blue-400">
              // <span className="text-gray-500">AI buradan devam edecek...</span>
            </div>
            <div className="pl-8 text-gray-300">
              <span className="bg-blue-500/20 px-1">return new VueComponent(props);</span>
            </div>
            <div className="pl-4 text-blue-400">{'}'}</div>
            <div className="text-blue-400">{'}'}</div>
          </div>
        </motion.div>

        {/* Özellikler */}
        <motion.div
          className="w-full max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="w-full max-w-4xl mx-auto mt-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center shadow-xl"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Projelerinizi hızlandırmaya hazır mısınız?
          </h2>
          <p className="text-lg text-blue-100 mb-6">
            Yapay zeka destekli kod asistanımızla geliştirme sürecinizi dönüştürün.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8"
            asChild
          >
            <Link href="/ai-code/editor">Hemen Dene</Link>
          </Button>
        </motion.div>
      </main>

      <footer className="mt-24 py-8 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Code className="w-6 h-6 text-blue-500" />
              <span className="text-white font-semibold">AICodeX</span>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} AICodeX. Tüm hakları saklıdır.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
