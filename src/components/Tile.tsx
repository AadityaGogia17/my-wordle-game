"use client"

// src/components/Tile.tsx
// Single grid cell with a two-face card-flip animation.
//
// Animation design:
//   - Front face: white/bordered (pre-reveal)
//   - Back face:  coloured (green / yellow / gray)
//   - On reveal: parent rotates -180° on the X axis.
//     At 90° both faces are edge-on (invisible).
//     Past 90°, backface-visibility:hidden hides the front and shows the back.
//   - Stagger: each tile in a row starts (tileIndex * 100) ms later.
//
// Sizing: width and height both use the same TILE_SIZE clamp imported from
// Board.tsx so the tile is always square and always matches the grid row height.

import { TILE_SIZE } from "./Board"

interface TileProps {
  letter: string
  /** null = not yet evaluated (current-input or empty row) */
  evaluation: "correct" | "present" | "absent" | null
  /** true while this tile's flip is in flight */
  isRevealing: boolean
  revealDelay: number // ms
  /** true when the tile has a letter but hasn't been submitted yet */
  isFilled: boolean
}

const BACK_COLORS: Record<"correct" | "present" | "absent", string> = {
  correct: "#6aaa64",
  present: "#c9b458",
  absent:  "#787c7e",
}

export function Tile({ letter, evaluation, isRevealing, revealDelay, isFilled }: TileProps) {
  // Once a row has been revealed (evaluation set and animation complete),
  // we keep the back face permanently visible by freezing at -180 deg.
  const isRevealed = evaluation !== null && !isRevealing

  const backColor = evaluation ? BACK_COLORS[evaluation] : "transparent"

  // Front face border must never reveal the evaluation color during the flip.
  // isRevealed is false while isRevealing is true, so the front face stays
  // neutral (#888 filled, #d3d6da empty) for the full animation duration.
  // Only after the flip completes does isRevealed become true — at which point
  // the front face is hidden by backface-visibility anyway, making the color
  // value irrelevant (kept as backColor for stylistic consistency).
  const frontBorderColor = isRevealed ? backColor : isFilled ? "#888" : "#d3d6da"

  return (
    <div
      style={{
        perspective: "250px",
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
      aria-label={letter || "empty"}
    >
      {/* Inner wrapper that rotates */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: isRevealed ? "rotateX(-180deg)" : "rotateX(0deg)",
          animation: isRevealing
            ? `tile-flip 600ms ease ${revealDelay}ms forwards`
            : isFilled && !evaluation && letter
            ? "tile-pop 100ms ease"
            : "none",
        }}
      >
        {/* ── Front face ──────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `3px solid ${frontBorderColor}`,
            backgroundColor: "#fff",
            fontSize: "2rem",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#1a1a1b",
            userSelect: "none",
          }}
        >
          {letter}
        </div>

        {/* ── Back face (coloured) ────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateX(180deg)", // hidden initially
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `3px solid ${backColor}`,
            backgroundColor: backColor,
            fontSize: "2rem",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#fff",
            userSelect: "none",
          }}
        >
          {letter}
        </div>
      </div>
    </div>
  )
}
