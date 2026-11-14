import { ArrowUpRight, CheckCircle2, CircleAlert, Link2, PlugZap } from 'lucide-react';
import type { WorkspaceIntegration } from '@/data/company-workspace';

export function WorkspaceIntegrationPanel({ integrations }: { integrations: WorkspaceIntegration[] }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Integrations</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Connected Tools</h3>
        </div>
      </div>

      <div className="space-y-3">
        {integrations.map((integration) => {
          const statusStyles = {
            Connected: 'border-emerald-200 bg-emerald-50 text-emerald-700',
            'Not Connected': 'border-slate-200 bg-slate-50 text-slate-600',
            'Configuration Required': 'border-amber-200 bg-amber-50 text-amber-700',
            'Connection Error': 'border-rose-200 bg-rose-50 text-rose-700',
          };

          const StatusIcon =
            integration.status === 'Connected'
              ? CheckCircle2
              : integration.status === 'Connection Error'
                ? CircleAlert
                : Link2;

          return (
            <div key={integration.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900">{integration.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{integration.description}</p>
                </div>

                <div className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-medium ${statusStyles[integration.status]}`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {integration.status}
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-500">{integration.note}</p>

              <div className="mt-4 flex items-center justify-end">
                <a
                  href={integration.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {integration.status === 'Connected' ? 'Open' : 'Connect'}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
