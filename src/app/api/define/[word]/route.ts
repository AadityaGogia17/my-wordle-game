// src/app/api/define/[word]/route.ts
// Server-side definition lookup.
// Tries dictionaryapi.dev first; falls back to Merriam-Webster if no results.

import { NextResponse } from "next/server"

interface Meaning {
  partOfSpeech: string
  definition: string
}

async function fetchFreeDict(word: string): Promise<Meaning[]> {
  try {
    const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if (!r.ok) return []
    const data = await r.json()
    const results: Meaning[] = []
    for (const entry of data) {
      for (const m of entry.meanings ?? []) {
        const def = m.definitions?.[0]?.definition
        if (def && results.length < 3) results.push({ partOfSpeech: m.partOfSpeech, definition: def })
      }
    }
    return results
  } catch {
    return []
  }
}

async function fetchMerriamWebster(word: string): Promise<Meaning[]> {
  const key = process.env.MERRIAM_WEBSTER_API_KEY
  if (!key) return []
  try {
    const r = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${key}`
    )
    if (!r.ok) return []
    const data = await r.json()
    const results: Meaning[] = []
    for (const entry of data) {
      // String entries are spelling suggestions (word not found) — skip them.
      if (typeof entry !== "object" || !Array.isArray(entry.shortdef)) continue
      const partOfSpeech = entry.fl ?? "unknown"
      for (const def of entry.shortdef as string[]) {
        if (results.length < 3) results.push({ partOfSpeech, definition: def })
      }
    }
    return results
  } catch {
    return []
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ word: string }> }
) {
  const { word } = await params
  const normalised = word.toLowerCase().trim()

  let meanings = await fetchFreeDict(normalised)

  if (!meanings.length) {
    meanings = await fetchMerriamWebster(normalised)
  }

  return NextResponse.json(
    meanings.length ? { meanings } : { meanings: null, error: true }
  )
}
