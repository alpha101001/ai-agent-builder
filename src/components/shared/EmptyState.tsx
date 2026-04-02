interface EmptyStateProps {
  icon: string
  message: string
  className?: string
}

export function EmptyState({ icon, message, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 text-white/30 ${className}`}>
      <span className="text-2xl mb-2 opacity-50">{icon}</span>
      <p className="text-xs text-center leading-relaxed">{message}</p>
    </div>
  )
}
