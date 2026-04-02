// ################ Chat Simulation Engine ##################
// Core engine that generates simulated agent responses based on the
// agent's profile, skills, and layers. No real AI backend is needed.
//
// How it works:
// 1. Profile determines WHAT the agent says (domain-specific templates)
// 2. Skills trigger rich action cards (search results, code blocks, etc.)
// 3. Layers TRANSFORM the response style (pirate-speak, concise, CoT, etc.)
//
// The engine keyword-matches the user's message against profile templates,
// attaches skill action cards for relevant skills, then applies layer
// transforms in order to produce the final response.

import type { SkillActionResult } from '../types'
import {
  PROFILE_RESPONSES,
  SKILL_ACTION_TEMPLATES,
} from './response-templates'

// ################ Layer Transform Functions ##################
// Each layer modifies the response text in a distinctive way.
// Applied in the order the user arranged them (drag-and-drop order matters).

const LAYER_TRANSFORMS: Record<string, (text: string) => string> = {
  ly_cot: (text) => {
    return `🧠 **Thinking step by step...**\n\n` +
      `**Step 1:** Let me understand what's being asked here.\n` +
      `**Step 2:** I'll consider the key factors and constraints.\n` +
      `**Step 3:** Now I'll formulate my response based on my analysis.\n\n` +
      `**Conclusion:**\n${text}`
  },

  ly_reflexion: (text) => {
    return `${text}\n\n` +
      `🔄 **Self-check:** Let me verify my response...\n` +
      `✅ Accuracy: Response aligns with known facts\n` +
      `✅ Completeness: Key points are addressed\n` +
      `✅ Clarity: Language is clear and actionable`
  },

  ly_sarcasm: (text) => {
    const sarcaticPrefixes = [
      "Oh, what a *delightfully* original question. But fine, I'll help anyway.\n\n",
      "Wow, nobody's *ever* asked that before. 🙄 But since you did...\n\n",
      "Well, aren't you just full of surprises. Let me grace you with my wisdom.\n\n",
    ]
    const prefix = sarcaticPrefixes[Math.floor(Math.random() * sarcaticPrefixes.length)]
    return prefix + text
  },

  ly_pirate: (text) => {
    const pirateText = text
      .replace(/\bHello\b/gi, 'Ahoy')
      .replace(/\bHi\b/gi, 'Ahoy')
      .replace(/\bfriend\b/gi, 'matey')
      .replace(/\bmy\b/gi, "me")
      .replace(/\byou\b/gi, 'ye')
      .replace(/\byour\b/gi, "yer")
      .replace(/\bis\b/gi, 'be')
      .replace(/\bare\b/gi, 'be')
      .replace(/\bmoney\b/gi, 'doubloons')
      .replace(/\bwork\b/gi, "plunder")
    return `🏴‍☠️ ${pirateText}\n\nArr, that be me answer, ye scurvy dog! ⚓`
  },

  ly_memory: (text) => {
    return `💾 *Checking long-term memory...*\n\n${text}\n\n` +
      `📝 *This interaction has been saved to memory for future reference.*`
  },

  ly_empathetic: (text) => {
    const empathyPrefixes = [
      "I completely understand how you feel about this. ",
      "Thank you for sharing that with me. I want you to know I'm here to help. ",
      "I appreciate you reaching out — let's work through this together. ",
    ]
    const prefix = empathyPrefixes[Math.floor(Math.random() * empathyPrefixes.length)]
    return `💙 ${prefix}\n\n${text}\n\n*I'm always here if you need more support.*`
  },

  ly_fact_checker: (text) => {
    return `${text}\n\n` +
      `📋 **Fact-check report:**\n` +
      `• Claims verified: 3/3 ✅\n` +
      `• Sources cross-referenced: 2 databases\n` +
      `• Confidence level: High (92%)\n` +
      `• Last verified: Just now`
  },

  ly_concise: (text) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    if (sentences.length <= 2) return text
    const key = sentences.slice(0, 2).map(s => s.trim()).join('. ') + '.'
    return `⚡ ${key}`
  },

  ly_multi_agent: (text) => {
    return `👥 **Multi-agent deliberation:**\n\n` +
      `**Expert A** (Domain Specialist): "${text.slice(0, Math.min(100, text.length))}..."\n\n` +
      `**Expert B** (Critical Reviewer): "I agree with the core approach, but we should also consider edge cases and potential limitations."\n\n` +
      `**Expert C** (Synthesizer): "Combining both perspectives, here's the consensus:"\n\n` +
      `📋 **Consensus response:**\n${text}`
  },

  ly_code_optimizer: (text) => {
    return `⚡ **Performance-focused analysis:**\n\n${text}\n\n` +
      `🔧 **Optimization notes:**\n` +
      `• Time complexity: Considered ✅\n` +
      `• Space complexity: Optimized ✅\n` +
      `• Best practices: Applied ✅`
  },

  ly_shakespeare: (text) => {
    const bard = text
      .replace(/\byou\b/gi, 'thou')
      .replace(/\byour\b/gi, 'thy')
      .replace(/\bare\b/gi, 'art')
      .replace(/\bis\b/gi, "'tis")
      .replace(/\bdo not\b/gi, 'doth not')
      .replace(/\bvery\b/gi, 'most')
    return `🎭 *Hark! Attend mine words well:*\n\n${bard}\n\n*Thus I have spoken, and the curtain falls. 🌹*`
  },

  ly_markdown: (text) => {
    if (text.includes('```') || text.includes('**') || text.includes('##')) {
      return text
    }
    return `## Response\n\n${text}\n\n---\n*Formatted with Markdown Enforcer*`
  },
}

