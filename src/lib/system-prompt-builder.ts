import type { SavedAgent, AgentData } from '../types'

// ################ System Prompt Builder ##################
// Assembles a complete system prompt from the agent's configuration:
// 1. Base profile persona (from data.json)
// 2. Active skills (loaded from /public/skills/{id}.md)
// 3. Active layers (loaded from /public/layers/{id}.md)
//
// Each .md file is a modular prompt fragment. Combining them gives
// the LLM a rich, specific behavioral spec for this exact agent config.
//
// Files are cached in a module-level Map to avoid redundant fetches
// across multiple chat opens within the same browser session.

const mdCache = new Map<string, string>()

async function fetchMdFile(path: string): Promise<string | null> {
  if (mdCache.has(path)) return mdCache.get(path)!

  try {
    const res = await fetch(path)
    if (!res.ok) return null
    const text = await res.text()
    mdCache.set(path, text)
    return text
  } catch {
    return null
  }
}

export async function buildSystemPrompt(
  agent: SavedAgent,
  data: AgentData
): Promise<string> {
  const profile = data.agentProfiles.find(p => p.id === agent.profileId)

  // Fetch skill and layer .md files in parallel
  const [skillContents, layerContents] = await Promise.all([
    Promise.all(
      agent.skillIds.map(id => fetchMdFile(`/skills/${id}.md`))
    ),
    Promise.all(
      agent.layerIds.map(id => fetchMdFile(`/layers/${id}.md`))
    ),
  ])

  const parts: string[] = []

  // Base persona
  parts.push(`# Agent Identity`)
  if (profile) {
    parts.push(`You are a ${profile.name}. ${profile.description}`)
  } else {
    parts.push(`You are a helpful AI assistant.`)
  }
  parts.push(`Your name is "${agent.name}".`)

  // Skills section
  const activeSkills = skillContents.filter(Boolean) as string[]
  if (activeSkills.length > 0) {
    parts.push(`\n# Capabilities & Skills`)
    parts.push(`You have been configured with the following skills and abilities:`)
    activeSkills.forEach(content => parts.push(`\n${content}`))
  }

  // Layers section
  const activeLayers = layerContents.filter(Boolean) as string[]
  if (activeLayers.length > 0) {
    parts.push(`\n# Behavioral Instructions`)
    parts.push(`Apply the following behavioral layers to ALL your responses:`)
    activeLayers.forEach(content => parts.push(`\n${content}`))
  }

  // Closing instruction
  parts.push(`\n# General Guidelines`)
  parts.push(`Always stay in character as defined above. Be genuinely helpful, accurate, and consistent with your configured persona, skills, and behavioral layers.`)

  return parts.join('\n')
}
