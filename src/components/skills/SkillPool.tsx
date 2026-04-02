import { SkillCardPool } from './SkillCard'
import type { Skill } from '../../types'

// ################ Skill Pool Component ##################
// Displays all available skills as draggable cards, grouped
// by category (information, action). Skills already selected
// are filtered out to prevent duplicate additions.

interface SkillPoolProps {
  skills: Skill[]
  selectedSkillIds: string[]
  onAdd: (id: string) => void
}

export function SkillPool({ skills, selectedSkillIds, onAdd }: SkillPoolProps) {
  const availableSkills = skills.filter(s => !selectedSkillIds.includes(s.id))

  if (availableSkills.length === 0) {
    return (
      <p className="text-sm text-white/40 text-center py-4">All skills have been added!</p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {availableSkills.map(skill => (
        <SkillCardPool key={skill.id} skill={skill} onAdd={onAdd} />
      ))}
    </div>
  )
}

// #################################################
