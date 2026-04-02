import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SkillCardSelected } from './SkillCard'
import { EmptyState } from '../shared/EmptyState'
import { cn } from '../../lib/utils'
import type { Skill } from '../../types'

interface SelectedSkillsProps {
  skills: Skill[]
  selectedSkillIds: string[]
  onRemove: (id: string) => void
}

export function SelectedSkills({ skills, selectedSkillIds, onRemove }: SelectedSkillsProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'selected-skills' })

  const selectedSkills = selectedSkillIds
    .map(id => skills.find(s => s.id === id))
    .filter((s): s is Skill => s !== undefined)

  return (
    <div>
      <h3 className="text-sm font-semibold text-white/70 mb-2">
        Skills <span className="text-white/30 font-normal">({selectedSkills.length})</span>
      </h3>
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-[80px] rounded-xl p-2 transition-all duration-200',
          isOver ? 'drop-zone-over' : 'drop-zone-idle'
        )}
      >
        {selectedSkills.length === 0 ? (
          <EmptyState icon="🎯" message="Drag skills here or click to add" className="py-4" />
        ) : (
          <SortableContext items={selectedSkillIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-1.5">
              {selectedSkills.map(skill => (
                <SkillCardSelected key={skill.id} skill={skill} onRemove={onRemove} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  )
}
