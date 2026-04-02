import type { Provider } from '../types'

// ################ Provider Streaming Clients ##################
// Browser-direct streaming API clients for all supported AI providers.
// Each provider yields string chunks (tokens) via AsyncGenerator.
//
// Providers covered:
//   - OpenRouter (Free) — NVIDIA Nemotron, OpenAI-compatible SSE
//   - ChatGPT (OpenAI)  — OpenAI-compatible SSE
//   - Claude (Anthropic) — Custom SSE format, requires special header
//   - Gemini (Google)    — Custom SSE format, key in URL
//   - DeepSeek           — OpenAI-compatible SSE
//   - Kimi (Moonshot)    — OpenAI-compatible SSE

export class ProviderError extends Error {
  readonly provider: string
  readonly statusCode?: number

  constructor(message: string, provider: string, statusCode?: number) {
    super(message)
    this.name = 'ProviderError'
    this.provider = provider
    this.statusCode = statusCode
  }
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// ─── SSE helpers ─────────────────────────────────────────────────────────────

async function* readSSEStream(
  response: Response,
  parseLine: (line: string) => string | null,
  signal: AbortSignal
): AsyncGenerator<string> {
  if (!response.body) return
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      if (signal.aborted) return
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue
        const delta = parseLine(trimmed)
        if (delta) yield delta
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// Parses OpenAI-compatible SSE: "data: {...}"
function parseOpenAILine(line: string): string | null {
  if (!line.startsWith('data: ')) return null
  const json = line.slice(6)
  if (json === '[DONE]') return null
  try {
    const parsed = JSON.parse(json) as {
      choices?: Array<{ delta?: { content?: string } }>
    }
    return parsed.choices?.[0]?.delta?.content ?? null
  } catch {
    return null
  }
}

// Parses Anthropic SSE content_block_delta events
function parseAnthropicLine(line: string): string | null {
  if (!line.startsWith('data: ')) return null
  try {
    const parsed = JSON.parse(line.slice(6)) as {
      type?: string
      delta?: { type?: string; text?: string }
    }
    if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
      return parsed.delta.text ?? null
    }
    return null
  } catch {
    return null
  }
}

// Parses Gemini SSE — each data line is a full candidates JSON object
function parseGeminiLine(line: string): string | null {
  if (!line.startsWith('data: ')) return null
  try {
    const parsed = JSON.parse(line.slice(6)) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> }
      }>
    }
    return parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? null
  } catch {
    return null
  }
}

// ─── HTTP error handler ───────────────────────────────────────────────────────

async function handleHttpError(response: Response, provider: string): Promise<never> {
  let detail = ''
  try {
    const body = await response.text()
    const parsed = JSON.parse(body) as { error?: { message?: string }; message?: string }
    detail = parsed.error?.message ?? parsed.message ?? ''
  } catch { /* ignore parse errors */ }

  const messages: Record<number, string> = {
    401: `Invalid API key. Please check your ${provider} API key.`,
    403: `Access denied. Your ${provider} API key may not have the required permissions.`,
    429: `Rate limit exceeded. Please wait a moment and try again.`,
    500: `${provider} is currently experiencing issues. Please try again later.`,
    503: `${provider} is temporarily unavailable. Please try again later.`,
  }

  const msg = messages[response.status] ?? `${provider} returned an error (${response.status})${detail ? `: ${detail}` : ''}.`
  throw new ProviderError(msg, provider, response.status)
}

// ─── OpenRouter (Free tier) ───────────────────────────────────────────────────

async function* streamOpenRouter(
  messages: Message[],
  systemPrompt: string,
  model: string,
  signal: AbortSignal
): AsyncGenerator<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string
  if (!apiKey) throw new ProviderError('OpenRouter API key not configured.', 'OpenRouter (Free)')

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Agent Builder',
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
    signal,
  })

  if (!response.ok) await handleHttpError(response, 'OpenRouter (Free)')
  yield* readSSEStream(response, parseOpenAILine, signal)
}

