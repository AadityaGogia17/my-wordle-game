import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Wordl",
  description: "A Wordle-style word guessing game. Guess the 5-letter word in 6 tries.",
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/*
        suppressHydrationWarning: browser extensions (e.g. Grammarly) inject
        custom data-* attributes into <body> before React hydrates, causing a
        false-positive hydration mismatch. This prop silences that one element
        without suppressing warnings for the rest of the tree.
      */}
      <body
        suppressHydrationWarning
        style={{ margin: 0, padding: 0, fontFamily: "'Clear Sans', 'Helvetica Neue', Arial, sans-serif" }}
      >
        {children}
      </body>
    </html>
  )
}
