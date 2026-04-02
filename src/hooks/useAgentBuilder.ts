import { useState, useEffect, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

// ################ useAgentBuilder Hook ##################
// Manages the current agent builder state: selected profile, skills,
// layers, provider, and agent name. All state updates use functional
// updaters to prevent stale closures and ensure immutability.
//
// FIXES:
// - Bug #1 (direct state mutation): All array updates create new arrays
//   via functional updater `prev => [...prev, id]` instead of .push().
// - Bug #2 (stale closure): Analytics heartbeat effect includes agentName
//   in its dependency array so the interval always sees current value.
//
// Exposes reorder functions for dnd-kit sortable drag-and-drop.

export function useAgentBuilder() {
  const [selectedProfile, setSelectedProfile] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])
  const [selectedProvider, setSelectedProvider] = useState('')
  const [agentName, setAgentName] = useState('')
  const [sessionTime, setSessionTime] = useState(0)
  const [loadedAgentId, setLoadedAgentId] = useState<string | null>(null)

  // Ref so analytics interval always reads the latest name without restarting.
  // Keep the ref synchronized in an effect to avoid mutating refs during render.
  const agentNameRef = useRef('')
  useEffect(() => {
    agentNameRef.current = agentName
  }, [agentName])

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Analytics heartbeat — reads agentName via ref so the interval is set up
  // once and never restarted on every keystroke.
  useEffect(() => {
    const analyticsInterval = setInterval(() => {
      if (agentNameRef.current !== '') {
        // Analytics: user is working on a named agent
      }
    }, 8000)
    return () => clearInterval(analyticsInterval)
  }, [])

  // Bug #1 fix: immutable array updates via functional updaters
  const addSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId) ? prev : [...prev, skillId]
    )
  }

  const removeSkill = (skillId: string) => {
    setSelectedSkills(prev => prev.filter(id => id !== skillId))
  }

  const reorderSkills = (oldIndex: number, newIndex: number) => {
    setSelectedSkills(prev => arrayMove(prev, oldIndex, newIndex))
  }

  const addLayer = (layerId: string) => {
    setSelectedLayers(prev =>
      prev.includes(layerId) ? prev : [...prev, layerId]
    )
  }

  const removeLayer = (layerId: string) => {
    setSelectedLayers(prev => prev.filter(id => id !== layerId))
  }

  const reorderLayers = (oldIndex: number, newIndex: number) => {
    setSelectedLayers(prev => arrayMove(prev, oldIndex, newIndex))
  }

  const loadAgent = (agent: {
    id: string
    profileId: string
    skillIds: string[]
    layerIds: string[]
    provider: string
    name: string
  }) => {
    setSelectedProfile(agent.profileId || '')
    setSelectedSkills([...(agent.skillIds || [])])
    setSelectedLayers([...(agent.layerIds || [])])
    setSelectedProvider(agent.provider || '')
    setAgentName(agent.name)
    setLoadedAgentId(agent.id)
  }

  const reset = () => {
    setSelectedProfile('')
    setSelectedSkills([])
    setSelectedLayers([])
    setSelectedProvider('')
    setAgentName('')
    setLoadedAgentId(null)
  }

  return {
    selectedProfile,
    setSelectedProfile,
    selectedSkills,
    addSkill,
    removeSkill,
    reorderSkills,
    selectedLayers,
    addLayer,
    removeLayer,
    reorderLayers,
    selectedProvider,
    setSelectedProvider,
    agentName,
    setAgentName,
    sessionTime,
    loadedAgentId,
    loadAgent,
    reset,
  }
}

// #################################################
