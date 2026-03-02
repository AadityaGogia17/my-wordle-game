// src/lib/evaluate.ts
// Two-pass Wordle letter-evaluation algorithm.
// Matches NYT Wordle behaviour for duplicate letters exactly.

export type TileState = "correct" | "present" | "absent" | "empty" | "active"

/**
 * Evaluate a 5-letter guess against a 5-letter secret.
 *
 * Pass 1 – exact matches (green).
 *   Each exact-match letter is removed from the remaining pool so it
 *   cannot be double-counted in pass 2.
 *
 * Pass 2 – present-but-wrong-position (yellow).
 *   Each non-green guess letter is compared against the remaining pool
 *   frequency map.  If the letter still exists in the pool its count is
 *   decremented (preventing over-attribution when the same letter appears
 *   multiple times in the guess but fewer times in the secret).
 *
 * Examples (verified against NYT behaviour):
 *
 *   secret "CRANE", guess "EERIE"
 *     E@4 → correct  (pool: {C,R,A,N} – E exhausted)
 *     E@0 → absent   (pool[E] = 0)
 *     E@1 → absent   (pool[E] = 0)
 *     R@2 → present  (pool[R] → 0)
 *     I@3 → absent
 *   result: [absent, absent, present, absent, correct]
 *
 *   secret "SPEED", guess "NEEDS"
 *     E@2 → correct  (pool: {S,P,E,D})
 *     E@1 → present  (pool[E] → 0)
 *     N@0 → absent
 *     D@3 → present  (pool[D] → 0)
 *     S@4 → present  (pool[S] → 0)
 *   result: [absent, present, correct, present, present]
 */
export function evaluate(
  guess: string,
  secret: string
): ("correct" | "present" | "absent")[] {
  const result: ("correct" | "present" | "absent")[] = Array(5).fill("absent")

  // Build a mutable frequency map of the secret letters.
  const pool: Record<string, number> = {}
  for (const ch of secret) {
    pool[ch] = (pool[ch] ?? 0) + 1
  }

  // ── Pass 1: exact matches (green) ──────────────────────────────────────
  for (let i = 0; i < 5; i++) {
    if (guess[i] === secret[i]) {
      result[i] = "correct"
      pool[guess[i]]-- // consume this letter from the available pool
    }
  }

  // ── Pass 2: present-but-wrong-position (yellow) ────────────────────────
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue // already handled
    const remaining = pool[guess[i]] ?? 0
    if (remaining > 0) {
      result[i] = "present"
      pool[guess[i]]-- // prevent the next duplicate from also claiming yellow
    }
    // else: stays "absent"
  }

  return result
}
