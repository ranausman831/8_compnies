import { BriefcaseBusiness, CalendarDays, FolderOpen, ListTodo, MessageSquareText, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import type { Company } from '@/data/companies';

const navItems = [
  { id: 'overview', label: 'Overview', icon: BriefcaseBusiness },
  { id: 'files', label: 'Files & Folders', icon: FolderOpen },
  { id: 'canva', label: 'Canva', icon: Sparkles },
  { id: 'capcut', label: 'CapCut', icon: Zap },
  { id: 'chatgpt', label: 'ChatGPT', icon: MessageSquareText },
  { id: 'scheduling', label: 'Scheduling', icon: CalendarDays },
  { id: 'trello', label: 'Trello', icon: ListTodo },
];

export function WorkspaceSidebar({ company }: { company: Company }) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] xl:sticky xl:top-8 xl:h-fit">
      <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${company.accent} text-white`}>
          <BriefcaseBusiness className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Workspace</p>
          <p className="text-base font-semibold text-slate-900">{company.name}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className="group flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
