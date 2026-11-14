'use client';

import {
  ArrowLeft,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ListChecks,
  MessageSquareText,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCompanies, getDefaultCompanies, type Company } from '@/data/companies';
import { getCompanyWorkspace, getDefaultWorkspace, type CompanyWorkspace } from '@/data/company-workspace';
import { CompanySwitcher } from '@/components/workspace/CompanySwitcher';
import { ToolCard } from '@/components/workspace/ToolCard';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { WorkspaceFileManager } from '@/components/workspace/WorkspaceFileManager';
import { WorkspaceIntegrationPanel } from '@/components/workspace/WorkspaceIntegrationPanel';

const currentUser = {
  name: 'Alex Doe',
  role: 'Administrator',
  initials: 'AD',
};

export function CompanyWorkspaceView({ companyId }: { companyId: number }) {
  // Initial state uses defaults so server HTML and first client render match (no hydration mismatch).
  const [company, setCompany] = useState<Company>(() => {
    const defaults = getDefaultCompanies();
    return defaults.find((item) => item.id === companyId) ?? defaults[0];
  });
  const [workspace, setWorkspace] = useState<CompanyWorkspace>(() => getDefaultWorkspace(companyId));

  // After mount, load the saved (localStorage) company name + workspace so defaults never override them.
  useEffect(() => {
    const sync = () => {
      const saved = getCompanies().find((item) => item.id === companyId);
      if (saved) setCompany(saved);
      setWorkspace(getCompanyWorkspace(companyId));
    };

    sync();
    window.addEventListener('company-data-updated', sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('company-data-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, [companyId]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/80 px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Companies</span>
              </Link>

              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${company.accent} text-white shadow-sm`}>
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Company Workspace</p>
                <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                  {company.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-[11px] font-semibold text-white">
                  {currentUser.initials}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.role}</p>
                </div>
              </div>
            </div>
          </div>

          <CompanySwitcher currentId={companyId} />
        </header>

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <WorkspaceSidebar company={company} />

          <div className="space-y-6">
            <section id="overview" className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${company.accent} text-white shadow-md`}>
                    <BriefcaseBusiness className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Workspace Overview</p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{company.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">Company Marketing Workspace</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
                  <Users className="h-4 w-4" />
                  Team Access Ready
                </div>
              </div>
            </section>

            <div id="files">
              <WorkspaceFileManager companyId={companyId} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <ToolCard
                id="canva"
                eyebrow="Design"
                title="Canva"
                description="Save this company's Canva design or team link. Canva usually blocks embedding, so use Open if the preview stays blank."
                Icon={Sparkles}
                iconClass="bg-violet-100 text-violet-700"
                companyId={companyId}
                options={[
                  {
                    key: 'canva',
                    label: 'Canva',
                    defaultUrl: 'https://www.canva.com/',
                    placeholder: 'https://www.canva.com/design/...',
                    hint: 'Paste the design or folder link of this company.',
                    embedFriendly: false,
                  },
                ]}
              />

              <ToolCard
                id="capcut"
                eyebrow="Video"
                title="CapCut"
                description="Save this company's CapCut project or workspace link. CapCut does not officially support embedding."
                Icon={Zap}
                iconClass="bg-sky-100 text-sky-700"
                companyId={companyId}
                options={[
                  {
                    key: 'capcut',
                    label: 'CapCut',
                    defaultUrl: 'https://www.capcut.com/',
                    placeholder: 'https://www.capcut.com/...',
                    hint: 'Paste the project or workspace link of this company.',
                    embedFriendly: false,
                  },
                ]}
              />

              <ToolCard
                id="chatgpt"
                eyebrow="AI"
                title="ChatGPT"
                description="Save a shared chat or project link for this company. A built-in chat box needs an OpenAI API key on a server, which is not set up yet."
                Icon={MessageSquareText}
                iconClass="bg-cyan-100 text-cyan-700"
                companyId={companyId}
                options={[
                  {
                    key: 'chatgpt',
                    label: 'ChatGPT',
                    defaultUrl: 'https://chat.openai.com/',
                    placeholder: 'https://chatgpt.com/share/...',
                    hint: 'Paste a shared chat or project link.',
                    embedFriendly: false,
                  },
                ]}
              />

              <ToolCard
                id="scheduling"
                eyebrow="Scheduling"
                title="Google Calendar & Calendly"
                description="Add this company's booking page or calendar to schedule posts and meetings. Both can be shown directly inside the portal."
                Icon={CalendarDays}
                iconClass="bg-emerald-100 text-emerald-700"
                companyId={companyId}
                options={[
                  {
                    key: 'calendly',
                    label: 'Calendly',
                    defaultUrl: 'https://calendly.com/',
                    placeholder: 'https://calendly.com/your-name',
                    hint: 'Paste your Calendly scheduling link.',
                    embedFriendly: true,
                  },
                  {
                    key: 'google-calendar',
                    label: 'Google Calendar',
                    defaultUrl: 'https://calendar.google.com/',
                    placeholder: 'https://calendar.google.com/calendar/embed?src=...',
                    hint: 'Google Calendar → Settings → Integrate calendar → copy the "Public URL" or embed link. The calendar must be shared.',
                    embedFriendly: true,
                  },
                ]}
              />

              <ToolCard
                id="trello"
                eyebrow="Task Board"
                title="Trello"
                wide
                description="Save this company's Trello board link for marketing and design task allocation. Live cards inside the portal need a Trello API key and token, which are not set up yet."
                Icon={ListChecks}
                iconClass="bg-amber-100 text-amber-700"
                companyId={companyId}
                options={[
                  {
                    key: 'trello',
                    label: 'Trello',
                    defaultUrl: 'https://trello.com/',
                    placeholder: 'https://trello.com/b/...',
                    hint: 'Paste the board link of this company.',
                    embedFriendly: false,
                  },
                ]}
              />
            </div>

            <WorkspaceIntegrationPanel integrations={workspace.integrations} />
          </div>
        </div>
      </div>
    </main>
  );
}
