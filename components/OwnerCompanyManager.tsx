'use client';

import { Check, Pencil, Save, ShieldCheck, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { type Company, getCompanies, saveCompanies, validateCompanyName } from '@/data/companies';

const OWNER_DEMO_MODE = true;

export function OwnerCompanyManager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCompanies(getCompanies());
  }, []);

  const orderedCompanies = useMemo(() => companies, [companies]);

  const openEditor = (company: Company) => {
    setEditingId(company.id);
    setDraftName(company.name);
    setError(null);
    setMessage(null);
  };

  const cancelEditor = () => {
    setEditingId(null);
    setDraftName('');
    setError(null);
  };

  const handleSave = (companyId: number) => {
    const validationMessage = validateCompanyName(draftName, companyId, companies);

    if (validationMessage) {
      setError(validationMessage);
      setMessage(null);
      return;
    }

    const updatedCompanies = companies.map((company) =>
      company.id === companyId ? { ...company, name: draftName.trim() } : company,
    );

    setCompanies(updatedCompanies);
    saveCompanies(updatedCompanies);
    setEditingId(null);
    setDraftName('');
    setError(null);
    setMessage('Company name updated successfully.');
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Owner Tools</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Manage Company Names</h3>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          {OWNER_DEMO_MODE ? 'Owner Demo Mode' : 'Owner Access'}
        </div>
      </div>

      {message && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <Check className="h-4 w-4" />
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</div>
      )}

      <div className="space-y-3">
        {orderedCompanies.map((company) => {
          const isEditing = editingId === company.id;

          return (
            <div
              key={company.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${company.accent} text-white shadow-sm`}>
                  <company.icon className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Company {company.id}</p>
                  {!isEditing ? (
                    <p className="text-base font-semibold text-slate-900">{company.name}</p>
                  ) : (
                    <input
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100"
                      placeholder="Enter company name"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => openEditor(company)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSave(company.id)}
                      className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditor}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
