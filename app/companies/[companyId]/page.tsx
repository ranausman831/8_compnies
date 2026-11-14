import { notFound } from 'next/navigation';
import { DEFAULT_COMPANIES } from '@/data/companies';
import { CompanyWorkspaceView } from '@/components/workspace/CompanyWorkspaceView';

export default async function CompanyWorkspacePage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const id = Number(companyId);

  // Unknown ids should 404 instead of silently showing "Company 01".
  if (!Number.isInteger(id) || !DEFAULT_COMPANIES.some((company) => company.id === id)) {
    notFound();
  }

  // Saved company names / workspace data live in localStorage, so they must be read on the client.
  return <CompanyWorkspaceView key={id} companyId={id} />;
}
