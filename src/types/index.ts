// ################ Type Definitions for AI Agent Builder ##################
// All shared TypeScript interfaces and types used across the application.
// Matches the structure of /public/data.json with narrowed string literal
// types for category and type fields to enable type-safe color mapping.

export interface AgentProfile {
  id: string
  name: string
  description: string
}

export interface Skill {
  id: string
  name: string
  category: 'information' | 'action'
  description: string
}

export interface Layer {
  id: string
  name: string
  type: 'reasoning' | 'personality' | 'context' | 'formatting'
  description: string
}

export interface AgentData {
  agentProfiles: AgentProfile[]
  skills: Skill[]
  layers: Layer[]
}

export interface SavedAgent {
  id: string
  name: string
  profileId: string
  skillIds: string[]
  layerIds: string[]
  provider: string
  createdAt: number
}

export type Provider = 'Gemini' | 'ChatGPT' | 'Kimi' | 'Claude' | 'DeepSeek' | 'OpenRouter (Free)'

export type SkillCategory = Skill['category']
export type LayerType = Layer['type']

// ################ Chat Playground Types ##################
// Types for the simulated chat interface where users interact
// with their configured agent. Messages can contain text and
// optional skill action cards (rich UI from triggered skills).

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  skillCards?: SkillActionResult[]
  isStreaming?: boolean
}

export interface SkillActionResult {
  skillId: string
  skillName: string
  type: 'search' | 'code' | 'data' | 'email' | 'calendar' | 'image' | 'translation' | 'generic'
  title: string
  content: string
}

export interface ChatPlaygroundState {
  messages: ChatMessage[]
  isTyping: boolean
  activeAgent: SavedAgent | null
}

// #################################################