// ################ Generate Response Function ##################
// Main entry point: takes user message, profile, skill IDs, and layer IDs.
// Returns the response text and any skill action cards to display.

interface GenerateResponseParams {
  userMessage: string
  profileId: string
  skillIds: string[]
  layerIds: string[]
}

interface SimulatedResponse {
  text: string
  skillCards: SkillActionResult[]
}

export function generateResponse({
  userMessage,
  profileId,
  skillIds,
  layerIds,
}: GenerateResponseParams): SimulatedResponse {
  const profileTemplates = PROFILE_RESPONSES[profileId]
  let responseText: string

  if (!profileTemplates) {
    responseText = "I'm ready to help! Could you tell me more about what you need?"
  } else {
    responseText = matchTemplate(userMessage, profileTemplates)
  }

  const skillCards = generateSkillCards(userMessage, skillIds)

  for (const layerId of layerIds) {
    const transform = LAYER_TRANSFORMS[layerId]
    if (transform) {
      responseText = transform(responseText)
    }
  }

  return { text: responseText, skillCards }
}

// ################ Greeting Generator ##################
// Returns a random greeting for the active agent's profile.

export function generateGreeting(profileId: string): string {
  const profileTemplates = PROFILE_RESPONSES[profileId]
  if (!profileTemplates) {
    return "Hello! I'm your AI agent. How can I help you today?"
  }
  const greetings = profileTemplates.greeting
  return greetings[Math.floor(Math.random() * greetings.length)]
}

// ################ Template Matching (Internal) ##################
// Matches user message keywords against profile templates.
// Falls back to generic responses when no keyword match is found.

function matchTemplate(message: string, templates: { templates: { keywords: string[]; responses: string[] }[]; fallback: string[] }): string {
  const lowerMessage = message.toLowerCase()

  for (const template of templates.templates) {
    const matched = template.keywords.some(kw => lowerMessage.includes(kw))
    if (matched) {
      return template.responses[Math.floor(Math.random() * template.responses.length)]
    }
  }

  return templates.fallback[Math.floor(Math.random() * templates.fallback.length)]
}

// ################ Skill Card Generation (Internal) ##################
// For each active skill, checks if the user's message is relevant
// and generates a rich action card if so.

function generateSkillCards(message: string, skillIds: string[]): SkillActionResult[] {
  const cards: SkillActionResult[] = []
  const lowerMessage = message.toLowerCase()

  const SKILL_TRIGGERS: Record<string, string[]> = {
    sk_search: ['search', 'find', 'look up', 'google', 'what is', 'how to', 'who is'],
    sk_code: ['code', 'run', 'execute', 'script', 'function', 'program'],
    sk_db: ['query', 'database', 'sql', 'table', 'data', 'records'],
    sk_email: ['email', 'send', 'mail', 'message', 'draft'],
    sk_calendar: ['calendar', 'schedule', 'meeting', 'event', 'appointment'],
    sk_pdf_parse: ['pdf', 'document', 'parse', 'extract'],
    sk_image_gen: ['image', 'picture', 'generate', 'draw', 'create image'],
    sk_data_analysis: ['analyze', 'analysis', 'statistics', 'trend', 'metric', 'chart'],
    sk_translate: ['translate', 'translation', 'language', 'spanish', 'french'],
    sk_web_scrape: ['scrape', 'crawl', 'extract', 'website data'],
    sk_git: ['git', 'commit', 'push', 'branch', 'merge', 'repo'],
    sk_social: ['post', 'social', 'twitter', 'linkedin', 'share'],
  }

  for (const skillId of skillIds) {
    const triggers = SKILL_TRIGGERS[skillId]
    const template = SKILL_ACTION_TEMPLATES[skillId]
    if (!triggers || !template) continue

    const isTriggered = triggers.some(t => lowerMessage.includes(t))
    if (isTriggered) {
      const result = template.getResult(message)
      cards.push({
        skillId,
        skillName: skillId.replace('sk_', '').replace(/_/g, ' '),
        type: result.title.toLowerCase().includes('search') ? 'search'
          : result.title.toLowerCase().includes('code') ? 'code'
          : result.title.toLowerCase().includes('data') ? 'data'
          : 'generic',
        title: result.title,
        content: result.content,
      })
    }
  }

  return cards
}

// #################################################
