import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Operational/Playbooks/Codexonx Agent Workflow',
  parameters: {
    layout: 'fullscreen',
    controls: { hideNoControlsWarning: true },
    options: {
      showPanel: false,
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

const sections = [
  {
    heading: 'Amaç',
    items: [
      'Mock → Onay → Backend entegrasyonu döngüsünü standartlaştırmak',
      'Backend-öncelikli QA akışını ve kullanıcı onayı gereksinimlerini netleştirmek',
      'Glow/glass temalı tasarım prensiplerini her sprintte korumak',
    ],
  },
  {
    heading: 'Ana Fazlar',
    items: [
      'Analiz & Netleştirme',
      'Mock Frontend uygulaması (maks. 5 dosya, mock.ts kaynaklı veri)',
      'Contracts dosyasıyla backend planı',
      'Backend geliştirme & entegrasyon',
      'Backend test → (kullanıcı onaylı) frontend test',
    ],
  },
  {
    heading: 'Dokümana Giden Yol',
    items: [
      'apps/web/docs/codexonx-agent-workflow.md dosyasında ayrıntılı plan',
      'Storybook dışında Notion/PR şablonlarına taşınması önerildi',
    ],
  },
];

export const Overview: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-white/10 bg-background/80 p-10 shadow-lg backdrop-blur">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">
            Operational Playbook
          </p>
          <h1 className="font-display text-4xl font-semibold">Codexonx Agent Workflow</h1>
          <p className="text-sm text-muted-foreground">
            Emergent E1 sistem promptundan türetilen süreç ve test standartlarının Codexonx
            dokümantasyonuna aktarımı.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map(section => (
            <section
              key={section.heading}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <h2 className="text-lg font-semibold text-foreground">{section.heading}</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {section.items.map(item => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <footer className="flex flex-col gap-2 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-sm">
          <span className="font-semibold text-primary">Referans</span>
          <span className="text-muted-foreground">
            Detaylı yol haritası için{' '}
            <code className="rounded bg-black/40 px-2 py-1 text-xs text-primary-foreground">
              apps/web/docs/codexonx-agent-workflow.md
            </code>{' '}
            dosyasını inceleyin.
          </span>
        </footer>
      </div>
    </div>
  ),
};
