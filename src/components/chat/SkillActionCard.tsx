import type { SkillActionResult } from '../../types'

// ################ Skill Action Card Component ##################
// Rich UI card displayed within chat when the agent triggers a skill.
// Different skill types get distinct visual treatments:
// - search: blue border, magnifying glass icon
// - code: green border, terminal icon
// - data: purple border, chart icon
// - email/calendar/image: themed appropriately
// - generic: neutral gray border

const SKILL_CARD_STYLES: Record<string, { border: string; bg: string; icon: string; text: string }> = {
  search:      { border: 'border-blue-500/40',    bg: 'bg-blue-900/15',    icon: '🔍', text: 'text-blue-300' },
  code:        { border: 'border-emerald-500/40', bg: 'bg-emerald-900/15', icon: '💻', text: 'text-emerald-300' },
  data:        { border: 'border-violet-500/40',  bg: 'bg-violet-900/15',  icon: '📊', text: 'text-violet-300' },
  email:       { border: 'border-amber-500/40',   bg: 'bg-amber-900/15',   icon: '📧', text: 'text-amber-300' },
  calendar:    { border: 'border-cyan-500/40',    bg: 'bg-cyan-900/15',    icon: '📅', text: 'text-cyan-300' },
  image:       { border: 'border-pink-500/40',    bg: 'bg-pink-900/15',    icon: '🎨', text: 'text-pink-300' },
  translation: { border: 'border-teal-500/40',    bg: 'bg-teal-900/15',    icon: '🌐', text: 'text-teal-300' },
  generic:     { border: 'border-white/[0.15]',   bg: 'bg-white/[0.04]',   icon: '⚡', text: 'text-white/60' },
}

interface SkillActionCardProps {
  card: SkillActionResult
}

export function SkillActionCard({ card }: SkillActionCardProps) {
  const style = SKILL_CARD_STYLES[card.type] || SKILL_CARD_STYLES.generic

  return (
    <div className={`border-l-4 ${style.border} ${style.bg} rounded-xl p-3 my-2 backdrop-blur-sm`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-base">{style.icon}</span>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${style.text}`}>
          {card.title}
        </span>
      </div>
      <div className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
        {card.content}
      </div>
    </div>
  )
}

// #################################################
