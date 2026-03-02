// src/lib/words/allowed.ts
// Validation dictionary – all valid 5-letter guesses accepted by the game.
//
// Source: dwyl/english-words (MIT License)
//   https://github.com/dwyl/english-words
//   Filtered to exactly 5 lowercase alphabetic characters.
//   Stored in allowed-list.json (regenerate with scripts/generate-wordlists.py).
//
// ANSWERS ⊂ ALLOWED is guaranteed: ALLOWED = Set(WORD_LIST) ∪ Set(ANSWERS)
// The explicit union ensures answer words are always valid guesses even if
// they are absent from the corpus (e.g. loanwords, informal spellings).

import { ANSWERS } from "./answers"
import WORD_LIST from "./allowed-list.json"

export const ALLOWED = new Set([...WORD_LIST, ...ANSWERS])
