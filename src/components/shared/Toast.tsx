import { useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { ToastContext, TOAST_STYLES } from './ToastContext'
import type { ToastItem } from './ToastContext'

// ################ Toast Provider Component ##################
// Renders toast notifications via a fixed-position container in
// the top-right corner. Auto-dismisses after 3 seconds.

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 3000)
  }, [removeToast])

  return (
    <ToastContext value={{ addToast }}>
      {children}
      <div
        className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`${TOAST_STYLES[toast.type]} px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3 animate-slide-in`}
            role="alert"
          >
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white shrink-0 text-lg leading-none"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  )
}

// #################################################
