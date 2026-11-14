'use client';

import { Download, FolderOpen, FolderPlus, HardDrive, Pencil, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  addFolder,
  addUploadedFile,
  deleteFolder,
  getCompanyWorkspace,
  renameFolder,
  saveGeneratedAssetToDrive,
  type CompanyWorkspace,
} from '@/data/company-workspace';

const demoDriveContent = [
  {
    name: 'AI-Brand-Summary.md',
    type: 'text/markdown',
    content: '# Brand Summary\n\nThis file contains AI-generated marketing content for the current company workspace.\n\n- Audience: High-intent buyers\n- Objective: Increase organic engagement\n- CTA: Book a strategy call',
  },
  {
    name: 'Campaign-Concept.txt',
    type: 'text/plain',
    content: 'Campaign concept: Launch a social-first funnel focused on short-form video, customer testimonials, and conversion-focused landing page copy.',
  },
];

export function WorkspaceFileManager({ companyId }: { companyId: number }) {
  const [workspace, setWorkspace] = useState<CompanyWorkspace | null>(null);
  const [folderName, setFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [draftFolderName, setDraftFolderName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setWorkspace(getCompanyWorkspace(companyId));
  }, [companyId]);

  const refresh = () => setWorkspace(getCompanyWorkspace(companyId));

  const handleAddFolder = () => {
    const trimmed = folderName.trim();
    if (!trimmed) {
      setError('Folder name cannot be empty.');
      return;
    }

    const nextWorkspace = addFolder(companyId, trimmed);
    setWorkspace(nextWorkspace);
    setFolderName('');
    setError(null);
  };

  const handleRename = (folderId: string) => {
    const trimmed = draftFolderName.trim();
    if (!trimmed) {
      setError('Folder name cannot be empty.');
      return;
    }

    const nextWorkspace = renameFolder(companyId, folderId, trimmed);
    setWorkspace(nextWorkspace);
    setEditingFolderId(null);
    setDraftFolderName('');
    setError(null);
  };

  const handleDelete = (folderId: string) => {
    const nextWorkspace = deleteFolder(companyId, folderId);
    setWorkspace(nextWorkspace);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextWorkspace = await addUploadedFile(companyId, file);
    setWorkspace(nextWorkspace);
    event.target.value = '';
  };

  const handleSaveToDrive = async (asset: { name: string; type: string; content: string }) => {
    const nextWorkspace = await saveGeneratedAssetToDrive(companyId, {
      ...asset,
      source: 'AI',
    });
    setWorkspace(nextWorkspace);
    setError(null);
  };

  if (!workspace) return null;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Files</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Files & Folders</h3>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100">
            <Upload className="h-4 w-4" />
            Upload File
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={folderName}
              onChange={(event) => setFolderName(event.target.value)}
              placeholder="New folder name"
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100"
            />
            <button
              type="button"
              onClick={handleAddFolder}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
            >
              <FolderPlus className="h-4 w-4" />
              Create
            </button>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {demoDriveContent.map((asset) => (
          <button
            key={asset.name}
            type="button"
            onClick={() => handleSaveToDrive(asset)}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
          >
            <HardDrive className="h-3.5 w-3.5" />
            Save to Drive: {asset.name}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</div>}

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Folders</h4>
          {workspace.folders.map((folder) => (
            <div key={folder.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <FolderOpen className="h-4 w-4" />
                </div>
                {editingFolderId === folder.id ? (
                  <input
                    value={draftFolderName}
                    onChange={(event) => setDraftFolderName(event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100"
                  />
                ) : (
                  <div>
                    <p className="font-medium text-slate-900">{folder.name}</p>
                    <p className="text-xs text-slate-500">{new Date(folder.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editingFolderId === folder.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleRename(folder.id)}
                      className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFolderId(null);
                        setDraftFolderName('');
                      }}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFolderId(folder.id);
                        setDraftFolderName(folder.name);
                      }}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(folder.id)}
                      className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Recent Files</h4>
          {workspace.files.map((file) => (
            <div key={file.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">{file.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{file.type} • {file.size}</p>
                  <p className="mt-1 text-xs text-slate-500">Uploaded {new Date(file.uploadedAt).toLocaleDateString()}</p>
                  {file.source && <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-indigo-600">{file.source}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {file.dataUrl ? (
                    <a href={file.dataUrl} download={file.name} className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 hover:text-indigo-600">
                      <Download className="h-4 w-4" />
                    </a>
                  ) : (
                    <button type="button" className="rounded-full border border-slate-200 bg-white p-2 text-slate-700">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
