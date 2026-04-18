"use client"

export interface Meaning {
  partOfSpeech: string
  definition: string
}

interface Props {
  word: string
  meanings: Meaning[] | null
  loading: boolean
  error: boolean
}

export function WordDefinition({ word, meanings, loading, error }: Props) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "12px auto 0",
        padding: "16px 20px 20px",
        backgroundColor: "#f6f6f6",
        borderRadius: 8,
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#787c7e",
          margin: "0 0 14px",
        }}
      >
        Definition
      </p>
      <p
        style={{
          fontSize: "0.85rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#1a1a1b",
          margin: "0 0 12px",
        }}
      >
        {word.toUpperCase()}
      </p>

      {loading && (
        <p style={{ fontSize: "0.9rem", color: "#787c7e", margin: 0 }}>
          Loading…
        </p>
      )}

      {error && (
        <p style={{ fontSize: "0.9rem", color: "#787c7e", margin: 0 }}>
          No definition found.
        </p>
      )}

      {meanings && (
        <ol style={{ margin: 0, padding: "0 0 0 18px", lineHeight: 1.5 }}>
          {meanings.map((m, i) => (
            <li key={i} style={{ marginBottom: i < meanings.length - 1 ? 10 : 0 }}>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontStyle: "italic",
                  color: "#787c7e",
                  marginRight: 6,
                }}
              >
                {m.partOfSpeech}
              </span>
              <span style={{ fontSize: "0.92rem", color: "#1a1a1b" }}>
                {m.definition}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
