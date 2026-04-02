import { useState, useEffect } from 'react'

// ################ useLocalStorage Hook ##################
// Generic hook that syncs React state with browser localStorage.
// Reads the stored value on mount, falls back to initialValue if
// the key is missing or the JSON is corrupted. Writes back to
// localStorage whenever the value changes via the returned setter.

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // localStorage full or unavailable — silently ignore
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

// #################################################
