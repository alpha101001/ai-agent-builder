import { useState, useEffect } from 'react'
import type { AgentData } from '../types'

// ################ useAgentData Hook ##################
// Fetches /data.json exactly once on mount. This fixes Bug #3 (redundant
// API calls) — the original code called fetchAPI() inside every event
// handler, re-fetching static data with a random 1-3s delay each time.
//
// Now: single fetch on mount, AbortController for cleanup, optional
// refetch exposed for manual reload. No artificial delay.

export function useAgentData() {
  const [data, setData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/data.json', { signal })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const jsonData: AgentData = await response.json()
      setData(jsonData)
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      const message = err instanceof Error ? err.message : 'Failed to fetch agent data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchData(controller.signal)
    return () => controller.abort()
  }, [])

  const refetch = () => fetchData()

  return { data, loading, error, refetch }
}

// #################################################
