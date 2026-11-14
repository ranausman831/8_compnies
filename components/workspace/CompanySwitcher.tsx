'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCompanies, getDefaultCompanies, type Company } from '@/data/companies';

export function CompanySwitcher({ currentId }: { currentId: number }) {
  const [companies, setCompanies] = useState<Company[]>(() => getDefaultCompanies());

  useEffect(() => {
    const sync = () => setCompanies(getCompanies());

    sync();
    window.addEventListener('company-data-updated', sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('company-data-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return (
    <nav aria-label="Switch company" className="mt-4 flex gap-2 overflow-x-auto border-t border-slate-100 pt-4">
      {companies.map((company) => {
        const isActive = company.id === currentId;

        return (
          <Link
            key={company.id}
            href={`/companies/${company.id}`}
            aria-current={isActive ? 'page' : undefined}
            className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            {company.name}
          </Link>
        );
      })}
    </nav>
  );
}
