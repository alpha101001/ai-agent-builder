import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { Skill, Layer } from '../../types'

// ################ Drag-and-Drop Wrapper ##################
// Wraps @dnd-kit/core DndContext with configured sensors for both
// pointer (mouse/touch) and keyboard accessibility. Manages the
// active drag item for the DragOverlay, which shows a floating
// preview of the dragged card.
//
// Drag events are categorized by data.type:
// - 'skill': dragging from SkillPool or reordering in SelectedSkills
// - 'layer': dragging from LayerPool or reordering in SelectedLayers
//
// The onSkillAdd/onLayerAdd callbacks handle pool→selected drops.
// Reordering within selected zones is handled by SortableContext internally.

interface DndWrapperProps {
  children: ReactNode
  skills: Skill[]
  layers: Layer[]
  onSkillAdd: (skillId: string) => void
  onLayerAdd: (layerId: string) => void
  onSkillReorder: (oldIndex: number, newIndex: number) => void
  onLayerReorder: (oldIndex: number, newIndex: number) => void
  selectedSkillIds: string[]
  selectedLayerIds: string[]
}

export function DndWrapper({
  children,
  skills,
  layers,
  onSkillAdd,
  onLayerAdd,
  onSkillReorder,
  onLayerReorder,
  selectedSkillIds,
  selectedLayerIds,
}: DndWrapperProps) {
  const [activeItem, setActiveItem] = useState<{ type: 'skill' | 'layer'; id: string } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const type = active.data.current?.type as 'skill' | 'layer' | undefined
    if (type) {
      setActiveItem({ type, id: String(active.id) })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)

    if (!over) return

    const activeType = active.data.current?.type as string
    const activeSource = active.data.current?.source as string
    const overId = String(over.id)

    // Pool → Selected zone drop
    if (activeSource === 'pool') {
      if (activeType === 'skill' && (overId === 'selected-skills' || over.data.current?.type === 'skill')) {
        onSkillAdd(String(active.id))
      } else if (activeType === 'layer' && (overId === 'selected-layers' || over.data.current?.type === 'layer')) {
        onLayerAdd(String(active.id))
      }
      return
    }

    // Reorder within selected zone
    if (activeSource === 'selected' && active.id !== over.id) {
      if (activeType === 'skill') {
        const oldIndex = selectedSkillIds.indexOf(String(active.id))
        const newIndex = selectedSkillIds.indexOf(overId)
        if (oldIndex !== -1 && newIndex !== -1) {
          onSkillReorder(oldIndex, newIndex)
        }
      } else if (activeType === 'layer') {
        const oldIndex = selectedLayerIds.indexOf(String(active.id))
        const newIndex = selectedLayerIds.indexOf(overId)
        if (oldIndex !== -1 && newIndex !== -1) {
          onLayerReorder(oldIndex, newIndex)
        }
      }
    }
  }

  const getOverlayContent = () => {
    if (!activeItem) return null

    if (activeItem.type === 'skill') {
      const skill = skills.find(s => s.id === activeItem.id)
      if (!skill) return null
      return (
        <div className="glass-bright rounded-xl border border-violet-500/50 glow-violet shadow-2xl px-4 py-3 opacity-95 rotate-2">
          <span className="font-medium text-sm text-white/90">{skill.name}</span>
        </div>
      )
    }

    const layer = layers.find(l => l.id === activeItem.id)
    if (!layer) return null
    return (
      <div className="glass-bright rounded-xl border border-violet-500/50 glow-violet shadow-2xl px-4 py-3 opacity-95 rotate-2">
        <span className="font-medium text-sm text-white/90">{layer.name}</span>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {getOverlayContent()}
      </DragOverlay>
    </DndContext>
  )
}

// #################################################
