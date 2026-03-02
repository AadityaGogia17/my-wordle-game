"use client"

// src/hooks/useGame.ts
// All game state and keyboard handling in one hook.

import { useCallback, useEffect, useReducer } from "react"
import { evaluate, TileState } from "@/lib/evaluate"
import { ALLOWED } from "@/lib/words/allowed"
import { selectWord } from "@/lib/wordSelect"

// ── Constants ──────────────────────────────────────────────────────────────

export const MAX_GUESSES = 6
export const WORD_LENGTH = 5

// ── Types ──────────────────────────────────────────────────────────────────

export type GameStatus = "playing" | "won" | "lost"

export interface GameState {
  secretWord: string
  guesses: string[]                          // submitted guesses
  evaluations: ("correct" | "present" | "absent")[][] // per row
  currentInput: string                       // live typing buffer
  status: GameStatus
  message: string | null
  messageFadingOut: boolean                  // true while win toast is fading out
  letterStates: Record<string, "correct" | "present" | "absent"> // keyboard
  revealingRow: number | null               // row index currently flip-animating
  shakingRow: number | null                 // row index currently shake-animating
  shakeKey: number                          // increments per shake → alternates animation name
}

type Action =
  | { type: "KEY"; key: string }
  | { type: "SUBMIT" }
  | { type: "BACKSPACE" }
  | { type: "CLEAR_MESSAGE" }
  | { type: "START_FADE_MESSAGE" }
  | { type: "REVEAL_DONE" }
  | { type: "CLEAR_SHAKE" }
  | { type: "RESTART"; word: string }
  | { type: "INIT";    word: string }

// ── Helpers ────────────────────────────────────────────────────────────────

function buildInitialState(): GameState {
  // secretWord starts empty – it is set client-side via the INIT action
  // (useEffect) to avoid an SSR/client hydration mismatch caused by
  // selectWord() producing a different random result on server vs browser.
  return {
    secretWord: "",
    guesses: [],
    evaluations: [],
    currentInput: "",
    status: "playing",
    message: null,
    messageFadingOut: false,
    letterStates: {},
    revealingRow: null,
    shakingRow: null,
    shakeKey: 0,
  }
}

const WIN_MESSAGES = ["Genius!", "Magnificent!", "Impressive!", "Splendid!", "Great!", "Phew!"]

// Update the keyboard colour map with the latest evaluation.
// Priority: correct > present > absent (never downgrade a better state).
function mergeLetterStates(
  prev: Record<string, "correct" | "present" | "absent">,
  guess: string,
  evaluation: ("correct" | "present" | "absent")[]
): Record<string, "correct" | "present" | "absent"> {
  const priority = { correct: 3, present: 2, absent: 1 } as const
  const next = { ...prev }
  for (let i = 0; i < guess.length; i++) {
    const ch = guess[i]
    const newState = evaluation[i]
    const existing = next[ch]
    if (!existing || priority[newState] > priority[existing]) {
      next[ch] = newState
    }
  }
  return next
}

