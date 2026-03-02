"use client"

// src/components/Keyboard.tsx
// On-screen QWERTY keyboard with per-key colour state.
// Colour priority enforced in useGame: correct > present > absent.
//
// Key sizing:
//   Height: clamp(40px, 6dvh, 58px) — scales with viewport height.
//   Width:  flex-based (regular flex:1, wide keys flex:1.5) so all keys fill
//           the available container width at any screen size, eliminating the
//           horizontal overflow that fixed 43 px keys caused on narrow phones.

interface KeyboardProps {
  letterStates: Record<string, "correct" | "present" | "absent">
  onKey: (key: string) => void
  onBackspace: () => void
  onEnter: () => void
}

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["Enter", "z", "x", "c", "v", "b", "n", "m", "⌫"],
]

const KEY_COLORS: Record<"correct" | "present" | "absent", string> = {
  correct: "#6aaa64",
  present: "#c9b458",
  absent:  "#787c7e",
}

// Key height shared by both regular and wide keys.
const KEY_HEIGHT = "clamp(40px, 6dvh, 58px)"

interface KeyProps {
  label: string
  state?: "correct" | "present" | "absent"
  isWide?: boolean
  onPress: () => void
}

function Key({ label, state, isWide, onPress }: KeyProps) {
  const bg = state ? KEY_COLORS[state] : "#d3d6da"
  const fg = state ? "#fff" : "#1a1a1b"

  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault() // prevent focus steal on mobile
        onPress()
      }}
      aria-label={label === "⌫" ? "backspace" : label}
      style={{
        // flex factor: wide keys (Enter / ⌫) take 1.5× the space of a regular key.
        // Combined with width: 100% on each row, all keys fill the container
        // at every screen width without overflowing or leaving gaps.
        flex: isWide ? 1.5 : 1,
        minWidth: 0,
        height: KEY_HEIGHT,
        borderRadius: 4,
        border: "none",
        backgroundColor: bg,
        color: fg,
        fontWeight: 700,
        fontSize: label.length > 1 ? "0.75rem" : "0.9rem",
        textTransform: label.length === 1 ? "uppercase" : "none",
        cursor: "pointer",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "manipulation",
        transition: "background-color 0.1s",
      }}
    >
      {label}
    </button>
  )
}

export function Keyboard({ letterStates, onKey, onBackspace, onEnter }: KeyboardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "center",
        width: "100%",
      }}
    >
      {ROWS.map((row, rowIdx) => (
        // width: 100% ensures the flex key children distribute across the full
        // container width regardless of how many keys are in this row.
        <div key={rowIdx} style={{ display: "flex", gap: 5, width: "100%" }}>
          {row.map((key) => {
            if (key === "Enter") {
              return (
                <Key
                  key="Enter"
                  label="Enter"
                  isWide
                  onPress={onEnter}
                />
              )
            }
            if (key === "⌫") {
              return (
                <Key
                  key="⌫"
                  label="⌫"
                  isWide
                  onPress={onBackspace}
                />
              )
            }
            return (
              <Key
                key={key}
                label={key}
                state={letterStates[key]}
                onPress={() => onKey(key)}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
