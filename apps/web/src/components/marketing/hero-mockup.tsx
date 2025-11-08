import { cn } from '@/lib/utils';

export function HeroMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 p-4 shadow-[0_40px_120px_-45px_rgba(255,115,0,0.4)]',
        className
      )}
    >
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-slate-200">AI Task Flow</span>
        </div>
        <span className="text-[11px] text-slate-400">Çoklu ajan · Realtime</span>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-xl bg-slate-950/80 ring-1 ring-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-orange-500/10" />
        <div className="relative grid gap-6 p-6 text-left text-xs text-slate-200 sm:text-sm">
          <div>
            <p className="font-semibold uppercase tracking-[0.25em] text-slate-400">Kod Özeti</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-900/80 p-4 text-[11px] leading-relaxed text-slate-300">
              {`class PaymentService {
  async createInvoice(order: Order) {
    const customer = await crm.lookup(order.customerId);
    const total = applyDiscounts(order.items);
    return billing.issue({ customer, total });
  }
}`}
            </pre>
          </div>

          <div className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
              <span>AI PLAN</span>
              <span>00:12</span>
            </div>
            <ul className="grid gap-2 text-slate-100">
              <li className="flex items-center justify-between gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
                <span>1. Ödeme servisindeki tutarsızlıkları analiz et</span>
                <span className="text-[10px] uppercase tracking-[0.2em]">Active</span>
              </li>
              <li className="rounded-lg bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
                2. Eksik testleri oluştur ve CI pipeline'ına ekle
              </li>
              <li className="rounded-lg bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
                3. Üretim sonrası izlenebilirlik raporu hazırla
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Anlık çıktı</p>
          <p className="text-sm text-white/90">Test senaryoları ve edge-case önerileri hazır.</p>
        </div>
        <dl className="flex items-center gap-4 text-right text-xs text-slate-300">
          {[
            { label: 'Workspace', value: '320+' },
            { label: 'AI Task', value: '85K' },
            { label: 'Skor', value: '4.9/5' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col">
              <dt className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                {stat.label}
              </dt>
              <dd className="text-sm font-semibold text-white">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
