import { LayerCardPool } from './LayerCard'
import type { Layer } from '../../types'

// ################ Layer Pool Component ##################
// Displays all available layers as draggable cards.
// Layers already selected are filtered out.

interface LayerPoolProps {
  layers: Layer[]
  selectedLayerIds: string[]
  onAdd: (id: string) => void
}

export function LayerPool({ layers, selectedLayerIds, onAdd }: LayerPoolProps) {
  const availableLayers = layers.filter(l => !selectedLayerIds.includes(l.id))

  if (availableLayers.length === 0) {
    return (
      <p className="text-sm text-white/40 text-center py-4">All layers have been added!</p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {availableLayers.map(layer => (
        <LayerCardPool key={layer.id} layer={layer} onAdd={onAdd} />
      ))}
    </div>
  )
}

// #################################################
