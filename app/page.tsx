'use client';

import { CompanyCard } from '@/components/CompanyCard';
import { getCompanies, getDefaultCompanies, type Company } from '@/data/companies';
import {
  Bell,
  Building2,
  ChevronDown,
  LayoutGrid,
  LogOut,
  PencilLine,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const currentUser = {
  name: 'Alex Doe',
  role: 'Administrator',
  initials: 'AD',
};

const OWNER_DEMO_MODE = true;

export default function HomePage() {
  const [companies, setCompanies] = useState<Company[]>(getDefaultCompanies());
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showOwnerManager, setShowOwnerManager] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const syncCompanies = () => setCompanies(getCompanies());
    syncCompanies();

    const handleStorageUpdate = () => syncCompanies();
    window.addEventListener('company-data-updated', handleStorageUpdate);

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('company-data-updated', handleStorageUpdate);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const query = searchTerm.toLowerCase();
    return (
      company.name.toLowerCase().includes(query) ||
      company.description.toLowerCase().includes(query)
    );
  });

  const openEditor = (company: Company) => {
    setEditingId(company.id);
    setDraftName(company.name);
    setValidationError(null);
    setNotice(null);
  };

  const cancelEditor = () => {
    setEditingId(null);
    setDraftName('');
    setValidationError(null);
  };

  const saveCompanyName = (companyId: number) => {
    const trimmed = draftName.trim();
    const duplicate = companies.some(
      (company) => company.id !== companyId && company.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );

    if (!trimmed) {
      setValidationError('Company name cannot be empty.');
      setNotice(null);
      return;
    }

    if (duplicate) {
      setValidationError('Company names must be unique.');
      setNotice(null);
      return;
    }

    const updatedCompanies = companies.map((company) =>
      company.id === companyId ? { ...company, name: trimmed } : company,
    );

    localStorage.setItem(
      'digital-marketing-hub-companies',
      JSON.stringify(updatedCompanies.map(({ id, name }) => ({ id, name }))),
    );
    setCompanies(updatedCompanies);
    window.dispatchEvent(new CustomEvent('company-data-updated'));
    setEditingId(null);
    setDraftName('');
    setValidationError(null);
    setNotice('Company name updated successfully.');
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/75 px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-md shadow-indigo-200">
                  D
                </div>

                <div className="hidden min-[430px]:block">
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">Portal</p>
                  <h1 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Digital Marketing Hub</h1>
                </div>
              </div>

              <nav className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 p-1 text-sm text-slate-600">
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-medium text-slate-900 shadow-sm ring-1 ring-slate-200">
                  <LayoutGrid className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900">
                  <Building2 className="h-4 w-4" />
                  <span>My Companies</span>
                </button>
              </nav>

              <div className="flex items-center justify-between gap-3 lg:justify-end">
                <div className="hidden flex-1 lg:block lg:max-w-[280px] xl:max-w-[320px]">
                  <label className="relative block">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search companies..."
                      className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                </button>

                <div ref={profileRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((open) => !open)}
                    className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-left shadow-sm transition-colors hover:border-indigo-200 hover:shadow-md"
                    aria-label="Open profile menu"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-[11px] font-semibold text-white">
                      {currentUser.initials}
                    </div>

                    <div className="hidden sm:block">
                      <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500">{currentUser.role}</p>
                    </div>

                    <ChevronDown
                      className={`hidden h-4 w-4 text-slate-500 transition-transform sm:block ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 z-20 mt-3 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                      >
                        <UserRound className="h-4 w-4" />
                        My Profile
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Settings className="h-4 w-4" />
                        Account Settings
                      </button>
                      <div className="my-1 h-px bg-slate-200" />
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:hidden">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search companies..."
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </label>
            </div>
          </div>
        </header>

        {OWNER_DEMO_MODE && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={() => setShowOwnerManager((open) => !open)}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
            >
              <PencilLine className="h-4 w-4" />
              Edit Companies
            </button>
          </div>
        )}

        {showOwnerManager && OWNER_DEMO_MODE && (
          <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-indigo-700">
              <ShieldCheck className="h-4 w-4" />
              Demo Owner Access: Edit company names from the frontend only.
            </div>

            <div className="space-y-3">
              {companies.map((company) => {
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
                            className="w-full min-w-[220px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100"
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
                          <PencilLine className="h-4 w-4" />
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => saveCompanyName(company.id)}
                            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditor}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {notice && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {notice}
              </div>
            )}

            {validationError && (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {validationError}
              </div>
            )}
          </div>
        )}

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-4">
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/80 px-6 py-12 text-center shadow-sm">
                <p className="text-lg font-medium text-slate-700">No companies match your search.</p>
                <p className="mt-2 text-sm text-slate-500">Try another company name or clear the search field.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
