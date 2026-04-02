interface DriveConsentModalProps {
  isOpen: boolean
  onUnderstood: () => void
  onCancel: () => void
}

export function DriveConsentModal({ isOpen, onUnderstood, onCancel }: DriveConsentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative glass-bright rounded-2xl border border-violet-500/20 p-6 max-w-md w-full animate-fade-in"
        style={{ boxShadow: '0 0 40px rgba(139,92,246,0.15), 0 0 80px rgba(139,92,246,0.06)' }}
      >
        {/* Google Drive icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl glass flex items-center justify-center shrink-0">
            <svg viewBox="0 0 87.3 78" className="w-6 h-6" aria-hidden="true">
              <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0a15.6 15.6 0 0 0 2.1 7.8z" fill="#0066DA"/>
              <path d="M43.65 25L29.9 1.2a9.8 9.8 0 0 0-3.3 3.3L2.1 45.2A15.6 15.6 0 0 0 0 53H27.5z" fill="#00AC47"/>
              <path d="M73.55 76.8a9.8 9.8 0 0 0 3.3-3.3l1.6-2.75 7.65-13.25A15.6 15.6 0 0 0 88.3 50H60.8l5.85 11.2z" fill="#EA4335"/>
              <path d="M43.65 25L57.4 1.2A9.85 9.85 0 0 0 51.35 0H35.95c-2.55 0-4.85.7-6.05 1.2z" fill="#00832D"/>
              <path d="M60.8 50H27.5L13.75 73.8c1.35.8 2.9 1.2 4.55 1.2h50.7c1.65 0 3.2-.45 4.55-1.2z" fill="#2684FC"/>
              <path d="M73.4 26.5L59.65 3.5A9.8 9.8 0 0 0 57.4 1.2L43.65 25 60.8 50h27.45a15.6 15.6 0 0 0-2.1-7.8z" fill="#FFBA00"/>
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white/90">Google Drive Sync</h2>
            <p className="text-xs text-white/40">How your data is stored</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06] mb-4" />

        {/* Content */}
        <div className="space-y-3 mb-5">
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
            <p className="text-sm text-white/70">
              <span className="text-white/90 font-medium">Your data stays yours.</span>{' '}
              Agents are saved in a private, hidden folder in <span className="text-violet-300">your own Google Drive</span> — not on any server.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
            <p className="text-sm text-white/70">
              <span className="text-white/90 font-medium">Nobody else can see it.</span>{' '}
              Not even the app developer. The folder is app-specific and invisible in your regular Drive file list.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
            <p className="text-sm text-white/70">
              <span className="text-white/90 font-medium">Sync across devices.</span>{' '}
              Sign in on any device to restore your saved agents instantly.
            </p>
          </div>
        </div>

        {/* Permission note */}
        <div className="rounded-xl bg-violet-900/20 border border-violet-500/15 px-4 py-3 mb-5">
          <p className="text-xs text-white/50 leading-relaxed">
            <span className="text-violet-300 font-medium">Permission requested:</span>{' '}
            <code className="text-violet-200/70 text-[11px] bg-violet-900/30 px-1 py-0.5 rounded">drive.appdata</code>
            {' '}— read/write access to a private app folder only. No access to your files, emails, or other data.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 glass rounded-xl text-sm font-medium text-white/40 hover:text-white/60 border border-white/[0.07] transition-all focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onUnderstood}
            className="flex-1 py-2 btn-neon-violet rounded-xl text-sm font-semibold focus:outline-none flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 18 18" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Understood — Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}
