// src/lib/words/allowed6.ts
// Validation dictionary – all valid 6-letter guesses accepted by the game.
//
// Source: dwyl/english-words (MIT License)
//   https://github.com/dwyl/english-words
//   Filtered to exactly 6 lowercase alphabetic characters.
//   Further filtered by Norvig Google Web Trillion Word Corpus frequency > 0
//   to remove obscure/proper-noun junk (same pipeline as allowed.ts for 5-letter).
//
// ANSWERS6 ⊂ ALLOWED6 is guaranteed: ALLOWED6 = Set(WORD_LIST6) ∪ Set(ANSWERS6)

import { ANSWERS6 } from "./answers6"
import WORD_LIST6 from "./allowed-list-6.json"
import { BLACKLIST } from "./blacklist"

export const ALLOWED6 = new Set([...WORD_LIST6, ...ANSWERS6].filter((w) => !BLACKLIST.has(w)))
