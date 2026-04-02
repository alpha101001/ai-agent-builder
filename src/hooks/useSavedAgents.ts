import { useLocalStorage } from './useLocalStorage'
import type { SavedAgent } from '../types'

// ################ useSavedAgents Hook ##################
// Manages the saved agents collection with localStorage persistence.
// Uses unique IDs (crypto.randomUUID) instead of array indices for
// safe deletion. Provides CRUD operations: save, delete, clearAll.

interface SaveAgentInput {
  name: string
  profileId: string
  skillIds: string[]
  layerIds: string[]
  provider: string
}

export function useSavedAgents() {
  const [savedAgents, setSavedAgents] = useLocalStorage<SavedAgent[]>('savedAgents', [])

  const saveAgent = (input: SaveAgentInput): SavedAgent => {
    const newAgent: SavedAgent = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: Date.now(),
    }
    setSavedAgents(prev => [...prev, newAgent])
    return newAgent
  }

  const updateAgent = (id: string, input: SaveAgentInput): void => {
    setSavedAgents(prev =>
      prev.map(agent =>
        agent.id === id
          ? { ...agent, ...input }
          : agent
      )
    )
  }

  const deleteAgent = (id: string) => {
    setSavedAgents(prev => prev.filter(agent => agent.id !== id))
  }

  const clearAll = () => {
    setSavedAgents([])
  }

  const replaceAll = (agents: SavedAgent[]) => {
    setSavedAgents(agents)
  }

  return { savedAgents, saveAgent, updateAgent, deleteAgent, clearAll, replaceAll }
}

// #################################################
