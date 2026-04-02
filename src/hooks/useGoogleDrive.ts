import { useState, useCallback } from 'react'
import type { SavedAgent } from '../types'

// ################ useGoogleDrive Hook ##################
// Uses the Drive REST API directly (no gapi dependency) to read
// and write a single JSON file in the app's private appDataFolder.
//
// The appDataFolder is hidden from the user's Drive file list but
// fully accessible to this app — ideal for syncing config data.
//
// File stored: ai-agent-builder.json → JSON array of SavedAgent[]

const DRIVE_API = 'https://www.googleapis.com/drive/v3'
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3'
const FILE_NAME = 'ai-agent-builder.json'

async function findFile(token: string): Promise<string | null> {
  const params = new URLSearchParams({
    spaces: 'appDataFolder',
    q: `name='${FILE_NAME}'`,
    fields: 'files(id)',
  })
  const res = await fetch(`${DRIVE_API}/files?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Drive list failed: ${res.status}`)
  const data = await res.json() as { files: { id: string }[] }
  return data.files?.[0]?.id ?? null
}

async function createFile(token: string, content: string): Promise<void> {
  const metadata = { name: FILE_NAME, parents: ['appDataFolder'] }
  const form = new FormData()
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
  form.append('file', new Blob([content], { type: 'application/json' }))
  const res = await fetch(`${UPLOAD_API}/files?uploadType=multipart`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  if (!res.ok) throw new Error(`Drive create failed: ${res.status}`)
}

async function patchFile(token: string, fileId: string, content: string): Promise<void> {
  const res = await fetch(`${UPLOAD_API}/files/${fileId}?uploadType=media`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: content,
  })
  if (!res.ok) throw new Error(`Drive patch failed: ${res.status}`)
}

async function downloadFile(token: string, fileId: string): Promise<SavedAgent[]> {
  const res = await fetch(`${DRIVE_API}/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Drive download failed: ${res.status}`)
  return res.json() as Promise<SavedAgent[]>
}

export function useGoogleDrive(accessToken: string | null) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSynced, setLastSynced] = useState<number | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)

  const syncToDrive = useCallback(
    async (agents: SavedAgent[]): Promise<boolean> => {
      if (!accessToken) return false
      setIsSyncing(true)
      setSyncError(null)
      try {
        const content = JSON.stringify(agents)
        const existingId = await findFile(accessToken)
        if (existingId) {
          await patchFile(accessToken, existingId, content)
        } else {
          await createFile(accessToken, content)
        }
        setLastSynced(Date.now())
        return true
      } catch (err) {
        setSyncError(err instanceof Error ? err.message : 'Sync failed')
        return false
      } finally {
        setIsSyncing(false)
      }
    },
    [accessToken]
  )

  const loadFromDrive = useCallback(async (): Promise<SavedAgent[] | null> => {
    if (!accessToken) return null
    setIsSyncing(true)
    setSyncError(null)
    try {
      const fileId = await findFile(accessToken)
      if (!fileId) return null
      return await downloadFile(accessToken, fileId)
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Load failed')
      return null
    } finally {
      setIsSyncing(false)
    }
  }, [accessToken])

  return { syncToDrive, loadFromDrive, isSyncing, lastSynced, syncError }
}

// #################################################
