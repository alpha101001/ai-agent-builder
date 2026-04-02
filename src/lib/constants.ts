import type { Provider, SkillCategory, LayerType } from '../types'

// ################ Provider Configuration ##################
// List of AI providers with their associated brand colors (Tailwind classes).
// Used by ProviderCard to render distinct visual identities per provider.

// Dark-mode neon provider palette
export const PROVIDERS: { name: Provider; color: string; bgColor: string; icon: string; glow: string; neonBorder: string }[] = [
  { name: 'OpenRouter (Free)', color: 'text-teal-300',   bgColor: 'bg-teal-900/30 border-teal-500/40',    icon: '🆓', glow: 'glow-cyan',    neonBorder: 'border-neon-cyan' },
  { name: 'Claude',            color: 'text-orange-300', bgColor: 'bg-orange-900/30 border-orange-500/40', icon: '🧠', glow: 'glow-amber',   neonBorder: 'border-neon-amber' },
  { name: 'ChatGPT',           color: 'text-emerald-300',bgColor: 'bg-emerald-900/30 border-emerald-500/40',icon: '💬',glow: 'glow-emerald', neonBorder: 'border-neon-emerald' },
  { name: 'Gemini',            color: 'text-blue-300',   bgColor: 'bg-blue-900/30 border-blue-500/40',    icon: '✨', glow: 'glow-blue',    neonBorder: 'border-neon-blue' },
  { name: 'DeepSeek',          color: 'text-violet-300', bgColor: 'bg-violet-900/30 border-violet-500/40', icon: '🔍', glow: 'glow-violet',  neonBorder: 'border-neon-violet' },
  { name: 'Kimi',              color: 'text-rose-300',   bgColor: 'bg-rose-900/30 border-rose-500/40',    icon: '🌙', glow: 'glow-pink',    neonBorder: 'border-neon-pink' },
]

// ################ Provider API Key Links ##################
// Used in the ApiKeyModal to link users to where they can get their key.

export const PROVIDER_API_KEY_URLS: Partial<Record<Provider, string>> = {
  Claude: 'https://console.anthropic.com/settings/keys',
  ChatGPT: 'https://platform.openai.com/api-keys',
  Gemini: 'https://aistudio.google.com/apikey',
  DeepSeek: 'https://platform.deepseek.com/api_keys',
  Kimi: 'https://platform.moonshot.cn/console/api-keys',
}

// ################ Provider Default Models ##################
// Default model used per provider when calling the live chat API.

export const PROVIDER_MODELS: Record<Provider, string> = {
  'OpenRouter (Free)': 'nvidia/nemotron-3-super-120b-a12b:free',
  Claude: 'claude-sonnet-4-20250514',
  ChatGPT: 'gpt-4o-mini',
  Gemini: 'gemini-2.0-flash',
  DeepSeek: 'deepseek-chat',
  Kimi: 'moonshot-v1-8k',
}

// ################ Free Tier Config ##################
export const FREE_MESSAGE_LIMIT = 10
export const FREE_PROVIDER: Provider = 'OpenRouter (Free)'

// #################################################

// ################ Skill Category Colors ##################
// Maps skill categories to Tailwind color classes for consistent
// visual distinction between information and action skills.

export const SKILL_CATEGORY_COLORS: Record<SkillCategory, { bg: string; text: string; border: string; badge: string; glow: string }> = {
  information: {
    bg: 'bg-blue-900/20',
    text: 'text-blue-300',
    border: 'border-blue-500/40',
    badge: 'bg-blue-900/50 text-blue-300 border border-blue-500/30',
    glow: 'glow-blue',
  },
  action: {
    bg: 'bg-amber-900/20',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    badge: 'bg-amber-900/50 text-amber-300 border border-amber-500/30',
    glow: 'glow-amber',
  },
}

// #################################################

// ################ Layer Type Colors ##################
// Maps layer types to Tailwind color classes for visual grouping
// of reasoning, personality, context, and formatting layers.

export const LAYER_TYPE_COLORS: Record<LayerType, { bg: string; text: string; border: string; badge: string; glow: string }> = {
  reasoning: {
    bg: 'bg-violet-900/20',
    text: 'text-violet-300',
    border: 'border-violet-500/40',
    badge: 'bg-violet-900/50 text-violet-300 border border-violet-500/30',
    glow: 'glow-violet',
  },
  personality: {
    bg: 'bg-pink-900/20',
    text: 'text-pink-300',
    border: 'border-pink-500/40',
    badge: 'bg-pink-900/50 text-pink-300 border border-pink-500/30',
    glow: 'glow-pink',
  },
  context: {
    bg: 'bg-emerald-900/20',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30',
    glow: 'glow-emerald',
  },
  formatting: {
    bg: 'bg-cyan-900/20',
    text: 'text-cyan-300',
    border: 'border-cyan-500/40',
    badge: 'bg-cyan-900/50 text-cyan-300 border border-cyan-500/30',
    glow: 'glow-cyan',
  },
}

// #################################################

// ################ Profile Colors ##################
// Each profile gets a semantically meaningful brand color,
// mirroring the AI provider card pattern for instant recognition.

export const PROFILE_COLORS: Record<string, { color: string; glow: string; neonBorder: string }> = {
  profile_1:  { color: 'text-cyan-300',    glow: 'glow-cyan',    neonBorder: 'border-neon-cyan' },    // Customer Support
  profile_2:  { color: 'text-emerald-300', glow: 'glow-emerald', neonBorder: 'border-neon-emerald' }, // Code Assistant
  profile_3:  { color: 'text-blue-300',    glow: 'glow-blue',    neonBorder: 'border-neon-blue' },    // Data Analyst
  profile_4:  { color: 'text-pink-300',    glow: 'glow-pink',    neonBorder: 'border-neon-pink' },    // Creative Writer
  profile_5:  { color: 'text-amber-300',   glow: 'glow-amber',   neonBorder: 'border-neon-amber' },   // Sales Representative
  profile_6:  { color: 'text-violet-300',  glow: 'glow-violet',  neonBorder: 'border-neon-violet' },  // Financial Advisor
  profile_7:  { color: 'text-cyan-300',    glow: 'glow-cyan',    neonBorder: 'border-neon-cyan' },    // HR Assistant
  profile_8:  { color: 'text-amber-300',   glow: 'glow-amber',   neonBorder: 'border-neon-amber' },   // DevOps Engineer
  profile_9:  { color: 'text-blue-300',    glow: 'glow-blue',    neonBorder: 'border-neon-blue' },    // Legal Consultant
  profile_10: { color: 'text-pink-300',    glow: 'glow-pink',    neonBorder: 'border-neon-pink' },    // UI/UX Designer
}

// ################ Profile Icons ##################
// Emoji icons mapped to profile IDs for visual identification
// in the profile card grid.

export const PROFILE_ICONS: Record<string, string> = {
  profile_1: '🎧',
  profile_2: '💻',
  profile_3: '📊',
  profile_4: '✍️',
  profile_5: '💼',
  profile_6: '💰',
  profile_7: '👥',
  profile_8: '⚙️',
  profile_9: '⚖️',
  profile_10: '🎨',
}

// #################################################
