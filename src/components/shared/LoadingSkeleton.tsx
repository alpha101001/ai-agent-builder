function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass rounded-2xl p-4 animate-pulse ${className}`}>
      <div className="h-4 bg-white/[0.07] rounded-lg w-3/4 mb-3" />
      <div className="h-3 bg-white/[0.04] rounded-lg w-full mb-2" />
      <div className="h-3 bg-white/[0.04] rounded-lg w-2/3" />
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <section>
        <div className="h-5 bg-white/[0.06] rounded-lg w-40 mb-4 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
      <section>
        <div className="h-5 bg-white/[0.06] rounded-lg w-32 mb-4 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
      <section>
        <div className="h-5 bg-white/[0.06] rounded-lg w-36 mb-4 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
