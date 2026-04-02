import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { LayerCardSelected } from './LayerCard'
import { EmptyState } from '../shared/EmptyState'
import { cn } from '../../lib/utils'
import type { Layer } from '../../types'

interface SelectedLayersProps {
  layers: Layer[]
  selectedLayerIds: string[]
  onRemove: (id: string) => void
}

export function SelectedLayers({ layers, selectedLayerIds, onRemove }: SelectedLayersProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'selected-layers' })

  const selectedLayers = selectedLayerIds
    .map(id => layers.find(l => l.id === id))
    .filter((l): l is Layer => l !== undefined)

  return (
    <div>
      <h3 className="text-sm font-semibold text-white/70 mb-2">
        Layers <span className="text-white/30 font-normal">({selectedLayers.length})</span>
      </h3>
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-[80px] rounded-xl p-2 transition-all duration-200',
          isOver ? 'drop-zone-over' : 'drop-zone-idle'
        )}
      >
        {selectedLayers.length === 0 ? (
          <EmptyState icon="🧩" message="Drag layers here or click to add" className="py-4" />
        ) : (
          <SortableContext items={selectedLayerIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-1.5">
              {selectedLayers.map(layer => (
                <LayerCardSelected key={layer.id} layer={layer} onRemove={onRemove} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  )
}