// ── Reducer ────────────────────────────────────────────────────────────────

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "KEY": {
      if (state.status !== "playing") return state
      if (state.revealingRow !== null) return state // lock input during animation
      if (state.currentInput.length >= WORD_LENGTH) return state
      return { ...state, currentInput: state.currentInput + action.key }
    }

    case "BACKSPACE": {
      if (state.status !== "playing") return state
      if (state.revealingRow !== null) return state
      return { ...state, currentInput: state.currentInput.slice(0, -1) }
    }

    case "INIT": {
      // Called once after hydration to set the first secret word.
      return { ...buildInitialState(), secretWord: action.word }
    }

    case "SUBMIT": {
      if (state.status !== "playing") return state
      if (state.revealingRow !== null) return state
      if (!state.secretWord) return state // guard: word not yet initialised

      const guess = state.currentInput.toLowerCase()

      if (guess.length < WORD_LENGTH) {
        return {
          ...state,
          message: "Not enough letters",
          shakingRow: state.guesses.length,
          shakeKey: state.shakeKey + 1,
        }
      }

      if (!ALLOWED.has(guess)) {
        return {
          ...state,
          message: "Not in word list",
          shakingRow: state.guesses.length,
          shakeKey: state.shakeKey + 1,
        }
      }

      const evaluation = evaluate(guess, state.secretWord)
      const newGuesses = [...state.guesses, guess]
      const newEvaluations = [...state.evaluations, evaluation]
      const newLetterStates = mergeLetterStates(state.letterStates, guess, evaluation)
      const rowIndex = newGuesses.length - 1

      const won = evaluation.every((s) => s === "correct")
      const lost = !won && newGuesses.length === MAX_GUESSES

      return {
        ...state,
        guesses: newGuesses,
        evaluations: newEvaluations,
        currentInput: "",
        letterStates: newLetterStates,
        revealingRow: rowIndex,
        // Status & message resolved after animation (REVEAL_DONE)
        status: won ? "won" : lost ? "lost" : "playing",
        message: null, // will be set in REVEAL_DONE
      }
    }

    case "REVEAL_DONE": {
      if (state.status === "won") {
        const idx = Math.min(state.guesses.length - 1, WIN_MESSAGES.length - 1)
        return { ...state, revealingRow: null, message: WIN_MESSAGES[idx] }
      }
      if (state.status === "lost") {
        return {
          ...state,
          revealingRow: null,
          message: `The word was ${state.secretWord.toUpperCase()}`,
        }
      }
      return { ...state, revealingRow: null }
    }

    case "START_FADE_MESSAGE": {
      // Begins the CSS fade-out on the win toast. CLEAR_MESSAGE fires 300ms
      // later to actually remove it from state once the animation finishes.
      return { ...state, messageFadingOut: true }
    }

    case "CLEAR_SHAKE": {
      return { ...state, shakingRow: null }
    }

    case "CLEAR_MESSAGE": {
      return { ...state, message: null, messageFadingOut: false }
    }

    case "RESTART": {
      // word is provided by the hook so selectWord() runs client-side only.
      return { ...buildInitialState(), secretWord: action.word }
    }

    default:
      return state
  }
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState)

  // ── Client-side word initialisation (avoids SSR/hydration mismatch) ───
  useEffect(() => {
    dispatch({ type: "INIT", word: selectWord() })
  }, [])

  // ── Physical keyboard ──────────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === "Enter") {
        dispatch({ type: "SUBMIT" })
      } else if (e.key === "Backspace") {
        dispatch({ type: "BACKSPACE" })
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        dispatch({ type: "KEY", key: e.key.toLowerCase() })
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // ── Auto-dismiss messages ──────────────────────────────────────────────
  useEffect(() => {
    if (!state.message) return

    if (state.status === "playing") {
      // Validation errors (not in word list, not enough letters) dismiss after 1.5 s
      const t = setTimeout(() => dispatch({ type: "CLEAR_MESSAGE" }), 1500)
      return () => clearTimeout(t)
    }

    if (state.status === "won") {
      // Win toast: fade out starts at 1700 ms, component unmounts at 2000 ms.
      // The 300 ms gap matches the CSS fade-out animation duration.
      const tFade  = setTimeout(() => dispatch({ type: "START_FADE_MESSAGE" }), 1700)
      const tClear = setTimeout(() => dispatch({ type: "CLEAR_MESSAGE"       }), 2000)
      return () => { clearTimeout(tFade); clearTimeout(tClear) }
    }

    // Lost messages persist until RESTART — no timer set.
  }, [state.message, state.status])

  // ── Auto-clear shake after animation completes (600ms) ────────────────
  useEffect(() => {
    if (state.shakingRow === null) return
    const t = setTimeout(() => dispatch({ type: "CLEAR_SHAKE" }), 600)
    return () => clearTimeout(t)
  }, [state.shakingRow, state.shakeKey])

  // ── Finish animation after last tile flips ─────────────────────────────
  // Last tile delay = (WORD_LENGTH - 1) * 100ms, animation = 500ms → ~600ms total
  useEffect(() => {
    if (state.revealingRow === null) return
    const totalMs = (WORD_LENGTH - 1) * 100 + 500 + 50 // +50ms buffer
    const t = setTimeout(() => dispatch({ type: "REVEAL_DONE" }), totalMs)
    return () => clearTimeout(t)
  }, [state.revealingRow])

  // ── Public API ─────────────────────────────────────────────────────────
  const handleKey = useCallback((key: string) => {
    dispatch({ type: "KEY", key: key.toLowerCase() })
  }, [])

  const handleBackspace = useCallback(() => {
    dispatch({ type: "BACKSPACE" })
  }, [])

  const handleSubmit = useCallback(() => {
    dispatch({ type: "SUBMIT" })
  }, [])

  const handleRestart = useCallback(() => {
    // selectWord() is called here (hook level, always client-side) so the
    // reducer stays pure and SSR never touches word-selection logic.
    dispatch({ type: "RESTART", word: selectWord() })
  }, [])

  return {
    ...state,
    handleKey,
    handleBackspace,
    handleSubmit,
    handleRestart,
  }
}
