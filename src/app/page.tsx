"use client"

// src/app/page.tsx
// Main game page – mode selection screen, then wires useGame to all visual components.

import { useEffect, useRef, useState } from "react"
import confetti from "canvas-confetti"
import { useGame } from "@/hooks/useGame"
import { Board } from "@/components/Board"
import { Keyboard } from "@/components/Keyboard"
import { Message } from "@/components/Message"
import { WordDefinition, type Meaning } from "@/components/WordDefinition"

// ── Mode Selection Screen ──────────────────────────────────────────────────

function ModeSelect({ onSelect }: { onSelect: (mode: 5 | 6) => void }) {
  const [selected, setSelected] = useState<5 | 6 | null>(null)

  return (
    <main
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "0 24px 40px",
        width: "100%",
        maxWidth: 500,
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#787c7e",
          fontSize: "0.95rem",
          letterSpacing: "0.05em",
        }}
      >
        Choose your game mode
      </p>

      {/* Mode option buttons */}
      <div style={{ display: "flex", gap: 16, width: "100%" }}>
        {([5, 6] as const).map((n) => (
          <button
            key={n}
            onClick={() => setSelected(n)}
            style={{
              flex: 1,
              padding: "20px 0",
              borderRadius: 8,
              border: `2px solid ${selected === n ? "#6aaa64" : "#d3d6da"}`,
              backgroundColor: "#fff",
              color: selected === n ? "#6aaa64" : "#1a1a1b",
              fontWeight: 700,
              fontSize: "1.1rem",
              letterSpacing: "0.08em",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {n} Letters
          </button>
        ))}
      </div>

      {/* Play button – disabled until a mode is selected */}
      <button
        disabled={selected === null}
        onClick={() => selected !== null && onSelect(selected)}
        style={{
          padding: "12px 40px",
          borderRadius: 4,
          border: "none",
          backgroundColor: selected !== null ? "#6aaa64" : "#d3d6da",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: selected !== null ? "pointer" : "default",
          transition: "background-color 0.15s",
        }}
      >
        Play
      </button>
    </main>
  )
}

// ── Game ──────────────────────────────────────────────────────────────────────

function Game({
  wordLength,
  onChangeMode,
}: {
  wordLength: 5 | 6
  onChangeMode: () => void
}) {
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
  } = useGame(wordLength)

  const [playAgainVisible, setPlayAgainVisible] = useState(false)
  const [definitionWord, setDefinitionWord] = useState<string | null>(null)
  const definitionRef = useRef<HTMLDivElement>(null)

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

  // Play Again visibility — delays computed from wordLength to account for longer
  // 6-letter reveal animation.  revealDoneMs mirrors the REVEAL_DONE timer in
  // useGame.ts: (wordLength-1)*350 + 600 + 50 ms after SUBMIT.
  useEffect(() => {
    if (status === "playing") {
      setPlayAgainVisible(false)
      setDefinitionWord(null)
      return
    }
    const revealDoneMs = (wordLength - 1) * 350 + 600 + 50
    // won: buttons appear as confetti winds down (+1150 ms after REVEAL_DONE)
    // lost: short pause after the secret word is shown (+200 ms)
    const delay = status === "won" ? revealDoneMs + 1150 : revealDoneMs + 200
    const t = setTimeout(() => setPlayAgainVisible(true), delay)
    return () => clearTimeout(t)
  }, [status, wordLength])

  // Fetch definition whenever the user picks a word to explain.
  // Calls our API route which tries dictionaryapi.dev then falls back to Merriam-Webster.
  // The cleanup cancels stale responses if the user switches words quickly.
  useEffect(() => {
    if (!definitionWord) return
    let cancelled = false
    setDefLoading(true)
    setDefError(false)
    setDefMeanings(null)
    fetch(`/api/define/${definitionWord}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then((data) => {
        if (cancelled) return
        if (data.meanings) {
          setDefMeanings(data.meanings)
        } else {
          setDefMeanings(null)
          setDefError(true)
        }
      })
      .catch(() => { if (!cancelled) setDefError(true) })
      .finally(() => { if (!cancelled) setDefLoading(false) })
    return () => { cancelled = true }
  }, [definitionWord])

  // Custom eased scroll — scrolls so the bottom of the definition is fully visible.
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
    if (definitionWord) scrollToDefinition()
  }, [definitionWord])

  return (
    <>
      {/* ── Toast message (fixed, outside flow) ──────────────────────────── */}
      <Message message={message} fadingOut={messageFadingOut} />

      {/* ── Main game area ────────────────────────────────────────────────── */}
      {/*
       * height: calc(100svh - 56px) clips to exactly the viewport below the
       * header, hiding any overflow.  When the definition panel is visible it
       * lives outside this main so the page scrolls naturally.
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
        {/* Board area: fills all space above the bottom section */}
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
            wordLength={wordLength}
            guesses={guesses}
            evaluations={evaluations}
            currentInput={currentInput}
            revealingRow={revealingRow}
            shakingRow={shakingRow}
            shakeKey={shakeKey}
            onGuessClick={(word) => {
              if (definitionWord === word) {
                scrollToDefinition()
              } else {
                setDefinitionWord(word)
              }
            }}
          />
        </div>

        {/* Bottom section: end-game buttons (when visible) + keyboard */}
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
          {/* End-game buttons — Explain Word (top), then Change Mode + Play Again (bottom row) */}
          {playAgainVisible && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                animation: "button-fade-in 400ms ease forwards",
                width: "100%",
                maxWidth: 340,
              }}
            >
              {/* 1 — Explain Word (full width, primary) */}
              <button
                onClick={() => {
                  if (definitionWord !== secretWord) {
                    setDefinitionWord(secretWord)
                  } else {
                    scrollToDefinition()
                  }
                }}
                style={{
                  padding: "10px 0",
                  width: "100%",
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

              {/* 2 + 3 — Change Mode and Play Again side by side */}
              <div style={{ display: "flex", gap: 8, width: "100%" }}>
                <button
                  onClick={onChangeMode}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 4,
                    border: "2px solid #d3d6da",
                    backgroundColor: "#fff",
                    color: "#787c7e",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    transition: "all 0.15s",
                  }}
                >
                  Change Mode
                </button>
                <button
                  onClick={handleRestart}
                  style={{
                    flex: 1,
                    padding: "10px 0",
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
              </div>
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
      {definitionWord && (
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
            word={definitionWord}
            meanings={defMeanings}
            loading={defLoading}
            error={defError}
          />
        </div>
      )}
    </>
  )
}

// ── Page shell ────────────────────────────────────────────────────────────────

export default function GamePage() {
  const [mode, setMode] = useState<5 | 6 | null>(null)

  return (
    // Outer shell: always min-height viewport, scrollable. During play there is
    // nothing below the keyboard so no scrollbar appears. When the definition
    // panel is shown it extends below and the page scrolls naturally.
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
      {/* ── Header ───────────────────────────────────────────────────────── */}
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
          Bundl
        </h1>
      </header>

      {/* ── Content: mode selector or active game ──────────────────────── */}
      {mode === null ? (
        <ModeSelect onSelect={setMode} />
      ) : (
        <Game wordLength={mode} onChangeMode={() => setMode(null)} />
      )}
    </div>
  )
}