// ─── OpenAI (ChatGPT) ─────────────────────────────────────────────────────────

async function* streamOpenAI(
  messages: Message[],
  systemPrompt: string,
  apiKey: string,
  model: string,
  signal: AbortSignal
): AsyncGenerator<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
    signal,
  })

  if (!response.ok) await handleHttpError(response, 'ChatGPT')
  yield* readSSEStream(response, parseOpenAILine, signal)
}

// ─── Anthropic (Claude) ───────────────────────────────────────────────────────

async function* streamAnthropic(
  messages: Message[],
  systemPrompt: string,
  apiKey: string,
  model: string,
  signal: AbortSignal
): AsyncGenerator<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      stream: true,
      messages,
    }),
    signal,
  })

  if (!response.ok) await handleHttpError(response, 'Claude')
  yield* readSSEStream(response, parseAnthropicLine, signal)
}

// ─── Google Gemini ────────────────────────────────────────────────────────────

async function* streamGemini(
  messages: Message[],
  systemPrompt: string,
  apiKey: string,
  model: string,
  signal: AbortSignal
): AsyncGenerator<string> {
  // Gemini uses "model" role instead of "assistant"
  const geminiMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: geminiMessages,
      system_instruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 4096 },
    }),
    signal,
  })

  if (!response.ok) await handleHttpError(response, 'Gemini')
  yield* readSSEStream(response, parseGeminiLine, signal)
}

// ─── DeepSeek (OpenAI-compatible) ─────────────────────────────────────────────

async function* streamDeepSeek(
  messages: Message[],
  systemPrompt: string,
  apiKey: string,
  model: string,
  signal: AbortSignal
): AsyncGenerator<string> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
    signal,
  })

  if (!response.ok) await handleHttpError(response, 'DeepSeek')
  yield* readSSEStream(response, parseOpenAILine, signal)
}

// ─── Kimi / Moonshot (OpenAI-compatible) ──────────────────────────────────────

async function* streamKimi(
  messages: Message[],
  systemPrompt: string,
  apiKey: string,
  model: string,
  signal: AbortSignal
): AsyncGenerator<string> {
  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
    signal,
  })

  if (!response.ok) await handleHttpError(response, 'Kimi')
  yield* readSSEStream(response, parseOpenAILine, signal)
}

// ─── Main dispatcher ──────────────────────────────────────────────────────────

import { PROVIDER_MODELS } from './constants'

export async function* streamProviderResponse(
  provider: Provider,
  messages: Message[],
  systemPrompt: string,
  apiKey: string | undefined,
  signal: AbortSignal
): AsyncGenerator<string> {
  if (signal.aborted) return

  const model = PROVIDER_MODELS[provider]

  switch (provider) {
    case 'OpenRouter (Free)':
      yield* streamOpenRouter(messages, systemPrompt, model, signal)
      break

    case 'ChatGPT':
      if (!apiKey) throw new ProviderError('ChatGPT API key is required.', 'ChatGPT')
      yield* streamOpenAI(messages, systemPrompt, apiKey, model, signal)
      break

    case 'Claude':
      if (!apiKey) throw new ProviderError('Claude API key is required.', 'Claude')
      yield* streamAnthropic(messages, systemPrompt, apiKey, model, signal)
      break

    case 'Gemini':
      if (!apiKey) throw new ProviderError('Gemini API key is required.', 'Gemini')
      yield* streamGemini(messages, systemPrompt, apiKey, model, signal)
      break

    case 'DeepSeek':
      if (!apiKey) throw new ProviderError('DeepSeek API key is required.', 'DeepSeek')
      yield* streamDeepSeek(messages, systemPrompt, apiKey, model, signal)
      break

    case 'Kimi':
      if (!apiKey) throw new ProviderError('Kimi API key is required.', 'Kimi')
      yield* streamKimi(messages, systemPrompt, apiKey, model, signal)
      break

    default:
      throw new ProviderError(`Unsupported provider: ${provider}`, provider as string)
  }
}
