import { ArrowUpRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Company } from '@/data/companies';

export function CompanyCard({ company }: { company: Company }) {
  const Icon = company.icon;

  return (
    <Link href={`/companies/${company.id}`} className="group block" aria-label={`Open ${company.name}`}>
      <div className="relative flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_40px_rgba(79,70,229,0.10)]">
        <div className="mb-4 flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${company.accent} text-white shadow-sm`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-colors group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-600">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Workspace</p>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{company.name}</h2>
          <p className="text-sm text-slate-500">{company.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-xs font-medium text-slate-400">Open workspace</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
            Select <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
