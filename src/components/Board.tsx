"use client"

// src/components/Board.tsx
// 6 × 5 grid of Tile components.
//
// Tile sizing: each row height is clamp(44px, 8dvh, 62px), driving tiles from
// 44 px on very short phones up to 62 px on larger screens.  The board's width
// is fit-content so it naturally hugs exactly 5 tiles + 4 gaps.

import { Tile } from "./Tile"
import { WORD_LENGTH, MAX_GUESSES } from "@/hooks/useGame"

interface BoardProps {
  guesses: string[]
  evaluations: ("correct" | "present" | "absent")[][]
  currentInput: string
  revealingRow: number | null
  shakingRow: number | null
  shakeKey: number
}

// Tile size used both here (grid row height) and in Tile.tsx (width / height).
// Keeping the string in one place avoids drift between the two files.
export const TILE_SIZE = "clamp(44px, 8dvh, 62px)"

export function Board({ guesses, evaluations, currentInput, revealingRow, shakingRow, shakeKey }: BoardProps) {
  return (
    <div
      style={{
        display: "grid",
        // Row height scales with viewport height, capped at the original 62 px.
        gridTemplateRows: `repeat(${MAX_GUESSES}, ${TILE_SIZE})`,
        gap: 5,
        // width is derived from tile content so it always hugs the tiles exactly.
        width: "fit-content",
      }}
      aria-label="game board"
    >
      {Array.from({ length: MAX_GUESSES }, (_, rowIdx) => {
        const submittedGuess = guesses[rowIdx]
        const evaluation = evaluations[rowIdx] ?? null
        const isCurrentRow = rowIdx === guesses.length && !submittedGuess
        const isRevealing = revealingRow === rowIdx
        const isShaking = shakingRow === rowIdx
        // Alternate between shake-a / shake-b so the animation re-triggers
        // even when the same row is rejected twice in a row.
        const shakeName = shakeKey % 2 === 0 ? "shake-a" : "shake-b"

        return (
          <div
            key={rowIdx}
            // className drives the shake animation (not inline style).
            // Toggling a CSS class is the reliable way to trigger a CSS
            // animation from React — the browser always sees it as a fresh
            // animation-start, whereas toggling animation: "none" ↔ value
            // in an inline style can be missed in a single paint frame.
            className={isShaking ? shakeName : undefined}
            style={{ display: "flex", gap: 5 }}
          >
            {Array.from({ length: WORD_LENGTH }, (_, colIdx) => {
              let letter = ""
              let evalState: "correct" | "present" | "absent" | null = null
              let isFilled = false

              if (submittedGuess) {
                // Committed row – pass evaluation even during animation so the
                // back face (which becomes visible mid-flip) already has its colour.
                letter = submittedGuess[colIdx] ?? ""
                evalState = evaluation?.[colIdx] ?? null
                isFilled = true
              } else if (isCurrentRow) {
                // Active row being typed
                letter = currentInput[colIdx] ?? ""
                isFilled = !!currentInput[colIdx]
              }

              return (
                <Tile
                  key={colIdx}
                  letter={letter.toUpperCase()}
                  evaluation={evalState}
                  isRevealing={isRevealing && !!submittedGuess}
                  revealDelay={colIdx * 100}
                  isFilled={isFilled}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
