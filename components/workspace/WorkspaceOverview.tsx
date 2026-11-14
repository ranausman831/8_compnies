import { ArrowRight, FolderOpen, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import type { Company } from '@/data/companies';

export function WorkspaceOverview({ company }: { company: Company }) {
  const quickActions = [
    { label: 'Files & Folders', icon: FolderOpen, href: '#files' },
    { label: 'Canva', icon: Sparkles, href: '#canva' },
    { label: 'AI Tools', icon: Zap, href: '#chatgpt' },
  ];

  return (
    <section id="overview" className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Overview</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{company.name}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Marketing workspace for managing brand assets, campaign structure, AI-assisted content, schedules and delivery tasks.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Workspace Active
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-medium text-slate-800">{action.label}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
