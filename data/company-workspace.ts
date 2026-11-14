export type ToolStatus = 'Connected' | 'Not Connected' | 'Configuration Required' | 'Connection Error';

export type WorkspaceIntegration = {
  id: string;
  name: string;
  status: ToolStatus;
  url: string;
  description: string;
  note: string;
};

export type WorkspaceFolder = {
  id: string;
  name: string;
  createdAt: string;
};

export type WorkspaceFile = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  dataUrl?: string;
  source?: 'Upload' | 'AI' | 'Drive';
};

export type CompanyWorkspace = {
  folders: WorkspaceFolder[];
  files: WorkspaceFile[];
  integrations: WorkspaceIntegration[];
};

const getStorageKey = (companyId: number) => `digital-marketing-hub-workspace-${companyId}`;

export function getDefaultWorkspace(companyId: number): CompanyWorkspace {
  const baseFolders = [
    { id: `folder-${companyId}-brand`, name: 'Brand Assets', createdAt: new Date().toISOString() },
    { id: `folder-${companyId}-ads`, name: 'Paid Ads', createdAt: new Date().toISOString() },
    { id: `folder-${companyId}-content`, name: 'Content Calendar', createdAt: new Date().toISOString() },
  ];

  const defaultFiles: WorkspaceFile[] = [
    {
      id: `file-${companyId}-hero`,
      name: 'Hero-creative-v1.png',
      type: 'image/png',
      size: '1.2 MB',
      uploadedAt: new Date().toISOString(),
      dataUrl: '',
    },
  ];

  const integrations: WorkspaceIntegration[] = [
    {
      id: 'canva',
      name: 'Canva',
      status: 'Configuration Required',
      url: 'https://www.canva.com/',
      description: 'Design assets and campaign creatives.',
      note: 'Official Canva access requires account permissions and supported embed flow.',
    },
    {
      id: 'capcut',
      name: 'CapCut',
      status: 'Not Connected',
      url: 'https://www.capcut.com/',
      description: 'Video production and short-form edit workflows.',
      note: 'Embedding may be blocked by third-party site policies. Use external access when needed.',
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      status: 'Configuration Required',
      url: 'https://chat.openai.com/',
      description: 'AI-assisted content brainstorm and drafting.',
      note: 'Server-side API access is required before any AI automation can be enabled.',
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      status: 'Not Connected',
      url: 'https://calendar.google.com/',
      description: 'Campaign scheduling and team availability.',
      note: 'OAuth or official API integration is needed for full calendar syncing.',
    },
    {
      id: 'calendly',
      name: 'Calendly',
      status: 'Not Connected',
      url: 'https://calendly.com/',
      description: 'Client booking and marketing meetings.',
      note: 'Connection status depends on account permissions and supported OAuth flow.',
    },
    {
      id: 'trello',
      name: 'Trello',
      status: 'Configuration Required',
      url: 'https://trello.com/',
      description: 'Marketing campaign board and content approvals.',
      note: 'Board access must be configured through official API or shared workspace links.',
    },
  ];

  return {
    folders: baseFolders,
    files: defaultFiles,
    integrations,
  };
}

export function getCompanyWorkspace(companyId: number): CompanyWorkspace {
  if (typeof window === 'undefined') {
    return getDefaultWorkspace(companyId);
  }

  try {
    const key = getStorageKey(companyId);
    const raw = window.localStorage.getItem(key);
    if (!raw) return getDefaultWorkspace(companyId);

    const parsed = JSON.parse(raw) as CompanyWorkspace;
    if (!parsed || !parsed.folders || !parsed.files || !parsed.integrations) {
      return getDefaultWorkspace(companyId);
    }

    return parsed;
  } catch {
    return getDefaultWorkspace(companyId);
  }
}

export function saveCompanyWorkspace(companyId: number, workspace: CompanyWorkspace): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getStorageKey(companyId), JSON.stringify(workspace));
}

export function addFolder(companyId: number, name: string): CompanyWorkspace {
  const workspace = getCompanyWorkspace(companyId);
  const trimmed = name.trim();
  if (!trimmed) return workspace;

  const nextFolder: WorkspaceFolder = {
    id: `folder-${Date.now()}`,
    name: trimmed,
    createdAt: new Date().toISOString(),
  };

  const nextWorkspace = {
    ...workspace,
    folders: [...workspace.folders, nextFolder],
  };

  saveCompanyWorkspace(companyId, nextWorkspace);
  return nextWorkspace;
}

export function renameFolder(companyId: number, folderId: string, name: string): CompanyWorkspace {
  const workspace = getCompanyWorkspace(companyId);
  const trimmed = name.trim();
  if (!trimmed) return workspace;

  const nextWorkspace = {
    ...workspace,
    folders: workspace.folders.map((folder) =>
      folder.id === folderId ? { ...folder, name: trimmed } : folder,
    ),
  };

  saveCompanyWorkspace(companyId, nextWorkspace);
  return nextWorkspace;
}

export function deleteFolder(companyId: number, folderId: string): CompanyWorkspace {
  const workspace = getCompanyWorkspace(companyId);
  const nextWorkspace = {
    ...workspace,
    folders: workspace.folders.filter((folder) => folder.id !== folderId),
  };

  saveCompanyWorkspace(companyId, nextWorkspace);
  return nextWorkspace;
}

export async function addUploadedFile(companyId: number, file: File): Promise<CompanyWorkspace> {
  const workspace = getCompanyWorkspace(companyId);
  const dataUrl = await readFileAsDataUrl(file);

  const nextFile: WorkspaceFile = {
    id: `file-${Date.now()}-${file.name}`,
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: formatBytes(file.size),
    uploadedAt: new Date().toISOString(),
    dataUrl,
  };

  const nextWorkspace = {
    ...workspace,
    files: [nextFile, ...workspace.files],
  };

  saveCompanyWorkspace(companyId, nextWorkspace);
  return nextWorkspace;
}

export async function saveGeneratedAssetToDrive(
  companyId: number,
  asset: { name: string; type: string; content: string; source?: 'AI' | 'Drive' },
): Promise<CompanyWorkspace> {
  const workspace = getCompanyWorkspace(companyId);
  const trimmedName = asset.name.trim();
  if (!trimmedName) return workspace;

  const content = asset.content ?? '';
  const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  const dataUrl = `data:${asset.type};charset=utf-8,${encodeURIComponent(text)}`;

  const nextFile: WorkspaceFile = {
    id: `file-${Date.now()}-${trimmedName}`,
    name: trimmedName,
    type: asset.type || 'text/plain',
    size: formatBytes(new TextEncoder().encode(text).length),
    uploadedAt: new Date().toISOString(),
    dataUrl,
    source: asset.source ?? 'AI',
  };

  const nextWorkspace = {
    ...workspace,
    files: [nextFile, ...workspace.files],
  };

  saveCompanyWorkspace(companyId, nextWorkspace);
  return nextWorkspace;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let size = bytes / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
