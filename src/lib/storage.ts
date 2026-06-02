// src/lib/storage.ts
// localStorage helpers for the non-repeat word selection.
// All access is wrapped so SSR / server-render never throws.

function usedKey(wordLength: number) {
  return `wordl_used_words_${wordLength}`
}

/** Return the set of answer words already played this cycle for a given length. */
export function getUsedWords(wordLength: number): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = window.localStorage.getItem(usedKey(wordLength))
    const arr: string[] = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

/** Persist a newly played word. */
export function markWordUsed(word: string, wordLength: number): void {
  if (typeof window === "undefined") return
  try {
    const used = getUsedWords(wordLength)
    used.add(word)
    window.localStorage.setItem(usedKey(wordLength), JSON.stringify([...used]))
  } catch {
    // localStorage unavailable (private-browsing quota, etc.) – silent fail
  }
}

/** Clear the used-words list for a given length (called when the full answer list is exhausted). */
export function resetUsedWords(wordLength: number): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(usedKey(wordLength))
  } catch {
    // silent fail
  }
}
