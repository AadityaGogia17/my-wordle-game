// src/lib/wordSelect.ts
// Selects a random secret word from ANSWERS with non-repeat logic.
//
// Algorithm:
//   1. Load the set of already-used words from localStorage.
//   2. Filter ANSWERS to the unused pool.
//   3. If the pool is empty, the full list has been cycled – reset and use all.
//   4. Pick a cryptographically random index from the pool.
//   5. Persist the chosen word so it won't be chosen again this cycle.

import { ANSWERS } from "./words/answers"
import { ANSWERS6 } from "./words/answers6"
import { getUsedWords, markWordUsed, resetUsedWords } from "./storage"

export function selectWord(wordLength: number): string {
  const answerPool = wordLength === 6 ? ANSWERS6 : ANSWERS
  const used = getUsedWords(wordLength)
  let pool = answerPool.filter((w) => !used.has(w))

  // Full cycle complete – start fresh
  if (pool.length === 0) {
    resetUsedWords(wordLength)
    pool = [...answerPool]
  }

  // Unpredictable random index
  const idx =
    typeof crypto !== "undefined" && crypto.getRandomValues
      ? (crypto.getRandomValues(new Uint32Array(1))[0] % pool.length)
      : Math.floor(Math.random() * pool.length)

  const word = pool[idx]
  markWordUsed(word, wordLength)
  return word
}
