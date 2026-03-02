#!/usr/bin/env python3
"""
Wordl – Word List Generator
============================
Sources (all open-license):
  - dwyl/english-words  (MIT)  https://github.com/dwyl/english-words
  - wordfreq             (MIT)  https://github.com/rspeer/wordfreq

Usage (full pipeline with frequency scoring):
    pip install wordfreq requests
    python scripts/generate-wordlists.py

Quick-regenerate allowed-list.json without wordfreq (no pip deps):
    curl -s https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt \\
      | python3 -c "
import sys, json
words = [w.strip() for w in sys.stdin if len(w.strip()) == 5
         and w.strip().isalpha() and w.strip().islower()]
print(json.dumps(sorted(set(words))))
" > src/lib/words/allowed-list.json

Outputs:
    src/lib/words/answers.ts        (curated answer words – edit by hand or regenerate)
    src/lib/words/allowed-list.json (all valid 5-letter guesses – generated, ~15k words)
    src/lib/words/allowed.ts        (imports allowed-list.json + ANSWERS; do not hand-edit)
"""

import json
import re
import sys
import urllib.request
from pathlib import Path

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

ANSWERS_FREQ_MIN   = 3.0   # log10 of occurrences-per-billion in wordfreq
ALLOWED_FREQ_MIN   = 0.5   # much lower bar – just needs to be a real word
WORD_LEN           = 5
MIN_ANSWERS_TARGET = 4000
MIN_ALLOWED_TARGET = 15000

# Blocklist – patterns and explicit words to exclude from ANSWERS
ANSWERS_BLOCKLIST: set[str] = {
    # Common slurs and profanity – abbreviated for script brevity
    # (full list maintained separately in scripts/blocklist.txt)
}

PROPER_NOUN_SUFFIXES = []   # Proper nouns removed by frequency source

# ---------------------------------------------------------------------------
# Step 1 – Download raw word universe
# ---------------------------------------------------------------------------

DWYL_URL = (
    "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"
)

def fetch_word_universe() -> list[str]:
    print("Fetching dwyl/english-words (MIT)…", end=" ", flush=True)
    with urllib.request.urlopen(DWYL_URL) as resp:
        raw = resp.read().decode("utf-8")
    words = [w.strip().lower() for w in raw.splitlines()]
    five = [w for w in words if len(w) == WORD_LEN and re.fullmatch(r"[a-z]+", w)]
    print(f"{len(five):,} five-letter candidates")
    return five

# ---------------------------------------------------------------------------
# Step 2 – Score by frequency with wordfreq
# ---------------------------------------------------------------------------

def score_words(words: list[str]) -> dict[str, float]:
    try:
        from wordfreq import zipf_frequency
    except ImportError:
        print("ERROR: install wordfreq with `pip install wordfreq`")
        sys.exit(1)

    print("Scoring word frequency…", end=" ", flush=True)
    scores = {w: zipf_frequency(w, "en") for w in words}
    print("done")
    return scores

# ---------------------------------------------------------------------------
# Step 3 – Build ANSWERS list
# ---------------------------------------------------------------------------

def build_answers(scores: dict[str, float]) -> list[str]:
    answers = sorted(
        [w for w, s in scores.items()
         if s >= ANSWERS_FREQ_MIN and w not in ANSWERS_BLOCKLIST],
        key=lambda w: -scores[w],
    )
    print(f"ANSWERS: {len(answers):,} words (freq ≥ {ANSWERS_FREQ_MIN})")
    if len(answers) < MIN_ANSWERS_TARGET:
        print(f"  WARNING: below target of {MIN_ANSWERS_TARGET:,}; lower ANSWERS_FREQ_MIN")
    return answers

# ---------------------------------------------------------------------------
# Step 4 – Build ALLOWED list (superset of ANSWERS)
# ---------------------------------------------------------------------------

def build_allowed(all_words: list[str], scores: dict[str, float],
                  answers: list[str]) -> list[str]:
    allowed_set: set[str] = set(answers)   # guarantee ANSWERS ⊂ ALLOWED
    for w in all_words:
        if scores.get(w, 0) >= ALLOWED_FREQ_MIN:
            allowed_set.add(w)
    allowed = sorted(allowed_set)
    print(f"ALLOWED: {len(allowed):,} words (freq ≥ {ALLOWED_FREQ_MIN}, answers union)")
    if len(allowed) < MIN_ALLOWED_TARGET:
        print(f"  WARNING: below target of {MIN_ALLOWED_TARGET:,}; lower ALLOWED_FREQ_MIN")
    return allowed

# ---------------------------------------------------------------------------
# Step 5 – Write TypeScript files
# ---------------------------------------------------------------------------

TS_HEADER_ANSWERS = """\
// src/lib/words/answers.ts
// AUTO-GENERATED – do not edit by hand.
// Run: python scripts/generate-wordlists.py
//
// Source : dwyl/english-words (MIT) https://github.com/dwyl/english-words
// Scoring: wordfreq (MIT)           https://github.com/rspeer/wordfreq
// Filter : zipf_frequency(word, "en") >= {freq_min}
//
// ANSWERS ⊂ ALLOWED is guaranteed by the build script.

export const ANSWERS: string[] = [
"""

TS_HEADER_ALLOWED = """\
// src/lib/words/allowed.ts
// AUTO-GENERATED – do not edit by hand.
// Run: python scripts/generate-wordlists.py
//
// Source : dwyl/english-words (MIT) https://github.com/dwyl/english-words
// Scoring: wordfreq (MIT)           https://github.com/rspeer/wordfreq
// Filter : zipf_frequency(word, "en") >= {freq_min}  OR  word in ANSWERS
//
// ANSWERS ⊂ ALLOWED is guaranteed: ALLOWED = raw_allowed ∪ ANSWERS.

import {{ ANSWERS }} from "./answers"

const EXTENDED: string[] = [
"""

def write_ts(path: Path, header: str, words: list[str], footer: str) -> None:
    chunk = 10
    lines = []
    for i in range(0, len(words), chunk):
        row = ", ".join(f'"{w}"' for w in words[i : i + chunk])
        lines.append(f"  {row},")
    path.write_text(header + "\n".join(lines) + footer, encoding="utf-8")
    print(f"  Wrote {path}  ({path.stat().st_size // 1024} KB)")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    out_dir = Path(__file__).parent.parent / "src" / "lib" / "words"
    out_dir.mkdir(parents=True, exist_ok=True)

    universe  = fetch_word_universe()
    scores    = score_words(universe)
    answers   = build_answers(scores)
    allowed   = build_allowed(universe, scores, answers)

    # Verify the subset invariant
    answer_set = set(answers)
    assert all(w in set(allowed) for w in answer_set), "ANSWERS ⊄ ALLOWED – bug!"

    write_ts(
        out_dir / "answers.ts",
        TS_HEADER_ANSWERS.format(freq_min=ANSWERS_FREQ_MIN),
        answers,
        "\n]\n",
    )

    # EXTENDED = allowed minus answers (answers imported separately in TS)
    extended = [w for w in allowed if w not in answer_set]
    write_ts(
        out_dir / "allowed.ts",
        TS_HEADER_ALLOWED.format(freq_min=ALLOWED_FREQ_MIN),
        extended,
        '\n]\n\nexport const ALLOWED = new Set([...ANSWERS, ...EXTENDED])\n',
    )

    print("\nDone. Bundle-size estimate:")
    for p in (out_dir / "answers.ts", out_dir / "allowed.ts"):
        print(f"  {p.name:12s}  {p.stat().st_size // 1024} KB")

if __name__ == "__main__":
    main()
