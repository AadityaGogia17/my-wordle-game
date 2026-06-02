// src/lib/words/blacklist.ts
// Words to explicitly reject as guesses regardless of what the source lists contain.
// Typically: technically-in-a-dictionary but primarily proper nouns, marginal plurals,
// or anything that feels wrong to a normal player.

export const BLACKLIST = new Set([
  "whens",   // marginal noun plural of "when" — not a word most people would know
  "shelly",  // real adjective ("abounding in shells") but overwhelmingly a proper noun
])
