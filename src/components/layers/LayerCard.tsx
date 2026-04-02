import { useDraggable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '../../lib/utils'
import { LAYER_TYPE_COLORS } from '../../lib/constants'
import type { Layer } from '../../types'

interface LayerCardPoolProps {
  layer: Layer
  onAdd: (id: string) => void
}

export function LayerCardPool({ layer, onAdd }: LayerCardPoolProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: layer.id,
    data: { type: 'layer', source: 'pool' },
  })

  const colors = LAYER_TYPE_COLORS[layer.type]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onAdd(layer.id)
    }
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={0}
      onClick={() => onAdd(layer.id)}
      onKeyDown={handleKeyDown}
      className={cn(
        'rounded-xl border-l-4 glass p-3 cursor-grab transition-all duration-200',
        'hover:bg-white/[0.08] hover:-translate-y-0.5 active:cursor-grabbing',
        'focus:outline-none focus:ring-2 focus:ring-violet-500/50',
        colors.border,
        isDragging && 'opacity-40 shadow-lg scale-95'
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-medium text-sm text-white/80">{layer.name}</h4>
        <span className={cn('text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full', colors.badge)}>
          {layer.type}
        </span>
      </div>
      <p className="text-[11px] text-white/35 line-clamp-2 leading-relaxed">{layer.description}</p>
    </div>
  )
}

interface LayerCardSelectedProps {
  layer: Layer
  onRemove: (id: string) => void
}

export function LayerCardSelected({ layer, onRemove }: LayerCardSelectedProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: layer.id,
    data: { type: 'layer', source: 'selected' },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const colors = LAYER_TYPE_COLORS[layer.type]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 rounded-xl border-l-4 px-3 py-2 glass transition-all duration-150',
        'hover:bg-white/[0.07]',
        colors.border,
        isDragging && 'opacity-40 shadow-lg z-10 scale-95'
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-white/25 hover:text-white/50 transition-colors" aria-label="Drag to reorder">
        ⠿
      </div>
      <span className={cn('text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full shrink-0', colors.badge)}>
        {layer.type}
      </span>
      <span className="text-xs font-medium text-white/70 flex-1 truncate">{layer.name}</span>
      <button
        onClick={() => onRemove(layer.id)}
        className="text-white/25 hover:text-red-400 transition-colors shrink-0 text-base leading-none focus:outline-none"
        aria-label={`Remove ${layer.name}`}
      >
        ×
      </button>
    </div>
  )
}
