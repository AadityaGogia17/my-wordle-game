"use client"

// src/app/page.tsx
// Main game page – wires useGame to all visual components.

import { useGame } from "@/hooks/useGame"
import { Board } from "@/components/Board"
import { Keyboard } from "@/components/Keyboard"
import { Message } from "@/components/Message"

export default function GamePage() {
  const {
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

  return (
    // Outer shell: exactly one viewport tall, no overflow.
    // alignItems: center handles horizontal centering of header + main.
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#fff",
        overflow: "hidden",
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
          flex: 1,
          minHeight: 0,
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
            gap: 8,
            paddingTop: 8,
          }}
        >
          {/* Restart button — only rendered after win or loss.
              Conditionally mounting (not just hiding) means the element
              takes no space during play, so the keyboard sits flush at the
              bottom of the bottom-section without a gap above it. */}
          {status !== "playing" && (
            <button
              onClick={handleRestart}
              style={{
                padding: "10px 24px",
                borderRadius: 4,
                border: "2px solid #1a1a1b",
                backgroundColor: "#1a1a1b",
                color: "#fff",
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
    </div>
  )
}
