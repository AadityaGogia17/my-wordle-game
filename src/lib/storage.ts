// src/lib/storage.ts
// localStorage helpers for the non-repeat word selection.
// All access is wrapped so SSR / server-render never throws.

const USED_KEY = "wordl_used_words"

/** Return the set of answer words already played this cycle. */
export function getUsedWords(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = window.localStorage.getItem(USED_KEY)
    const arr: string[] = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

/** Persist a newly played word. */
export function markWordUsed(word: string): void {
  if (typeof window === "undefined") return
  try {
    const used = getUsedWords()
    used.add(word)
    window.localStorage.setItem(USED_KEY, JSON.stringify([...used]))
  } catch {
    // localStorage unavailable (private-browsing quota, etc.) – silent fail
  }
}

/** Clear the used-words list (called when the full answer list is exhausted). */
export function resetUsedWords(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(USED_KEY)
  } catch {
    // silent fail
  }
}
