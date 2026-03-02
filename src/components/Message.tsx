"use client"

// src/components/Message.tsx
// Toast notification area – appears above the board.

interface MessageProps {
  message: string | null
  fadingOut?: boolean
}

export function Message({ message, fadingOut = false }: MessageProps) {
  if (!message) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 80,
        left: "50%",
        // transform is omitted here — the keyframes own it entirely so the
        // animation values are never in conflict with an inline transform.
        backgroundColor: "#1a1a1b",
        color: "#fff",
        padding: "10px 18px",
        borderRadius: 6,
        fontWeight: 700,
        fontSize: "0.95rem",
        zIndex: 100,
        pointerEvents: "none",
        whiteSpace: "nowrap",
        letterSpacing: "0.05em",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        // Both animations use fill-mode "forwards" so their final keyframe
        // state is held after completion:
        //   fade-in  → holds translateX(-50%) translateY(0) so the toast
        //              stays centred once the 150ms entrance finishes.
        //   fade-out → holds opacity:0 until React unmounts the element
        //              ~300ms later when CLEAR_MESSAGE fires.
        // Without "forwards" on fade-in the keyframe transform is released
        // after 150ms, causing the element to snap right (left:50%, no offset).
        animation: fadingOut
          ? "fade-out 300ms ease forwards"
          : "fade-in 150ms ease forwards",
      }}
    >
      {message}
    </div>
  )
}
