import React, { useState, useEffect } from 'react';
import { useResetWeek } from '../context/ResetWeekContext';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Copy,
  ExternalLink,
  X,
  Smartphone,
  Laptop,
} from 'lucide-react';
import type { FirebaseSyncConfig } from '../lib/firebase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseSyncModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    syncStatus,
    lastSyncedAt,
    firebaseConfig,
    connectFirebase,
    disconnectFirebase,
    forceSyncNow,
  } = useResetWeek();

  const [jsonInput, setJsonInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [projectId, setProjectId] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');
  const [syncKey, setSyncKey] = useState('personal_reset_week');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (firebaseConfig) {
      setApiKey(firebaseConfig.apiKey || '');
      setProjectId(firebaseConfig.projectId || '');
      setAuthDomain(firebaseConfig.authDomain || '');
      setStorageBucket(firebaseConfig.storageBucket || '');
      setMessagingSenderId(firebaseConfig.messagingSenderId || '');
      setAppId(firebaseConfig.appId || '');
      setSyncKey(firebaseConfig.syncKey || 'personal_reset_week');
    }
  }, [firebaseConfig]);

  if (!isOpen) return null;

  // Auto-parse when user pastes firebaseConfig block
  const handleJsonPaste = (text: string) => {
    setJsonInput(text);
    try {
      // Clean up js object syntax to json if needed
      const clean = text
        .replace(/(const|let|var)\s+\w+\s*=\s*/, '')
        .replace(/;?\s*$/, '')
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
        .replace(/'/g, '"');

      const parsed = JSON.parse(clean);
      if (parsed.apiKey) setApiKey(parsed.apiKey);
      if (parsed.projectId) setProjectId(parsed.projectId);
      if (parsed.authDomain) setAuthDomain(parsed.authDomain);
      if (parsed.storageBucket) setStorageBucket(parsed.storageBucket);
      if (parsed.messagingSenderId) setMessagingSenderId(parsed.messagingSenderId);
      if (parsed.appId) setAppId(parsed.appId);
      setSuccessMessage('Auto-detected Firebase config from pasted snippet! ✓');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      // Regex fallbacks
      const extract = (keyName: string) => {
        const regex = new RegExp(`${keyName}["']?\\s*:\\s*["']([^"']+)["']`);
        const match = text.match(regex);
        return match ? match[1] : '';
      };
      const foundKey = extract('apiKey');
      const foundProject = extract('projectId');
      const foundApp = extract('appId');
      if (foundKey) setApiKey(foundKey);
      if (foundProject) setProjectId(foundProject);
      if (foundApp) setAppId(foundApp);
      const foundAuth = extract('authDomain');
      if (foundAuth) setAuthDomain(foundAuth);
      const foundBucket = extract('storageBucket');
      if (foundBucket) setStorageBucket(foundBucket);
      const foundSender = extract('messagingSenderId');
      if (foundSender) setMessagingSenderId(foundSender);

      if (foundKey || foundProject) {
        setSuccessMessage('Extracted config properties! ✓');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!apiKey.trim() || !projectId.trim() || !appId.trim()) {
      setErrorMessage('API Key, Project ID, and App ID are required.');
      return;
    }

    setLoading(true);
    const config: FirebaseSyncConfig = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
      syncKey: syncKey.trim() || 'personal_reset_week',
    };

    const res = await connectFirebase(config);
    setLoading(false);

    if (res.success) {
      setSuccessMessage('Connected! All devices with this Sync Key are now synchronizing in real time.');
    } else {
      setErrorMessage(res.error || 'Connection failed. Please verify credentials and Firestore rules.');
    }
  };

  const handleDisconnect = () => {
    if (confirm('Disconnect Firebase cloud sync? Your local data will be preserved.')) {
      disconnectFirebase();
      setSuccessMessage('Disconnected from cloud sync.');
      setTimeout(() => setSuccessMessage(null), 2500);
    }
  };

  const copySyncKey = () => {
    navigator.clipboard.writeText(syncKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Firebase Realtime Cloud Sync</span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Keep phone, laptop & tablet 100% in sync at the same time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Card */}
        <div className="p-3.5 rounded-xl border bg-neutral-950/70 space-y-2 border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span
                className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                  syncStatus === 'connected'
                    ? 'bg-emerald-500'
                    : syncStatus === 'syncing'
                    ? 'bg-amber-400'
                    : 'bg-neutral-500'
                }`}
              />
              <span className="text-xs font-semibold text-white">
                {syncStatus === 'connected' && '🟢 Live Cloud Sync Active'}
                {syncStatus === 'syncing' && '🟡 Synchronizing with Cloud...'}
                {syncStatus === 'offline' && '🔴 Offline (Queued in Local Cache)'}
                {syncStatus === 'unconfigured' && '⚪ Local Mode Only (Not Connected)'}
              </span>
            </div>

            {syncStatus === 'connected' && (
              <button
                type="button"
                onClick={forceSyncNow}
                className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
                title="Force sync now"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync Now</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
              <span>Mobile Phone</span>
              <span className="text-neutral-600">⇄</span>
              <Laptop className="w-3.5 h-3.5 text-neutral-400" />
              <span>Laptop / PC</span>
            </span>
            <span>
              {lastSyncedAt ? `Last synced: ${lastSyncedAt}` : 'Local data active'}
            </span>
          </div>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="p-3 bg-rose-950/30 border border-rose-800/50 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleConnect} className="space-y-3.5">
          {/* Quick Paste Box */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-300 mb-1">
              ⚡ Quick Paste from Firebase Console (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Paste const firebaseConfig = { ... } snippet from Firebase Console here..."
              value={jsonInput}
              onChange={(e) => handleJsonPaste(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                API Key *
              </label>
              <input
                type="text"
                required
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                Project ID *
              </label>
              <input
                type="text"
                required
                placeholder="my-reset-week"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                App ID *
              </label>
              <input
                type="text"
                required
                placeholder="1:123456789:web:..."
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                Private Sync Key / PIN
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="personal_reset_week"
                  value={syncKey}
                  onChange={(e) => setSyncKey(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-amber-500 pr-8"
                />
                <button
                  type="button"
                  onClick={copySyncKey}
                  className="absolute right-2 top-2.5 text-neutral-500 hover:text-white transition-colors"
                  title="Copy sync key"
                >
                  {copiedKey ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>{syncStatus === 'connected' ? 'Update & Sync All Devices' : 'Connect & Enable Realtime Sync'}</span>
            </button>

            {syncStatus === 'connected' && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs rounded-xl transition-colors"
              >
                Disconnect
              </button>
            )}
          </div>
        </form>

        {/* Setup Help Guide */}
        <div className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-xl space-y-1.5 text-[11px] text-neutral-400">
          <div className="flex items-center justify-between text-neutral-300 font-semibold">
            <span>Where to get this in 1 minute?</span>
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1 text-[10px]"
            >
              <span>Firebase Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <ol className="list-decimal list-inside space-y-0.5 text-neutral-400">
            <li>Open Firebase Console & create or open your project.</li>
            <li>Click <strong>Firestore Database</strong> → <strong>Create database</strong>.</li>
            <li>Project Settings → General → Click <strong>Web app (`&lt;/&gt;`)</strong>.</li>
            <li>Copy the `firebaseConfig` and paste it into the box above!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
