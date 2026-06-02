"use client"

// src/components/Board.tsx
// 6 × 5 grid of Tile components.
//
// Tile sizing: each row height is clamp(44px, 8dvh, 62px), driving tiles from
// 44 px on very short phones up to 62 px on larger screens.  The board's width
// is fit-content so it naturally hugs exactly 5 tiles + 4 gaps.

import { Tile } from "./Tile"
import { MAX_GUESSES } from "@/hooks/useGame"

interface BoardProps {
  wordLength: number
  guesses: string[]
  evaluations: ("correct" | "present" | "absent")[][]
  currentInput: string
  revealingRow: number | null
  shakingRow: number | null
  shakeKey: number
  onGuessClick?: (word: string) => void
}

// Tile size: height-based clamp capped further by available width so 6 tiles
// never overflow a narrow screen.  The formula reserves 16px horizontal page
// padding and (wordLength-1)*5px for inter-tile gaps.
// min() picks the smaller of the height-driven size and the width-driven limit.
export function getTileSize(wordLength: number): string {
  const gapTotal = (wordLength - 1) * 5
  return `min(clamp(44px, 8svh, 62px), calc((min(100vw, 500px) - 16px - ${gapTotal}px) / ${wordLength}))`
}

export function Board({ wordLength, guesses, evaluations, currentInput, revealingRow, shakingRow, shakeKey, onGuessClick }: BoardProps) {
  const tileSize = getTileSize(wordLength)
  return (
    <div
      style={{
        display: "grid",
        // Row height scales with viewport height, width-capped for 6-letter boards.
        gridTemplateRows: `repeat(${MAX_GUESSES}, ${tileSize})`,
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
            className={
              isShaking ? shakeName :
              (submittedGuess && !isRevealing && onGuessClick) ? "guess-row-clickable" :
              undefined
            }
            onClick={
              submittedGuess && !isRevealing && onGuessClick
                ? () => onGuessClick(submittedGuess)
                : undefined
            }
            style={{ display: "flex", gap: 5 }}
          >
            {Array.from({ length: wordLength }, (_, colIdx) => {
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
                  revealDelay={colIdx * 350}
                  isFilled={isFilled}
                  size={tileSize}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
