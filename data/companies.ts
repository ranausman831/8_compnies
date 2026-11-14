import { BriefcaseBusiness, Building2, Sparkles, type LucideIcon } from 'lucide-react';

export type Company = {
  id: number;
  name: string;
  description: string;
  accent: string;
  icon: LucideIcon;
};

export type StoredCompany = {
  id: number;
  name: string;
};

const COMPANY_STORAGE_KEY = 'digital-marketing-hub-companies';

export const COMPANY_THEME_MAP: Record<number, { accent: string; icon: LucideIcon }> = {
  1: { accent: 'bg-indigo-500', icon: Sparkles },
  2: { accent: 'bg-violet-500', icon: Building2 },
  3: { accent: 'bg-sky-500', icon: BriefcaseBusiness },
  4: { accent: 'bg-cyan-500', icon: Sparkles },
  5: { accent: 'bg-fuchsia-500', icon: Building2 },
  6: { accent: 'bg-emerald-500', icon: BriefcaseBusiness },
  7: { accent: 'bg-amber-500', icon: Sparkles },
  8: { accent: 'bg-rose-500', icon: Building2 },
};

export const DEFAULT_COMPANIES: StoredCompany[] = [
  { id: 1, name: 'Company 01' },
  { id: 2, name: 'Company 02' },
  { id: 3, name: 'Company 03' },
  { id: 4, name: 'Company 04' },
  { id: 5, name: 'Company 05' },
  { id: 6, name: 'Company 06' },
  { id: 7, name: 'Company 07' },
  { id: 8, name: 'Company 08' },
];

export function getDefaultCompanies(): Company[] {
  return DEFAULT_COMPANIES.map((company) => ({
    ...company,
    description: 'Marketing Workspace',
    ...COMPANY_THEME_MAP[company.id],
  }));
}

export function emitCompanyChange(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('company-data-updated'));
}

export function getCompanies(): Company[] {
  if (typeof window === 'undefined') {
    return getDefaultCompanies();
  }

  try {
    const raw = window.localStorage.getItem(COMPANY_STORAGE_KEY);
    if (!raw) {
      return getDefaultCompanies();
    }

    const parsed = JSON.parse(raw) as StoredCompany[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return getDefaultCompanies();
    }

    const storedMap = new Map(parsed.map((company) => [company.id, company.name]));

    return getDefaultCompanies().map((company) => {
      const storedName = storedMap.get(company.id);
      return {
        ...company,
        name: storedName && storedName.trim() ? storedName.trim() : company.name,
      };
    });
  } catch {
    return getDefaultCompanies();
  }
}

export function saveCompanies(companies: Company[]): void {
  if (typeof window === 'undefined') return;

  const storedCompanies: StoredCompany[] = companies.map(({ id, name }) => ({
    id,
    name: name.trim(),
  }));

  window.localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(storedCompanies));
  emitCompanyChange();
}

export function getCompanyById(companyId: string | number): Company | undefined {
  return getCompanies().find((company) => company.id === Number(companyId));
}

export function validateCompanyName(name: string, currentCompanyId: number, companies: Company[]): string | null {
  const trimmed = name.trim();

  if (!trimmed) return 'Company name cannot be empty.';

  const duplicate = companies.some(
    (company) => company.id !== currentCompanyId && company.name.trim().toLowerCase() === trimmed.toLowerCase(),
  );

  if (duplicate) return 'Company names must be unique.';

  return null;
}
