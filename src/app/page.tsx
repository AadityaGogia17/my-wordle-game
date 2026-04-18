"use client"

// src/app/page.tsx
// Main game page – wires useGame to all visual components.

import { useEffect, useRef, useState } from "react"
import confetti from "canvas-confetti"
import { useGame } from "@/hooks/useGame"
import { Board } from "@/components/Board"
import { Keyboard } from "@/components/Keyboard"
import { Message } from "@/components/Message"
import { WordDefinition, type Meaning } from "@/components/WordDefinition"

export default function GamePage() {
  const {
    secretWord,
    guesses,
    evaluations,
    currentInput,
    status,
    message,
    messageFadingOut,
    letterStates,
    revealingRow,
    shakingRow,
    shakeKey,
    handleKey,
    handleBackspace,
    handleSubmit,
    handleRestart,
  } = useGame()

  // Track when the Play Again button should appear.
  const [playAgainVisible, setPlayAgainVisible] = useState(false)
  const [showDefinition, setShowDefinition] = useState(false)
  const definitionRef = useRef<HTMLDivElement>(null)

  // Pre-fetched definition data — populated as soon as the game ends.
  const [defMeanings, setDefMeanings] = useState<Meaning[] | null>(null)
  const [defLoading, setDefLoading] = useState(false)
  const [defError, setDefError] = useState(false)

  // Confetti: fires when the win toast appears (REVEAL_DONE sets message).
  useEffect(() => {
    if (status !== "won" || !message) return
    const end = Date.now() + 1500
    const frame = () => {
      confetti({ particleCount: 6, angle: 60,  spread: 55, origin: { x: 0 } })
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [status, message])

  // Play Again visibility — keyed on status only so the timer is never
  // cancelled by CLEAR_MESSAGE nulling out `message` mid-countdown.
  // Delays are measured from SUBMIT (when status changes):
  //   reveal animation ≈ 1750 ms, then:
  //   won  → +1450 ms (appears as confetti winds down, ~3200 ms total)
  //   lost → +500 ms pause after the word is shown (~2250 ms total)
  useEffect(() => {
    if (status === "playing") {
      setPlayAgainVisible(false)
      setShowDefinition(false)
      setDefMeanings(null)
      setDefLoading(false)
      setDefError(false)
      return
    }

    // Pre-fetch definition as soon as the game ends.
    if (secretWord) {
      setDefLoading(true)
      setDefError(false)
      setDefMeanings(null)
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${secretWord}`)
        .then((r) => { if (!r.ok) throw new Error(); return r.json() })
        .then((data) => {
          const results: Meaning[] = []
          for (const entry of data) {
            for (const m of entry.meanings ?? []) {
              const def = m.definitions?.[0]?.definition
              if (def && results.length < 3) results.push({ partOfSpeech: m.partOfSpeech, definition: def })
            }
          }
          setDefMeanings(results.length ? results : null)
          if (!results.length) setDefError(true)
        })
        .catch(() => setDefError(true))
        .finally(() => setDefLoading(false))
    }
    const delay = status === "won" ? 3200 : 2250
    const t = setTimeout(() => setPlayAgainVisible(true), delay)
    return () => clearTimeout(t)
  }, [status])

  // Custom eased scroll — scrolls so the bottom of the definition is fully visible.
  // Uses easeInOutCubic over 900 ms for a smooth glide.
  const scrollToDefinition = () => {
    const el = definitionRef.current
    if (!el) return
    const targetY = el.getBoundingClientRect().bottom + window.scrollY - window.innerHeight + 16
    const startY = window.scrollY
    const distance = targetY - startY
    if (distance <= 0) return
    const duration = 900
    const startTime = performance.now()
    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      window.scrollTo(0, startY + distance * ease)
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  useEffect(() => {
    if (showDefinition) scrollToDefinition()
  }, [showDefinition])

  return (
    // Outer shell: always min-height viewport, scrollable. During play there is
    // nothing below the keyboard so no scrollbar appears — layout is identical
    // to height: 100dvh. When the definition panel is shown it extends below
    // and the page scrolls naturally without any reflow.
    <div
      style={{
        minHeight: "100svh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      {/* ── Toast message (fixed, outside flow) ────────────────────────── */}
      <Message message={message} fadingOut={messageFadingOut} />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header
        style={{
          width: "100%",
          borderBottom: "1px solid #d3d6da",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
          height: 56,
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#1a1a1b",
            margin: 0,
            userSelect: "none",
          }}
        >
          Wordl
        </h1>
      </header>

      {/* ── Main content ───────────────────────────────────────────────── */}
      {/*
       * flex: 1 + minHeight: 0 lets this shrink below its content size so
       * overflow: hidden actually clips — without minHeight: 0 the flex
       * algorithm refuses to shrink a child below its min-content height.
       */}
      <main
        style={{
          height: "calc(100svh - 56px)",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 500,
          padding: "10px 8px 8px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* ── Board area: fills all space above the keyboard section ─── */}
        {/*
         * flex: 1 + minHeight: 0 on this wrapper means it takes every pixel
         * not claimed by the bottom section. The board is centered within it
         * so on large screens (where tiles hit their 62px max) the extra
         * space appears as padding above and below the grid.
         */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Board
            guesses={guesses}
            evaluations={evaluations}
            currentInput={currentInput}
            revealingRow={revealingRow}
            shakingRow={shakingRow}
            shakeKey={shakeKey}
          />
        </div>

        {/* ── Bottom section: button (when game ends) + keyboard ──────── */}
        <div
          style={{
            flexShrink: 0,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            paddingTop: 8,
          }}
        >
          {/* End-game buttons — only rendered after win or loss. */}
          {playAgainVisible && (
            <div
              style={{
                display: "flex",
                gap: 10,
                animation: "button-fade-in 400ms ease forwards",
              }}
            >
              <button
                onClick={handleRestart}
                style={{
                  padding: "10px 24px",
                  borderRadius: 4,
                  border: "2px solid #6aaa64",
                  backgroundColor: "#fff",
                  color: "#6aaa64",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  transition: "all 0.15s",
                }}
              >
                Play Again
              </button>
              <button
                onClick={() => {
                  if (!showDefinition) {
                    setShowDefinition(true)
                  } else {
                    scrollToDefinition()
                  }
                }}
                style={{
                  padding: "10px 24px",
                  borderRadius: 4,
                  border: "2px solid #6aaa64",
                  backgroundColor: "#6aaa64",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  transition: "all 0.15s",
                }}
              >
                Explain Word
              </button>
            </div>
          )}

          {/* Keyboard */}
          <Keyboard
            letterStates={letterStates}
            onKey={handleKey}
            onBackspace={handleBackspace}
            onEnter={handleSubmit}
          />
        </div>
      </main>

      {/* Definition panel — outside main so it never affects the clipped layout above. */}
      {showDefinition && secretWord && (
        <div
          ref={definitionRef}
          style={{
            width: "100%",
            maxWidth: 500,
            padding: "0 8px 16px",
            boxSizing: "border-box",
          }}
        >
          <WordDefinition
            word={secretWord}
            meanings={defMeanings}
            loading={defLoading}
            error={defError}
          />
        </div>
      )}
    </div>
  )
}
