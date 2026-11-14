'use client';

import { Eye, EyeOff, ExternalLink, Save, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getToolUrls, normalizeHttpsUrl, saveToolUrl, type ToolUrls } from '@/data/company-tools';

export type ToolOption = {
  key: string;
  label: string;
  defaultUrl: string;
  placeholder: string;
  hint: string;
  /** true when the service officially supports being shown inside an iframe */
  embedFriendly: boolean;
};

type ToolCardProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  iconClass: string;
  companyId: number;
  options: ToolOption[];
  wide?: boolean;
};

export function ToolCard({ id, eyebrow, title, description, Icon, iconClass, companyId, options, wide }: ToolCardProps) {
  const [urls, setUrls] = useState<ToolUrls>({});
  const [activeKey, setActiveKey] = useState(options[0].key);
  const [draft, setDraft] = useState('');
  const [embedded, setEmbedded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState(false);

  const active = options.find((option) => option.key === activeKey) ?? options[0];
  const savedUrl = urls[active.key];
  const currentUrl = savedUrl ?? active.defaultUrl;

  useEffect(() => {
    setUrls(getToolUrls(companyId));
  }, [companyId]);

  // Keep the input in sync with the saved link of the selected option.
  useEffect(() => {
    setDraft(savedUrl ?? '');
  }, [active.key, savedUrl]);

  const switchOption = (key: string) => {
    setActiveKey(key);
    setEmbedded(false);
    setError(null);
    setSavedNote(false);
  };

  const handleSave = () => {
    setSavedNote(false);

    if (!draft.trim()) {
      setUrls(saveToolUrl(companyId, active.key, null));
      setEmbedded(false);
      setError(null);
      return;
    }

    const normalized = normalizeHttpsUrl(draft);
    if (!normalized) {
      setError('Please enter a valid https:// link.');
      return;
    }

    setUrls(saveToolUrl(companyId, active.key, normalized));
    setError(null);
    setSavedNote(true);
  };

  const embedUrl = (() => {
    if (active.key !== 'calendly') return currentUrl;
    try {
      const url = new URL(currentUrl);
      url.searchParams.set('embed_domain', window.location.hostname);
      url.searchParams.set('embed_type', 'Inline');
      return url.toString();
    } catch {
      return currentUrl;
    }
  })();

  return (
    <div
      id={id}
      className={`rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] ${wide ? 'lg:col-span-2' : ''}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">{eyebrow}</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{title}</h3>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="text-sm leading-6 text-slate-500">{description}</p>

      {options.length > 1 && (
        <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-sm">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => switchOption(option.key)}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                option.key === active.key ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={`${id}-${active.key}-url`} className="text-xs font-medium text-slate-500">
            {active.label} link for this company
          </label>
          <span
            className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
              active.embedFriendly
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            {active.embedFriendly ? 'Embedding supported' : 'May block embedding'}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={`${id}-${active.key}-url`}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSave();
            }}
            placeholder={active.placeholder}
            className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>

        <p className="text-xs text-slate-400">{active.hint}</p>
        {error && <p className="text-xs text-rose-600">{error}</p>}
        {savedNote && !error && <p className="text-xs text-emerald-600">Link saved for this company.</p>}
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => setEmbedded((open) => !open)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
        >
          {embedded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {embedded ? 'Hide here' : 'Show here'}
        </button>
        <a
          href={currentUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
        >
          Open {active.label}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {embedded && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <iframe
            key={embedUrl}
            src={embedUrl}
            title={`${active.label} for company ${companyId}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            className="h-[560px] w-full bg-white"
          />
          <p className="border-t border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
            If this area stays blank or says &quot;refused to connect&quot;, {active.label} does not allow embedding — use the Open button instead.
          </p>
        </div>
      )}
    </div>
  );
}
